package db

import (
    "database/sql"
    _ "github.com/lib/pq"
    "log"
)

var DB *sql.DB

func Init() {
    var err error
    DB, err = sql.Open("postgres", "postgres://postgres:chougingc@localhost:5432/db?sslmode=disable")
    if err != nil {
        log.Fatal(err)
    }
    if err = DB.Ping(); err != nil {
        log.Fatal(err)
    }
}