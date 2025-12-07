import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  // 1. Global Prefix 설정 (Ex. http://localhost:3000/api/...)
  app.setGlobalPrefix("api");

  // 2. CORS 설정
  app.enableCors({
    origin: "*", // 모든 도메인 허용 (필요에 따라 제한 가능)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // 3. Global Validation Pipe (기존 middleware/validateRequest.js 대체)
  // DTO에 정의되지 않은ㄴ 속성은 자동으로 제거 (whitelist: true)하여 보안 강화
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // 요청 데이터를 DTO 타입으로 자동 변환
    }),
  );

  // 4. Swagger 설정 (기존 config/swagger.js 대체)
  const config = new DocumentBuilder()
    .setTitle('TestWeaver API Documentation')
    .setDescription('TestWeaver 자동화 테스트 및 Pairwise 테스트 도구 생성 API 문서')
    .setVersion('1.0')
    .addBearerAuth() // JWT 인증 추가
    .build();

  const Document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, Document);

  // 서버 실행
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Server running on http://localhost:${port}/api`);
  logger.log(`Swagger docs available at http://localhost:${port}/api-docs`);
}

bootstrap();