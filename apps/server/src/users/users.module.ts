import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])], // User 엔티티를 이 모듈에서 사용 등록
    providers: [UsersService],
    exports: [UsersService], // AuthModule에서 UsersService를 사용하기 위해 export
})
export class UsersModule {}