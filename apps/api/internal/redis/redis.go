package redis

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

func NewClient(addr string) (*redis.Client, error) {
	opt, err := redis.ParseURL(addr)
	if err != nil {
		return nil, err
	}
	client := redis.NewClient(opt)
	if err := client.Ping(context.Background()).Err(); err != nil {
		return nil, err
	}
	log.Println("redis: connected")
	return client, nil
}
