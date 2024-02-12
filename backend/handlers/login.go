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
    log.Println("LoginHandler: Handling login request")

    var req models.LoginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        log.Printf("LoginHandler: Error decoding request body: %s", err.Error())
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    log.Printf("LoginHandler: Received login request for email: %s", req.Email)

    var hashedPassword string
    var userID int64
    err := db.DB.QueryRow("SELECT id, password FROM users WHERE email = $1", req.Email).Scan(&userID, &hashedPassword)
    if err != nil {
        if err == sql.ErrNoRows {
            log.Printf("LoginHandler: User not found for email: %s", req.Email)
            http.Error(w, "User not found", http.StatusUnauthorized)
            return
        }
        log.Printf("LoginHandler: Database error: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    log.Println("LoginHandler: User found, checking password")

    if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.Password)); err != nil {
        log.Println("LoginHandler: Invalid password")
        http.Error(w, "Invalid password", http.StatusUnauthorized)
        return
    }

    log.Println("LoginHandler: Password verified, generating tokens")

    // アクセストークンとリフレッシュトークンの生成
    accessToken, err := generateToken(userID)
    refreshToken, err := generateRefreshToken(userID)
    if err != nil {
        log.Printf("LoginHandler: Token generation error: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    log.Println("LoginHandler: Tokens generated, setting cookies")

    // アクセストークンとリフレッシュトークンのクッキーをセット
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
        Expires:  time.Now().Add(100 * time.Minute),
        HttpOnly: true,
        Path:     "/",
        Secure:   false,
        SameSite: http.SameSiteStrictMode,
    })

    log.Println("LoginHandler: Cookies set")

    var letterID int64  // letterID を if スコープの外で宣言

    if req.TempLetterID != "" {
        log.Printf("LoginHandler: TempLetterID found: %s", req.TempLetterID)

        // temp_letters テーブルからデータを取得
        var tempContent, tempFontSize, tempFilename sql.NullString
        err := db.DB.QueryRow("SELECT content, font_size, filename FROM temp_letters WHERE id = $1", req.TempLetterID).Scan(&tempContent, &tempFontSize, &tempFilename)
        if err != nil {
            log.Printf("LoginHandler: Error retrieving temporary letter data: %s", err)
            http.Error(w, "Server error", http.StatusInternalServerError)
            return
        }

        log.Println("LoginHandler: Temporary letter data retrieved")

        // NULL値を適切に処理する
        finalContent := ""
        finalFontSize := ""
        finalFilename := ""
        if tempContent.Valid {
            finalContent = tempContent.String
        }
        if tempFontSize.Valid {
            finalFontSize = tempFontSize.String
        }
        if tempFilename.Valid {
            finalFilename = tempFilename.String
        }

        // letter テーブルにデータを挿入して、IDを取得する
        err = db.DB.QueryRow("INSERT INTO letter (user_id, content, font_size, filename) VALUES ($1, $2, $3, $4) RETURNING id", userID, finalContent, finalFontSize, finalFilename).Scan(&letterID)
        if err != nil {
            log.Printf("LoginHandler: Error inserting letter into database: %s", err)
            http.Error(w, "Server error", http.StatusInternalServerError)
            return
        }

        log.Printf("LoginHandler: Letter inserted into database with ID: %d", letterID)

        // temp_letters テーブルからデータを削除
        _, err = db.DB.Exec("DELETE FROM temp_letters WHERE id = $1", req.TempLetterID)
        if err != nil {
            log.Printf("LoginHandler: Error deleting temporary letter data: %s", err)
            // エラーが発生しても処理を続行しますが、ログにエラーを記録します
        }

        log.Println("LoginHandler: Temporary letter data deleted")
    }


    // LetterのIDをレスポンスとして返す
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]int64{"letterID": letterID})
}
