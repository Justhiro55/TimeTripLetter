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

func LetterHandler(w http.ResponseWriter, r *http.Request) {

    if err := r.ParseMultipartForm(10 << 20); err != nil {
        log.Printf("Error parsing multipart form: %s", err)
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    content := r.FormValue("content")
    fontSize := r.FormValue("fontSize")

    file, header, err := r.FormFile("file")
    if err != nil && err != http.ErrMissingFile {
        log.Printf("Error processing file: %s", err)
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    var filename string
    if file != nil {
        defer file.Close()
        filename = header.Filename
        log.Printf("File uploaded: %s", filename)
        // ファイル保存処理はここに実装します
    }
    var userID int64
    accessTokenCookie, err := r.Cookie("accessToken")
    if err != nil || accessTokenCookie.Value == "" {
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
        if err != nil {
            log.Printf("Error generating new access token: %s", err)
            http.Error(w, "Server error", http.StatusInternalServerError)
            return
        }

        // 新しいアクセストークンの有効期限を取得
        newAccessTokenClaims := jwt.StandardClaims{}
        jwt.ParseWithClaims(newAccessToken, &newAccessTokenClaims, func(token *jwt.Token) (interface{}, error) {
            return []byte("your_secret_key"), nil
        })
        
        http.SetCookie(w, &http.Cookie{
            Name:     "accessToken",
            Value:    newAccessToken,
            Expires:  time.Now().Add(1 * time.Minute),
            HttpOnly: true,
            Path:     "/",
            Secure:   false,
            SameSite: http.SameSiteStrictMode,
        })

        log.Printf("New access token generated using refresh token for user ID: %d. Expires at: %v", userID, time.Unix(newAccessTokenClaims.ExpiresAt, 0))
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
    }

    var letterID int64
    err = db.DB.QueryRow("INSERT INTO letter (user_id, content, font_size, filename) VALUES ($1, $2, $3, $4) RETURNING id", userID, content, fontSize, filename).Scan(&letterID)
    if err != nil {
        log.Printf("Error inserting letter into database and retrieving ID: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    log.Println("Letter saved successfully")
    w.WriteHeader(http.StatusOK)
    w.Header().Set("Content-Type", "application/json")
// letterIDをレスポンスに含める
json.NewEncoder(w).Encode(map[string]interface{}{
    "message": "Letter saved successfully",
    "letterID": letterID,
})
}
