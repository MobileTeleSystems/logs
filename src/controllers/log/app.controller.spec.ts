import { Test, TestingModule } from "@nestjs/testing";
import { LogController } from "./log.controller";
import { LogLevels } from "../../enums/LogLevels";
import { JsonLogger } from "../../services/json-logger.service";

describe("AppController", () => {
    let appController: LogController;
    let loggerMock: { extraLogs: jest.Mock };

    beforeEach(async () => {
        loggerMock = {
            extraLogs: jest.fn(),
        };
        const app: TestingModule = await Test.createTestingModule({
            controllers: [LogController],
            providers: [{ provide: JsonLogger, useValue: loggerMock }],
        })
            .overrideProvider(JsonLogger)
            .useValue(loggerMock)
            .compile();
        appController = app.get<LogController>(LogController);
    });

    const body = { foo: "bar" };
    const headers = {
        "user-agent": "test-agent",
        "x-real-ip": "127.0.0.1",
        "x-trace-id": "trace-123",
    };

    it("should call proceeLog with INFO for writeLog", () => {
        const spy = jest.spyOn<any, any>(appController as any, "proceeLog");
        appController.writeLog(body, headers);
        expect(spy).toHaveBeenCalledWith(body, headers, LogLevels.INFO);
    });

    it("should call proceeLog with WARN for writeWarn", () => {
        const spy = jest.spyOn<any, any>(appController as any, "proceeLog");
        appController.writeWarn(body, headers);
        expect(spy).toHaveBeenCalledWith(body, headers, LogLevels.WARN);
    });

    it("should call proceeLog with ERROR for writeError", () => {
        const spy = jest.spyOn<any, any>(appController as any, "proceeLog");
        appController.writeError(body, headers);
        expect(spy).toHaveBeenCalledWith(body, headers, LogLevels.ERROR);
    });

    it("should call proceeLog with DEBUG for writeDebug", () => {
        const spy = jest.spyOn<any, any>(appController as any, "proceeLog");
        appController.writeDebug(body, headers);
        expect(spy).toHaveBeenCalledWith(body, headers, LogLevels.DEBUG);
    });

    it("should call proceeLog with TRACE for writeVerbose", () => {
        const spy = jest.spyOn<any, any>(appController as any, "proceeLog");
        appController.writeVerbose(body, headers);
        expect(spy).toHaveBeenCalledWith(body, headers, LogLevels.TRACE);
    });
});
