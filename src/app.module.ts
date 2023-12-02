import { Module } from "@nestjs/common";
import { LogController } from "./controllers/log/log.controller";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { JsonLogger } from "./services/json-logger.service";

@Module({
    imports: [PrometheusModule.register()],
    controllers: [LogController],
    providers: [JsonLogger],
})
export class AppModule {}
