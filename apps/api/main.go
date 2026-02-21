package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/canva-project/api/internal/config"
	"github.com/canva-project/api/internal/db"
	"github.com/canva-project/api/internal/redis"
	"github.com/canva-project/api/internal/s3"
	"github.com/canva-project/api/internal/server"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	ctx := context.Background()

	// DB
	pool, err := db.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db: %v", err)
	}
	defer pool.Close()

	// Redis
	rdb, err := redis.NewClient(cfg.RedisURL)
	if err != nil {
		log.Fatalf("redis: %v", err)
	}
	defer rdb.Close()

	// S3 (optional for local dev)
	s3Client, err := s3.NewClient(cfg.S3)
	if err != nil {
		log.Printf("s3: %v (continuing without S3)", err)
		s3Client = nil
	}

	srv := server.New(server.Deps{
		DB:         pool,
		Redis:      rdb,
		S3:         s3Client,
		Port:       cfg.Port,
		CORSOrigin: cfg.CORSOrigin,
	})

	go func() {
		if err := srv.Run(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("shutdown: %v", err)
	}
	log.Println("server stopped")
}
