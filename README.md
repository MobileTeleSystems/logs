
# Logs Microservice

[![Docker Pulls](https://img.shields.io/docker/pulls/mtsrus/logs)](https://hub.docker.com/r/mtsrus/logs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NestJS](https://img.shields.io/badge/Built%20with-NestJS-E0234E?logo=nestjs)](https://nestjs.com/)

A lightweight, high-performance microservice for forwarding browser-side logs to server-side log aggregation systems (ELK, Loki, Splunk, etc.).

## Overview

The Logs microservice provides a REST API that accepts JSON log objects from browser applications and outputs them to stdout. When combined with Docker logging drivers, this enables seamless integration with enterprise log aggregation systems without requiring client-side configuration of log collectors.

### Key Features

- **Universal Integration**: Works with any log aggregation system via Docker logging drivers
- **Zero Client Dependencies**: No need for browser-side log shipping libraries
- **Production Ready**: Built with NestJS for reliability and performance
- **Observability**: Built-in Prometheus metrics for monitoring
- **Flexible Log Levels**: Support for debug, verbose, info, warn, and error levels
- **Lightweight**: Minimal resource footprint, optimized for containerized environments

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Client Integration](#client-integration)
- [Monitoring](#monitoring)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Quick Start

Run the microservice locally for testing:

```bash
docker run -it --rm -p 3000:3000 mtsrus/logs
```

Test the endpoint:

```bash
curl -d '{"message": "Sample log", "timestamp": "2025-12-23T10:30:00Z"}' \
     -H "Content-Type: application/json" \
     -X POST http://localhost:3000/log/log
```

The JSON payload will be written to stdout, ready to be consumed by your logging driver.

## Installation

### Docker

For production deployment:

```bash
docker run -d \
  --name logs \
  --restart always \
  -p 3000:3000 \
  --log-driver=fluentd \
  --log-opt fluentd-address=localhost:24224 \
  mtsrus/logs
```

### Docker Compose

```yaml
version: '3.8'
services:
  logs:
    image: mtsrus/logs:latest
    ports:
      - "3000:3000"
    restart: always
    logging:
      driver: fluentd
      options:
        fluentd-address: localhost:24224
        tag: browser.logs
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: logs-microservice
spec:
  replicas: 2
  selector:
    matchLabels:
      app: logs
  template:
    metadata:
      labels:
        app: logs
    spec:
      containers:
      - name: logs
        image: mtsrus/logs:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

## API Reference

All endpoints accept POST requests with JSON payloads.

### Endpoints

| Endpoint | Log Level | Description |
|----------|-----------|-------------|
| `/log/debug` | DEBUG | Detailed debugging information |
| `/log/verbose` | VERBOSE | Verbose/trace level logs |
| `/log/log` | INFO | General informational messages |
| `/log/warn` | WARNING | Warning messages for potential issues |
| `/log/error` | ERROR | Error messages for failures |

### Request Format

```json
{
  "message": "User action completed",
  "timestamp": "2025-12-23T10:30:00Z",
  "userId": "user-123",
  "userAgent": "Mozilla/5.0...",
  "location": "https://example.com/dashboard",
  "context": {
    "feature": "checkout",
    "sessionId": "session-abc"
  }
}
```

All fields are optional. The microservice accepts any valid JSON structure.

### Response

**Success (200 OK)**:
```json
{
  "status": "logged"
}
```

**Error (400 Bad Request)**:
```json
{
  "statusCode": 400,
  "message": "Invalid JSON"
}
```

## Configuration

### Environment Variables

The microservice can be configured using the following environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port |
| `NODE_ENV` | `production` | Node.js environment |

### Docker Logging Drivers

Configure your Docker logging driver to forward stdout to your log aggregation system. Examples:

#### Fluentd
```bash
docker run -d \
  --log-driver=fluentd \
  --log-opt fluentd-address=localhost:24224 \
  --log-opt tag="browser.{{.Name}}" \
  mtsrus/logs
```

#### Syslog
```bash
docker run -d \
  --log-driver=syslog \
  --log-opt syslog-address=tcp://192.168.0.1:514 \
  mtsrus/logs
```

#### AWS CloudWatch
```bash
docker run -d \
  --log-driver=awslogs \
  --log-opt awslogs-region=us-east-1 \
  --log-opt awslogs-group=browser-logs \
  mtsrus/logs
```

## Client Integration

### JavaScript/TypeScript

```typescript
class LogService {
  private readonly endpoint: string;

  constructor(endpoint: string = '/api/logs') {
    this.endpoint = endpoint;
  }

  async log(level: 'debug' | 'verbose' | 'log' | 'warn' | 'error', data: Record<string, any>) {
    try {
      await fetch(`${this.endpoint}/${level}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          location: window.location.href,
          ...data
        })
      });
    } catch (error) {
      console.error('Failed to send log:', error);
    }
  }

  info(message: string, context?: Record<string, any>) {
    return this.log('log', { message, ...context });
  }

  warn(message: string, context?: Record<string, any>) {
    return this.log('warn', { message, ...context });
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    return this.log('error', {
      message,
      error: error?.message,
      stack: error?.stack,
      ...context
    });
  }
}

// Usage
const logger = new LogService('http://localhost:3000/log');
logger.info('User logged in', { userId: '123' });
logger.error('Payment failed', new Error('Timeout'), { orderId: 'order-456' });
```

### React Integration

```typescript
import { useEffect } from 'react';

export function useErrorLogger(logEndpoint: string) {
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      fetch(`${logEndpoint}/error`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.stack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          location: window.location.href
        })
      });
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, [logEndpoint]);
}
```

## Monitoring

## Monitoring

### Prometheus Metrics

The microservice exposes Prometheus-compatible metrics at the `/metrics` endpoint.

**Available Metrics:**
- HTTP request duration
- Request count by status code
- Request count by endpoint
- Active connections

**Example Prometheus Configuration:**

```yaml
scrape_configs:
  - job_name: 'logs-microservice'
    static_configs:
      - targets: ['logs:3000']
    metrics_path: '/metrics'
```

**Security Note**: Restrict access to `/metrics` via your reverse proxy if exposing the service publicly.

## Architecture

### How It Works

```
┌─────────────┐      HTTP POST      ┌──────────────┐      stdout      ┌─────────────┐
│   Browser   │ ─────────────────> │ Logs Service │ ───────────────> │   Docker    │
│ Application │  JSON Payload       │  (NestJS)    │  Structured Log  │   Logging   │
└─────────────┘                     └──────────────┘                  │   Driver    │
                                                                       └──────┬──────┘
                                                                              │
                                                                              ▼
                                                                    ┌──────────────────┐
                                                                    │  Log Aggregation │
                                                                    │  (ELK/Loki/etc)  │
                                                                    └──────────────────┘
```

### Design Principles

1. **Simplicity**: Single responsibility - accept logs and output to stdout
2. **Scalability**: Stateless design enables horizontal scaling
3. **Reliability**: Built on NestJS with production-grade error handling
4. **Flexibility**: Agnostic to log aggregation backend

### Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) - Enterprise-grade Node.js framework
- **Runtime**: Node.js 20+
- **Containerization**: Docker
- **Monitoring**: Prometheus metrics

## Security Considerations

- **Input Validation**: All incoming JSON is validated
- **No Data Storage**: Logs are immediately output to stdout, no persistence
- **CORS**: Configure CORS headers in your reverse proxy
- **Rate Limiting**: Implement rate limiting at proxy/ingress level
- **Authentication**: Add authentication via reverse proxy if needed

## Performance

- **Throughput**: Handles 1000+ requests/second on modest hardware
- **Latency**: < 10ms average response time
- **Memory**: ~50MB baseline, scales linearly with concurrent requests
- **CPU**: Minimal CPU usage, I/O bound workload

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/MobileTeleSystems/logs/issues)
- **Security**: See [SECURITY.md](SECURITY.md) for reporting vulnerabilities

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

---

**Maintained by**: [MobileTeleSystems](https://github.com/MobileTeleSystems)
**Contributors**: [LabEG](https://github.com/LabEG)
