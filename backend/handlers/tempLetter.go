package handlers

import (
    "encoding/json"
    "log"
    "net/http"
    "myapp/db"
)

func SaveTempLetterHandler(w http.ResponseWriter, r *http.Request) {
    var request struct {
        Content  string `json:"content"`
        FontSize int64  `json:"fontSize"` // ここをint64型に変更
    }
    
    // リクエストのボディからJSONをデコード
    if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    log.Printf("Request Content: %s, FontSize: %d", request.Content, request.FontSize)
    
    // データベースへの挿入処理
    var tempLetterId int64
    query := "INSERT INTO temp_letters (content, font_size) VALUES ($1, $2) RETURNING id"
    // errのスコープを修正して、QueryRowの実行結果を正しく扱う
    if err := db.DB.QueryRow(query, request.Content, request.FontSize).Scan(&tempLetterId); err != nil {
        log.Printf("Error inserting temp letter into database: %s", err)
        http.Error(w, "Server error", http.StatusInternalServerError)
        return
    }

    // 正常応答
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "message": "Temporary letter saved successfully",
        "tempLetterId": tempLetterId,
    })
}
