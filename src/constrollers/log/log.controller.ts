import { JsonLogger } from "../../services/json-logger.service";
import { Body, Headers, Controller, Post } from "@nestjs/common";
import {LogLevels} from "../../enums/LogLevels";

@Controller("log")
export class LogController {
    constructor(private readonly logger: JsonLogger) {}

    @Post("log")
    public writeLog(@Body() body: object, @Headers() headers: object): void {
        this.proceeLog(body, headers, LogLevels.INFO);
    }

    @Post("warn")
    public writeWarn(@Body() body: object, @Headers() headers: object): void {
        this.proceeLog(body, headers, LogLevels.WARN);
    }

    @Post("error")
    public writeError(@Body() body: object, @Headers() headers: object): void {
        this.proceeLog(body, headers, LogLevels.ERROR);
    }

    @Post("debug")
    public writeDebug(@Body() body: object, @Headers() headers: object): void {
        this.proceeLog(body, headers, LogLevels.DEBUG);
    }

    @Post("verbose")
    public writeVerbose(
        @Body() body: object,
        @Headers() headers: object,
    ): void {
        this.proceeLog(body, headers, LogLevels.TRACE);
    }

    private proceeLog(body: object, headers: object, logLevel: LogLevels) {
        const userInfo = {
            userAgent: headers["user-agent"] ?? "not set",
            userIp: headers["x-real-ip"] ?? "not set",
            traceId: headers["x-trace-id"],
        };

        this.logger.extraLogs("Client log", logLevel, {
            ...body,
            ...userInfo,
        });
    }
}
