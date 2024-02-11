package main

import (
    "log"
    "net/http"
    "os"
    "github.com/rs/cors" // ここは使用しているCORSライブラリに応じて変更してください
    "myapp/handlers"
    "myapp/db"   
)

func main() {
    log.SetOutput(os.Stdout)
    db.Init()

    // CORSミドルウェアの設定
    corsHandler := cors.New(cors.Options{
        AllowedOrigins: []string{"http://localhost:3000"},
        AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowCredentials: true,
    })

    http.Handle("/api/signup", corsHandler.Handler(http.HandlerFunc(handlers.SignUpHandler)))
    http.Handle("/api/personal-info", corsHandler.Handler(http.HandlerFunc(handlers.PersonalInfoHandler)))
    http.Handle("/api/login", corsHandler.Handler(http.HandlerFunc(handlers.LoginHandler)))
    http.Handle("/api/letter", corsHandler.Handler(http.HandlerFunc(handlers.LetterHandler)))
    http.Handle("/api/user/name", corsHandler.Handler(http.HandlerFunc(handlers.UserNameHandler)))
    http.Handle("/api/confirmation", corsHandler.Handler(http.HandlerFunc(handlers.ConfirmationHandler)))
    http.Handle("/api/logout", corsHandler.Handler(http.HandlerFunc(handlers.LogoutHandler)))
    http.Handle("/api/token/check", corsHandler.Handler(http.HandlerFunc(handlers.CheckTokenHandler)))
    http.Handle("/api/mypage", corsHandler.Handler(http.HandlerFunc(handlers.MyPageHandler)))
    http.Handle("/api/temp-letters", corsHandler.Handler(http.HandlerFunc(handlers.SaveTempLetterHandler)))

    log.Println("Server starting on http://localhost:8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatal("ListenAndServe:", err)
    }
}