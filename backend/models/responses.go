package models

type ConfirmationResponse struct {
    UserInfo      UserInfo      `json:"userInfo"`
    LetterInfo    LetterInfo    `json:"letterInfo"`
    RecipientInfo RecipientInfo `json:"recipientInfo"`
}

type UserInfo struct {
    Username string `json:"username"`
    Email    string `json:"email"`
}

type LetterInfo struct {
    Content string `json:"content"`
}

type RecipientInfo struct {
    Name        string `json:"name"`
    Address     string `json:"address"`
    PhoneNumber string `json:"phoneNumber"`
    Email       string `json:"email"`
    PostalCode  string `json:"postalCode"`
    SendDate    string `json:"sendDate"`
}