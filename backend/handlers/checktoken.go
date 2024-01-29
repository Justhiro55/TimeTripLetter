package handlers

import (
    "net/http"
    "github.com/dgrijalva/jwt-go"
    "strconv"
    "time"
)

func VerifyTokenHandler(w http.ResponseWriter, r *http.Request) {
    // リクエストからクッキーを取得
    cookie, err := r.Cookie("accessToken")
    if err != nil {
        http.Error(w, "Cookie not found", http.StatusUnauthorized)
        return
    }

    // トークンの検証
    token, err := jwt.Parse(cookie.Value, func(token *jwt.Token) (interface{}, error) {
        // トークンの署名を検証するためのキーを返す
        return []byte("your_secret_key"), nil
    })

    if err != nil || !token.Valid {
        http.Error(w, "Invalid token", http.StatusUnauthorized)
        return
    }

    // トークンが有効な場合
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Token is valid"))
}

func CheckTokenHandler(w http.ResponseWriter, r *http.Request) {
    accessTokenCookie, _ := r.Cookie("accessToken")
    refreshTokenCookie, _ := r.Cookie("refreshToken")

    // アクセストークンの検証
    if accessTokenCookie != nil && accessTokenCookie.Value != "" {
        accessTokenString := accessTokenCookie.Value
        accessTokenClaims := &jwt.StandardClaims{}
        _, err := jwt.ParseWithClaims(accessTokenString, accessTokenClaims, func(token *jwt.Token) (interface{}, error) {
            return []byte("your_secret_key"), nil
        })

        if err == nil {
            // トークンが有効
            w.WriteHeader(http.StatusOK)
            w.Write([]byte("Token valid"))
            return
        }
    }

    // リフレッシュトークンの検証
    if refreshTokenCookie != nil && refreshTokenCookie.Value != "" {
        refreshTokenString := refreshTokenCookie.Value
        refreshTokenClaims := &jwt.StandardClaims{}
        _, err := jwt.ParseWithClaims(refreshTokenString, refreshTokenClaims, func(token *jwt.Token) (interface{}, error) {
            return []byte("your_secret_key"), nil
        })

        if err == nil {
            // リフレッシュトークンが有効な場合、新しいアクセストークンを生成
            userID, _ := strconv.ParseInt(refreshTokenClaims.Subject, 10, 64)
            newAccessToken, _ := generateToken(userID) // generateToken はトークン生成関数

            // 新しいアクセストークンをクッキーに設定
            http.SetCookie(w, &http.Cookie{
                Name:     "accessToken",
                Value:    newAccessToken,
                Expires:  time.Now().Add(30 * time.Minute), // 有効期限は適宜調整
                HttpOnly: true,
                Path:     "/",
                Secure:   false, // HTTPSを使用する場合はtrueに変更
                SameSite: http.SameSiteStrictMode,
            })

            w.WriteHeader(http.StatusOK)
            w.Write([]byte("New access token generated"))
            return
        }
    }

    // どちらのトークンも無効の場合
    http.Error(w, "Unauthorized", http.StatusUnauthorized)
}
