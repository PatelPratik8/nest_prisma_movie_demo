import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    CacheModule.register(),
    MoviesModule,
    // AuthModule,
    DatabaseModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
