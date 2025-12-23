---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''

---

## Description

A clear and concise description of the bug.

## Steps to Reproduce

1. Deploy `logs` microservice version X.X.X
2. Send POST request to '/log' endpoint
3. Observe the behavior
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Request Sample

```json
// Example POST request body that demonstrates the issue
{
  "level": "error",
  "message": "Sample message"
}
```

## Configuration

```json
// Environment variables or configuration
```

## Environment

- **logs version**: [e.g., 1.1.8]
- **NestJS version**: [e.g., 11.1.9]
- **Node.js version**: [e.g., 20.10.0]
- **Docker version** (if using Docker): [e.g., 24.0.0]
- **Operating System**: [e.g., Windows 11, macOS 14, Ubuntu 22.04]
- **Deployment**: [e.g., Docker, Kubernetes, standalone]

## Additional Context

Add any other context, screenshots, or error messages here.

## Possible Solution

If you have ideas on how to fix this, please share them.
