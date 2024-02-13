package handlers

import (
    "encoding/json"
    "log"
    "net/http"
    "strconv"
    "time"

    "github.com/dgrijalva/jwt-go"
    // "myapp/db"
)

func LetterHandler(w http.ResponseWriter, r *http.Request) {
    log.Println("This message should appear in the log")

    if err := r.ParseMultipartForm(10 << 20); err != nil {
        log.Printf("Error parsing multipart form: %s", err)
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // content と fontSize 変数は使用されていないので削除
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

    log.Println("Letter saved successfully")
    w.WriteHeader(http.StatusOK)
    w.Header().Set("Content-Type", "application/json")
    // レスポンスに含めるデータをエンコードして送信
    json.NewEncoder(w).Encode(map[string]interface{}{
        "message":  "Letter saved successfully",
    })
}
