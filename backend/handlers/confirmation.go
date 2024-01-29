package handlers

import (
    "encoding/json"
    "log"
    "net/http"
    "strconv"
    "time"


    "github.com/dgrijalva/jwt-go"
    "myapp/db"
    "myapp/models"
)

// confirmationHandler - 確認ページ用のハンドラー
func ConfirmationHandler(w http.ResponseWriter, r *http.Request) {
    var userID int64
    accessTokenCookie, err := r.Cookie("accessToken")
    if err != nil || accessTokenCookie.Value == "" {
        // アクセストークンが存在しない場合、リフレッシュトークンを確認する
        refreshTokenCookie, err := r.Cookie("refreshToken")
        if err != nil || refreshTokenCookie.Value == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        // リフレッシュトークンの有効性を確認
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

        // 新しいアクセストークンをクッキーに設定
        http.SetCookie(w, &http.Cookie{
            Name:     "accessToken",
            Value:    newAccessToken,
            Expires:  time.Now().Add(1 * time.Minute),
            HttpOnly: true,
            Path:     "/",
            Secure:   false, // HTTPSを使用する場合はtrueに変更
            SameSite: http.SameSiteStrictMode,
        })
    } else {
        // 既存のアクセストークンを使用
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
    // 手紙情報の取得
    var letterInfo models.LetterInfo
    err = db.DB.QueryRow("SELECT content FROM letter WHERE user_id = $1 ORDER BY id DESC LIMIT 1", userID).Scan(&letterInfo.Content)
    if err != nil {
        log.Printf("Error retrieving letter info: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    // 受取人情報の取得
    var recipientInfo models.RecipientInfo
    err = db.DB.QueryRow("SELECT name, address, phone_number, email, postal_code, send_date FROM recipient WHERE user_id = $1 ORDER BY id DESC LIMIT 1", userID).Scan(
        &recipientInfo.Name,
        &recipientInfo.Address,
        &recipientInfo.PhoneNumber,
        &recipientInfo.Email,
        &recipientInfo.PostalCode,
        &recipientInfo.SendDate,
    )
    if err != nil {
        log.Printf("Error retrieving recipient info: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    var userInfo models.UserInfo


    // レスポンスの作成
    response := models.ConfirmationResponse{
        UserInfo:      userInfo,
        LetterInfo:    letterInfo,
        RecipientInfo: recipientInfo,
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}