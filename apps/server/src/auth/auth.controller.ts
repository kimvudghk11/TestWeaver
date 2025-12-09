import {
    Controller,
    Get,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UnprocessableEntityException,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({ status: 201, description: '회원가입 성공'})
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '로그인' })
    @ApiResponse({ status: 200, description: '로그인 성공 (토큰 발급)'})
    @ApiResponse({ status: 422, description: '로그인 실패'})
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(
            loginDto.loginId,
            loginDto.password
        );

        if(!user) {
            throw new UnprocessableEntityException('로그인 ID 또는 비밀번호가 올바르지 않습니다.');
        }

        return this.authService.login(user);
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: '프로필 조회' })
    @ApiResponse({ status: 200, description: '프로필 조회 성공'})
    @ApiResponse({ status: 401, description: '인증 실패'})
    getProfile(@Request() req) {
        return req.user;
    }
}