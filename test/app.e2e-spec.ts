/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/log/log (POST)", () => {
        return request(app.getHttpServer())
            .post("/log/log")
            .send({ foo: "bar" })
            .set("user-agent", "test-agent")
            .set("x-real-ip", "127.0.0.1")
            .set("x-trace-id", "trace-123")
            .expect(201)
            .expect("");
    });

    it("/log/warn (POST)", () => {
        return request(app.getHttpServer())
            .post("/log/warn")
            .send({ foo: "bar" })
            .set("user-agent", "test-agent")
            .set("x-real-ip", "127.0.0.1")
            .set("x-trace-id", "trace-123")
            .expect(201)
            .expect("");
    });

    it("/log/error (POST)", () => {
        return request(app.getHttpServer())
            .post("/log/error")
            .send({ foo: "bar" })
            .set("user-agent", "test-agent")
            .set("x-real-ip", "127.0.0.1")
            .set("x-trace-id", "trace-123")
            .expect(201)
            .expect("");
    });

    it("/log/debug (POST)", () => {
        return request(app.getHttpServer())
            .post("/log/debug")
            .send({ foo: "bar" })
            .set("user-agent", "test-agent")
            .set("x-real-ip", "127.0.0.1")
            .set("x-trace-id", "trace-123")
            .expect(201)
            .expect("");
    });

    it("/log/verbose (POST)", () => {
        return request(app.getHttpServer())
            .post("/log/verbose")
            .send({ foo: "bar" })
            .set("user-agent", "test-agent")
            .set("x-real-ip", "127.0.0.1")
            .set("x-trace-id", "trace-123")
            .expect(201)
            .expect("");
    });
});
