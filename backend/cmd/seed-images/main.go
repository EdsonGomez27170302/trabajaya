// seed-images downloads placeholder logos and profile photos used by the
// seed data into backend/uploads/, so the backend can serve them as static
// files at /uploads/companies/* and /uploads/students/*.
package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
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

	// 6 deterministic company logos from picsum.photos (seeded by name so
	// re-running this program produces the same images).
	for i := 1; i <= 6; i++ {
		url := fmt.Sprintf("https://picsum.photos/seed/trabajaya-empresa-%d/400/400", i)
		dest := filepath.Join(companiesDir, fmt.Sprintf("empresa-%d.jpg", i))
		download(url, dest)
	}

	// 8 student profile photos from i.pravatar.cc (seeded by id).
	for i := 1; i <= 8; i++ {
		url := fmt.Sprintf("https://i.pravatar.cc/300?img=%d", i)
		dest := filepath.Join(studentsDir, fmt.Sprintf("estudiante-%d.jpg", i))
		download(url, dest)
	}

	log.Println("done downloading seed images")
}

func download(url, dest string) {
	if _, err := os.Stat(dest); err == nil {
		log.Printf("skip (exists): %s", dest)
		return
	}

	resp, err := http.Get(url)
	if err != nil {
		log.Printf("failed to download %s: %v", url, err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("failed to download %s: status %d", url, resp.StatusCode)
		return
	}

	out, err := os.Create(dest)
	if err != nil {
		log.Printf("failed to create %s: %v", dest, err)
		return
	}
	defer out.Close()

	if _, err := io.Copy(out, resp.Body); err != nil {
		log.Printf("failed to write %s: %v", dest, err)
		return
	}

	log.Printf("downloaded %s -> %s", url, dest)
}
