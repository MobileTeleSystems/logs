import { Test, TestingModule } from "@nestjs/testing";
import { LogController } from "./log.controller";

describe("AppController", () => {
    let appController: LogController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [LogController],
            providers: [],
        }).compile();

        appController = app.get<LogController>(LogController);
    });

    describe("root", () => {
        it('should return "Hello World!"', () => {
            expect("Hello World!").toBe("Hello World!");
        });
    });
});
