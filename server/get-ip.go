package main

import "net"

func GetIP() (string, error) {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		return "", err
	}

	defer conn.Close()

	return conn.LocalAddr().(*net.UDPAddr).IP.String(), nil
}
