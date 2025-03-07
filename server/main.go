package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/mdp/qrterminal/v3"
)

func main() {
	port := flag.Int("port", 0, "Port to listen on")
	flag.Parse()

	log.Print("Starting Barcode-to-PC host application")

	r := chi.NewRouter()

	r.Use(middleware.Logger)

	r.Post("/", BarcodeHandler)

	log.Print("Getting IP address")

	ip, err := GetIP()
	if err != nil {
		log.Fatalf("Failed to get IP address: %v", err)
	}

	log.Printf("Local IP Address: %s", ip)

	if *port != 0 {
		log.Printf("Start listening listen on port %v", *port)
	} else {
		log.Print("Start listening on random port")
	}

	listener, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%v", *port))
	if err != nil {
		log.Fatalf("Failed to start listener: %v", err)
	}

	address := fmt.Sprintf("http://%s:%v", ip, listener.Addr().(*net.TCPAddr).Port)

	log.Printf("You can connect to %s", address)
	log.Print("Or scan this QR code:")

	qrterminal.GenerateWithConfig(address, qrterminal.Config{
		Level:     qrterminal.L,
		Writer:    os.Stdout,
		BlackChar: qrterminal.BLACK,
		WhiteChar: qrterminal.WHITE,
		QuietZone: 2,
	})

	if err = http.Serve(listener, r); err != nil {
		log.Fatalf("Failed to start HTTP server: %v", err)
	}
}
