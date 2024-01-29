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

// personalInfoHandler - 個人情報と決済情報を処理するハンドラー
func PersonalInfoHandler(w http.ResponseWriter, r *http.Request) {
    var req models.PersonalInfoRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        log.Printf("Error decoding request: %s", err)
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // JWTトークンからユーザーIDを取得
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

    // send_date が空の場合、現在の日時を設定
    sendDate := req.SendDate
    if sendDate == "" {
        sendDate = time.Now().Format("2006-01-02 15:04:05")
    }

    // recipient テーブルにデータを挿入
    _, err = db.DB.Exec("INSERT INTO recipient (user_id, name, address, postal_code, email, phone_number, send_date) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        userID, req.RecipientName, req.RecipientAddress, req.RecipientZip, req.RecipientEmail, req.PhoneNumber, sendDate)
    if err != nil {
        log.Printf("Error inserting into recipient table: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    // paymentinfo テーブルにデータを挿入
    expiryDate := "2028-06-30" // テスト用の固定された日付
    _, err = db.DB.Exec("INSERT INTO paymentinfo (user_id, card_number, expiry_date, cvv, billing_address) VALUES ($1, $2, $3, $4, $5)",
        userID, req.CardNumber, expiryDate, req.CVC, req.RecipientAddress)
    if err != nil {
        log.Printf("Error inserting into paymentinfo table: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode("Personal and payment information saved successfully")
}
