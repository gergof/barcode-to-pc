package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/go-vgo/robotgo"
)

type BarcodeHandlerBody struct {
	Code string `json:"code" validate:"required"`
}

func BarcodeHandler(w http.ResponseWriter, r *http.Request) {
	var body BarcodeHandlerBody

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Body must be valid JSON", http.StatusBadRequest)
		return
	}

	if err := validator.New(validator.WithRequiredStructEnabled()).Struct(body); err != nil {
		http.Error(w, fmt.Sprintf("Bad request: %v", err), http.StatusBadRequest)
		return
	}

	log.Printf("Received: %s", body.Code)

	robotgo.TypeStr(body.Code)
	robotgo.KeyTap("enter")

	fmt.Fprint(w, "OK")
}
