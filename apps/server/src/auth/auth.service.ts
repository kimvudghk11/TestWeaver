import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    // 회원가입: UserService의 create를 호출하는 래퍼 역할
    async register(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    // 로그인 시 사용자 검증
    async validateUser(loginId: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByLoginId(loginId);

        // 유저가 있고, 비밀번호가 일치하는지 확인
        if(user && (await bcrypt.compare(password, user.password))) {
            // 보안을 위해 비밀번호 제외
            const { password, ...result } = user;

            return result;
        }
        return null;
    }

    // 로그인 성공 시 토큰 발급
    async login(user: any) {
        const payload = { loginId: user.loginId, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}