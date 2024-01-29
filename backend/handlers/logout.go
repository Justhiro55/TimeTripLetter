package handlers

import (
    "net/http"
    "time"
)

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    w.Header().Set("Access-Control-Allow-Credentials", "true")

    // アクセストークンのクッキーを削除
    http.SetCookie(w, &http.Cookie{
        Name:     "accessToken",
        Value:    "",
        Path:     "/",
        Expires:  time.Unix(0, 0),
        MaxAge:   -1,
        HttpOnly: true,
    })

    // リフレッシュトークンのクッキーも削除
    http.SetCookie(w, &http.Cookie{
        Name:     "refreshToken",
        Value:    "",
        Path:     "/",
        Expires:  time.Unix(0, 0),
        MaxAge:   -1,
        HttpOnly: true,
    })

    // 応答を送信
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Logged out successfully"))
}
