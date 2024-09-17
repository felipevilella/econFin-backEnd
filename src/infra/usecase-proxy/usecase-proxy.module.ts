import { DynamicModule, Module } from '@nestjs/common';
import { EnvironmentConfigModule } from '../database/config/environment-config.module';
import { RepositoriesModule } from '../repositories/repositories.module';


@Module({
  imports: [EnvironmentConfigModule, RepositoriesModule],
})
export class UsecaseProxyModule {
  static register(): DynamicModule {
    return {
      module: UsecaseProxyModule,
      providers: [],
      exports: [],
    };
  }
}
