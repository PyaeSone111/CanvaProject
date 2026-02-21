package server

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"github.com/canva-project/api/internal/s3"
)

type Deps struct {
	DB         *pgxpool.Pool
	Redis      *redis.Client
	S3         *s3.Client
	Port       string
	CORSOrigin string
}

type Server struct {
	engine *gin.Engine
	srv    *http.Server
	deps   Deps
}

func New(deps Deps) *Server {
	gin.SetMode(gin.ReleaseMode)
	engine := gin.New()
	engine.Use(gin.Recovery())

	s := &Server{engine: engine, deps: deps}
	s.routes()
	return s
}

func (s *Server) routes() {
	// Middleware
	s.engine.Use(middlewareCORS(s.deps.CORSOrigin))

	// Health
	s.engine.GET("/health", s.handleHealth)

	// API group (placeholder)
	v1 := s.engine.Group("/api/v1")
	{
		_ = v1 // future routes
	}
}

func (s *Server) handleHealth(c *gin.Context) {
	// Optional: ping DB/Redis for readiness
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (s *Server) Run() error {
	s.srv = &http.Server{
		Addr:    ":" + s.deps.Port,
		Handler: s.engine,
	}
	return s.srv.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	if s.srv != nil {
		return s.srv.Shutdown(ctx)
	}
	return nil
}
