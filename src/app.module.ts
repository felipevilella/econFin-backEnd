import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infra/database/config/environment-config.module';
import { UsecaseProxyModule } from './infra/usecase-proxy/usecase-proxy.module';

@Module({
  imports: [UsecaseProxyModule.register(), EnvironmentConfigModule],
  // controllers: [UserController],
})
export class AppModule {}
