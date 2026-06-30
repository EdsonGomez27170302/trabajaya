package main

import (
	"io"
	"log"
	"net/http"
	"os"
)

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
