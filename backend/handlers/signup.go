package handlers

import (
    "myapp/db"
    "myapp/models"
    "log"
    "encoding/json"
    "net/http"
    "golang.org/x/crypto/bcrypt"
)

func SignUpHandler(w http.ResponseWriter, r *http.Request) {
    log.Println("Received a sign up request")

    var req models.SignUpRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        log.Printf("Error decoding request: %s", err)
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    log.Printf("Request data: %+v", req)

    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        log.Printf("Error hashing password: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }
    
    _, err = db.DB.Exec("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", req.Name, req.Email, string(hashedPassword))
    if err != nil {
        log.Printf("Error inserting user into database: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    log.Println("User created successfully")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode("User created successfully")
}