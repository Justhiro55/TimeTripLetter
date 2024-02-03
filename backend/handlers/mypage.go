package handlers

import (
    "encoding/json"
    "log"
    "net/http"
    "strconv"
    "time"

    "github.com/dgrijalva/jwt-go"
    "myapp/db"
)

// LetterRecipientInfo はレターとその受取人の情報を表す構造体です。
type LetterRecipientInfo struct {
    LetterID  int    `json:"letter_id"`
    RecipientName string `json:"recipient_name"`
    SendDate   string `json:"send_date"`
}

// UserInfo はユーザー情報を表す構造体です。
type UserInfo struct {
    Username string `json:"username"`
    Email    string `json:"email"`
}

func MyPageHandler(w http.ResponseWriter, r *http.Request) {
    // JWTトークンからユーザーIDを取得
    var userID int64
    accessTokenCookie, err := r.Cookie("accessToken")
    if err != nil || accessTokenCookie.Value == "" {
        log.Println("No access token found, looking for refresh token")
        refreshTokenCookie, err := r.Cookie("refreshToken")
        if err != nil || refreshTokenCookie.Value == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        refreshTokenString := refreshTokenCookie.Value
        refreshTokenClaims := &jwt.StandardClaims{}
        _, err = jwt.ParseWithClaims(refreshTokenString, refreshTokenClaims, func(token *jwt.Token) (interface{}, error) {
            return []byte("your_secret_key"), nil
        })

        if err != nil {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        userID, _ = strconv.ParseInt(refreshTokenClaims.Subject, 10, 64)
        newAccessToken, _ := generateToken(userID)
        
        http.SetCookie(w, &http.Cookie{
            Name:     "accessToken",
            Value:    newAccessToken,
            Expires:  time.Now().Add(100 * time.Minute),
            HttpOnly: true,
            Path:     "/",
            Secure:   false, // HTTPSを使用する場合はtrueに変更
            SameSite: http.SameSiteStrictMode,
        })
    } else {
        accessTokenString := accessTokenCookie.Value
        accessTokenClaims := &jwt.StandardClaims{}
        _, err := jwt.ParseWithClaims(accessTokenString, accessTokenClaims, func(token *jwt.Token) (interface{}, error) {
            return []byte("your_secret_key"), nil
        })

        if err != nil {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        userID, _ = strconv.ParseInt(accessTokenClaims.Subject, 10, 64)
        
        if err != nil {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }
    }

    log.Printf("UserID extracted from token: %d", userID)

    // ユーザー情報を取得
    var userInfo UserInfo
    userQuery := `SELECT username, email FROM users WHERE id = $1`
    log.Printf("Executing user query: %s with userID: %d", userQuery, userID)

    err = db.DB.QueryRow(userQuery, userID).Scan(&userInfo.Username, &userInfo.Email)
    if err != nil {
        log.Printf("Error querying database for user info: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    log.Printf("Found user info: Username: %s, Email: %s", userInfo.Username, userInfo.Email)

    // 送信したレターと受取人情報を取得
    var letterRecipients []LetterRecipientInfo
    query := `SELECT l.id, r.name, r.send_date
              FROM letter l
              JOIN recipient r ON l.id = r.letter_id
              WHERE l.user_id = $1`
    log.Printf("Executing query: %s with userID: %d", query, userID)

    rows, err := db.DB.Query(query, userID)
    if err != nil {
        log.Printf("Error querying database for letters and recipients: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    for rows.Next() {
        var info LetterRecipientInfo
        if err := rows.Scan(&info.LetterID, &info.RecipientName, &info.SendDate); err != nil {
            log.Printf("Error scanning letter recipient info: %s", err)
            continue
        }
        letterRecipients = append(letterRecipients, info)
    }

    log.Printf("Found %d letter recipient(s)", len(letterRecipients))

    // レスポンスを返す
    w.Header().Set("Content-Type", "application/json")
    response := map[string]interface{}{
        "letterRecipients": letterRecipients,
        "userInfo":         userInfo,
    }
    if err := json.NewEncoder(w).Encode(response); err != nil {
        log.Printf("Error encoding response: %s", err)
    }
}
