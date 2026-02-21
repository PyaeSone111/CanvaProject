package config

import (
	"os"
)

type Config struct {
	Port        string
	DatabaseURL string
	RedisURL    string
	S3          S3Config
	CORSOrigin  string
}

type S3Config struct {
	Endpoint        string
	Region          string
	Bucket          string
	AccessKeyID     string
	SecretAccessKey string
	UseSSL          bool
}

func Load() (*Config, error) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		databaseURL = "postgres://canva:canva_secret@localhost:5432/canva_db?sslmode=disable"
	}
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379/0"
	}
	corsOrigin := os.Getenv("CORS_ORIGIN")
	if corsOrigin == "" {
		corsOrigin = "http://localhost:5173"
	}

	useSSL := os.Getenv("S3_USE_SSL") != "false"

	return &Config{
		Port:        port,
		DatabaseURL: databaseURL,
		RedisURL:    redisURL,
		CORSOrigin:  corsOrigin,
		S3: S3Config{
			Endpoint:        os.Getenv("S3_ENDPOINT"),
			Region:          getEnv("S3_REGION", "auto"),
			Bucket:          getEnv("S3_BUCKET", "canva-assets"),
			AccessKeyID:     os.Getenv("S3_ACCESS_KEY_ID"),
			SecretAccessKey: os.Getenv("S3_SECRET_ACCESS_KEY"),
			UseSSL:          useSSL,
		},
	}, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
