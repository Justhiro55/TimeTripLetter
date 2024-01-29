package handlers

import (
    "encoding/json"
    "net/http"
    "time"
)

// Activity はユーザーのアクティビティを表す構造体です。
type Activity struct {
    ID        int       `json:"id"`
    Action    string    `json:"action"`
    Timestamp time.Time `json:"timestamp"`
}

// MyPageHandler は /mypageapi エンドポイントのリクエストを処理します。
func MyPageHandler(w http.ResponseWriter, r *http.Request) {
    // データベースからアクティビティデータを取得するための仮のコード
    // 実際の実装では、ここでデータベースクエリを行います。
    activities := []Activity{
        {ID: 1, Action: "ログインしました", Timestamp: time.Now()},
        {ID: 2, Action: "記事を読みました", Timestamp: time.Now()},
        // 他のアクティビティデータを追加
    }

    // レスポンスヘッダーにContent-Typeを設定
    w.Header().Set("Content-Type", "application/json")
    // アクティビティデータをJSONとしてエンコードしてレスポンスに書き込み
    err := json.NewEncoder(w).Encode(activities)
    if err != nil {
        // JSONエンコーディングに失敗した場合のエラーハンドリング
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
}