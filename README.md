# Microservice for translate browser logs to server side logs systems, ex: ELK.

The microservice contains an API that accepts any JSON object from the browser and outputs it to the container's stdout. The container configuration should have a [Logging Driver](https://docs.docker.com/config/containers/logging/configure/#configure-the-logging-driver-for-a-container) setting that will read the stdout and pass it to your log aggregation system.

Features:
- Allows you to collect logs from the browser using server-side logging tools
- Does not limit you in choosing a server logging tool, choose any
- Includes exporter of metrics for Prometheus,

### Try
To try the microservice features, run the container with the command:
```sh
docker run -it --rm -p 3000:3000 mtsrus/logs
```

Now you can check the work with the command:

```sh
curl -d '{"message": "Sample log"}' -X POST http://localhost:3000/logs/log
```

JSON should be displayed in the container console. This JSON must be read by the Logging Driver and sent to the logging system.

### Use
To start the microservice in production, use the command:
```sh
docker run -d --restart always -p 3000:3000 mtsrus/logs
```

### Endpoints
All endpoints use the POST request method and accept a JSON as the request body

- `/logs/log` - information level log
- `/logs/warning` - warning level log
- `/logs/error` - error level log

### Metrics Prometheus
The microservice has built-in Prometheus monitoring and is located on the endpoint `/metrics`.

Block this endpoint on the proxy if you do not need to provide access to metrics from outside your network.

### Components for web
You can use any log collector on the browser side. To send to a microservice, you need to write a send function to your logging tool.

Example:
```typescript
const log = (message, level, error) => {
    fetch(
        `http://localhost:3000/logs/${level}`,
        {
            method: "POST",
            body: {
                message: message,
                userAgent: navigator.userAgent,
                location: location.href,
                stack: error.stack
            }
        }
    );
}
```
