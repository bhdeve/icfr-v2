import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Security Headers Middleware
app.use('*', async (c, next) => {
  await next();
  
  // Content Security Policy
  c.header('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '));
  
  // Prevent MIME type sniffing
  c.header('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  c.header('X-Frame-Options', 'DENY');
  
  // XSS Protection (legacy but still useful)
  c.header('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy (formerly Feature Policy)
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
  
  // HSTS (HTTP Strict Transport Security) - only for HTTPS
  if (c.req.url.startsWith('https://')) {
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
});

// Allowed origins configuration
const allowedOrigins = [
  // Production domains (update these with your actual domains)
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'https://app.yourdomain.com',
  // Development domains
  ...(Deno.env.get('MODE') === 'development' || !Deno.env.get('MODE')
    ? ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
    : [])
];

// Enable CORS with restricted origins
app.use(
  "/*",
  cors({
    origin: (origin) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return allowedOrigins[0];
      
      // Check if origin is allowed
      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      
      // For development, allow localhost with any port
      if (Deno.env.get('MODE') === 'development' && origin.includes('localhost')) {
        return origin;
      }
      
      // Default to first allowed origin
      return allowedOrigins[0];
    },
    credentials: true, // Important for cookies/authentication
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-e0840a7e/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);