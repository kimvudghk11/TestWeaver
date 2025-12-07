import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 환경 변수 설정 (기존 config/env.js 대체)
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 ConfigService 사용 가능
      envFilePath: '.env', // 프로젝트 루트의 .env 파일 로드
    }),
    // 추후 DataBaseModule, AuthModule 등 다른 모듈 추가 가능
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
