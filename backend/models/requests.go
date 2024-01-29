package models

type SignUpRequest struct {
    Email    string `json:"email"`
    Name     string `json:"name"`
    Address  string `json:"address"`
    Password string `json:"password"`
}

type LoginRequest struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}

type PersonalInfoRequest struct {
    RecipientName    string `json:"recipientName"`
    RecipientZip     string `json:"recipientZip"`
    RecipientAddress string `json:"recipientAddress"`
    RecipientEmail   string `json:"recipientEmail"`
    CardName         string `json:"cardName"`
    CardNumber       string `json:"cardNumber"`
    ExpiryMonth      string `json:"expiryMonth"`
    ExpiryYear       string `json:"expiryYear"`
    CVC              string `json:"cvc"`
    PhoneNumber      string `json:"phoneNumber"`
    SendDate         string `json:"sendDate"`
}

type Letter struct {
    Content  string `json:"content"`
    FontSize string `json:"fontSize"`
    Filename string `json:"filename"`
}