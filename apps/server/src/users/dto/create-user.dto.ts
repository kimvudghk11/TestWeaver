import { from } from "rxjs";
import {
    IsString,
    IsEmail,
    MinLength,
    MaxLength,
    Matches,
    IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: 'user123', description: '로그인 ID' })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    loginId: string;

    @ApiProperty({ example: 'user@example.com', description: '이메일' })
    @IsEmail()
    email: string;
    
    @ApiProperty({ example: '홍길동', description: '사용자 이름' })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 'password123!', description: '비밀번호' })
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
        message: '비밀번호는 최소 하나의 문자, 숫자 및 특수 문자를 포함해야 합니다.',
    })
    password: string;

    @ApiProperty({ example: '010-1234-5678', description: '전화번호', required: false })
    @IsOptional()
    @IsString()
    @Matches(/^\d{2,3}-\d{3,4}-\d{4}$/, {
        message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)',
    })
    phone?: string;
}