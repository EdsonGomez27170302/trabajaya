package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
)

func main() {
	uploadsDir := os.Getenv("UPLOADS_DIR")
	if uploadsDir == "" {
		uploadsDir = "./uploads"
	}

	companiesDir := filepath.Join(uploadsDir, "companies")
	studentsDir := filepath.Join(uploadsDir, "students")

	if err := os.MkdirAll(companiesDir, 0o755); err != nil {
		log.Fatalf("failed to create %s: %v", companiesDir, err)
	}
	if err := os.MkdirAll(studentsDir, 0o755); err != nil {
		log.Fatalf("failed to create %s: %v", studentsDir, err)
	}

	for i := 1; i <= 6; i++ {
		url := fmt.Sprintf("https://picsum.photos/seed/trabajaya-empresa-%d/400/400", i)
		dest := filepath.Join(companiesDir, fmt.Sprintf("empresa-%d.jpg", i))
		download(url, dest)
	}

	for i := 1; i <= 8; i++ {
		url := fmt.Sprintf("https://i.pravatar.cc/300?img=%d", i)
		dest := filepath.Join(studentsDir, fmt.Sprintf("estudiante-%d.jpg", i))
		download(url, dest)
	}

	log.Println("done downloading seed images")
}
