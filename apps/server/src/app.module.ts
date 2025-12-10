import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

// User
import { User } from './users/entities/user.entity'; // User 엔티티 임포트
import { UsersModule } from './users/users.module';

// Auth
import { AuthModule } from './auth/auth.module';

// Projects
import  { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    // 환경 변수 설정 (기존 config/env.js 대체)
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 ConfigService 사용 가능
      envFilePath: '.env', // 프로젝트 루트의 .env 파일 로드
    }),
    // TypeORM 비동기 설정 (환경변수 로드 후 실행하기 위함)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'testweaver'),
        // 엔티티 목록 (나중에 모듈이 많아지면 autoLoadEntities: true로 변경 고려)
        entities: [User], // User 엔티티 등록
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // 개발 환경에서만 테이블 자동 생성/수정 (주의 필요)
        logging: configService.get<string>('NODE_ENV') !== 'production', // 쿼리 로그 출력
      }),
    }),
    UsersModule, // UsersModule 등록
    AuthModule, // AuthModule 등록
    ProjectsModule, // ProjectsModule 등록
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
