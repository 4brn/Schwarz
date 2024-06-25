package main

//go:generate go run github.com/objectbox/objectbox-go/cmd/objectbox-gogen

type user struct {
	id           uint64
	username     string
	passwordHash []byte // can't be a fixed-size byte array because of objectbox
	// isAdmin  bool
}

type product struct {
	id        uint64
	ProductID int    `json:"id"`
	Category  string `json:"category"`
	Name      string `json:"name"`
}
