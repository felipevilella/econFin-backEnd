import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./services/auth.service";
import { jwtConstants } from "./constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/infra/entities/users.entity";
import { UseCaseProxyModule } from "src/infra/usecase-proxy/usecase-proxy.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    UseCaseProxyModule.register(),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60s" },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
