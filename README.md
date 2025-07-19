
# Microservice for translating browser logs to server-side log systems, e.g. ELK

The microservice provides an API that accepts any JSON object from the browser and outputs it to the container's stdout. The container configuration should have a [Logging Driver](https://docs.docker.com/config/containers/logging/configure/#configure-the-logging-driver-for-a-container) setting that will read the stdout and pass it to your log aggregation system.

Features:

- Allows you to collect logs from the browser using server-side logging tools
- Does not limit your choice of server logging tool—use any
- Includes a metrics exporter for Prometheus


## Try

To try the microservice features, run the container with the command:

```sh
docker run -it --rm -p 3000:3000 mtsrus/logs
```


Now you can check the work with the command:


```sh
curl -d '{"message": "Sample log"}' -H "Content-Type: application/json" -X POST http://localhost:3000/log/log
```


JSON should be displayed in the container console. This JSON will be read by the Logging Driver and sent to the logging system.


## Use

To start the microservice in production, use the command:

```sh
docker run -d --restart always -p 3000:3000 mtsrus/logs
```


## Endpoints

All endpoints use the POST request method and accept a JSON object as the request body.

- `/log/log` - info level log
- `/log/warn` - warning level log
- `/log/error` - error level log
- `/log/debug` - debug level log
- `/log/verbose` - verbose/trace level log


## Prometheus Metrics

The microservice has built-in Prometheus monitoring available at the `/metrics` endpoint.

Block this endpoint on your proxy if you do not need to provide access to metrics from outside your network.


## Components for Web

You can use any log collector on the browser side. To send logs to the microservice, you need to write a send function for your logging tool.

Example:

```typescript
const log = (message, level, error) => {
    fetch(
        `http://localhost:3000/log/${level}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: message,
                userAgent: navigator.userAgent,
                location: location.href,
                stack: error?.stack
            })
        }
    );
}
```
