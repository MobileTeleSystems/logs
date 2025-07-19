import { LoggerService } from "@nestjs/common";
import { LogLevels } from "../enums/LogLevels";

export class JsonLogger implements LoggerService {
    /**
     * Write a 'log' level log.
     */
    public log(message: any) {
        this.writeJson(message, LogLevels.INFO);
    }

    /**
     * Write an 'error' level log.
     */
    public error(message: any) {
        this.writeJson(message, LogLevels.ERROR);
    }

    /**
     * Write a 'warn' level log.
     */
    public warn(message: any) {
        this.writeJson(message, LogLevels.WARN);
    }

    /**
     * Write a 'debug' level log.
     */
    public debug?(message: any) {
        this.writeJson(message, LogLevels.DEBUG);
    }

    /**
     * Write a 'verbose' level log.
     */
    public verbose?(message: any) {
        this.writeJson(message, LogLevels.TRACE);
    }

    public extraLogs(
        message: any,
        level: LogLevels,
        extraProps: object = {},
    ): void {
        this.writeJson(message, level, extraProps);
    }

    private writeJson(
        message: any,
        level: LogLevels,
        extraProps: object = {},
    ): void {
        console.log(
            JSON.stringify({
                message: String(message),
                ...extraProps,
                time: Date.now(),
                level: level,
                service: "front-logs",
            }),
        );
    }
}
