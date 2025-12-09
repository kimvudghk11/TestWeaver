import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'user123', description: '로그인 ID' })
    @IsString()
    @IsNotEmpty()
    loginId: string;

    @ApiProperty({ example: 'password123!', description: '비밀번호' })
    @IsString()
    @IsNotEmpty()
    password: string;
}