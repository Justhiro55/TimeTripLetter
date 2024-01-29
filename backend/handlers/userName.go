package handlers

import (
    "database/sql"
    "encoding/json"
    "log"
    "net/http"
    "strconv"
    "time"

    "github.com/dgrijalva/jwt-go"
    "myapp/db"
)

// userNameHandler
func UserNameHandler(w http.ResponseWriter, r *http.Request) {
    var userID int64
    var userName string

    // アクセストークンを取得
    accessTokenCookie, err := r.Cookie("accessToken")
    if err != nil {
        // アクセストークンがない場合はリフレッシュトークンを確認
        refreshTokenCookie, errRefresh := r.Cookie("refreshToken")
        if errRefresh != nil {
            // トークンがどちらもない場合は未認証として扱う
            http.Error(w, "Unauthorized: No valid tokens", http.StatusUnauthorized)
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
            Secure:   false,
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
        expirationTime := time.Unix(accessTokenClaims.ExpiresAt, 0)
        log.Printf("Token expires at: %v", expirationTime)
    }

    err = db.DB.QueryRow("SELECT username FROM users WHERE id = $1", userID).Scan(&userName)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }
        log.Printf("Database error: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(map[string]string{"name": userName})
}