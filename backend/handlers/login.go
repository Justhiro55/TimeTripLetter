package handlers

import (
	"database/sql"
    "encoding/json"
    "log"
	"strconv"
    "net/http"
    "time"

    "golang.org/x/crypto/bcrypt"
	"github.com/dgrijalva/jwt-go"
    "myapp/db"
    "myapp/models"
)

func generateToken(userID int64) (string, error) {
    // トークンの有効期限を設定
    expirationTime := time.Now().Add(1 * time.Minute)

    // JWTクレームを作成
    claims := &jwt.StandardClaims{
        ExpiresAt: expirationTime.Unix(),
        Issuer:    "your-app-name",
        Subject:   strconv.FormatInt(userID, 10), // userIDを文字列に変換
    }

    // 新しいトークンを作成
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

    // シークレットキーでトークンに署名
    tokenString, err := token.SignedString([]byte("your_secret_key"))
    if err != nil {
        return "", err
    }

    return tokenString, nil
}

func generateRefreshToken(userID int64) (string, error) {
    // リフレッシュトークンの有効期限を設定（例: 7日間）
    expirationTime := time.Now().Add(1 * time.Minute)

    // JWTクレームを作成
    claims := &jwt.StandardClaims{
        ExpiresAt: expirationTime.Unix(),
        Issuer:    "your-app-name",
        Subject:   strconv.FormatInt(userID, 10), // userIDを文字列に変換
    }

    // 新しいトークンを作成
    refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

    // シークレットキーでトークンに署名
    refreshTokenString, err := refreshToken.SignedString([]byte("your_secret_key"))
    if err != nil {
        return "", err
    }

    return refreshTokenString, nil
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
    var req models.LoginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    var hashedPassword string
    var userID int64
    err := db.DB.QueryRow("SELECT id, password FROM users WHERE email = $1", req.Email).Scan(&userID, &hashedPassword)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "User not found", http.StatusUnauthorized)
            return
        }
        log.Printf("Database error: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.Password)); err != nil {
        http.Error(w, "Invalid password", http.StatusUnauthorized)
        return
    }

    // アクセストークンとリフレッシュトークンの生成
    accessToken, err := generateToken(userID)
    refreshToken, err := generateRefreshToken(userID)
    if err != nil {
        log.Printf("Token generation error: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    http.SetCookie(w, &http.Cookie{
        Name:     "accessToken",
        Value:    accessToken,
        Expires:  time.Now().Add(100 * time.Minute),
        HttpOnly: true,
        Path:     "/",
        Secure:   false,
        SameSite: http.SameSiteStrictMode,
    })
    http.SetCookie(w, &http.Cookie{
        Name:     "refreshToken",
        Value:    refreshToken,
        // Expires:  time.Now().Add(7 * 24 * time.Hour),
        Expires:  time.Now().Add(100 * time.Minute),
        HttpOnly: true,
        Path:     "/",
        Secure:   false,
        SameSite: http.SameSiteStrictMode,
    })

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode("Login successful")
}