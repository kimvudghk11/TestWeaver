import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService
    ) {
        super({
            // 1. 헤더에서 Bearer 토큰을 추출함
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 2. 만료된 토큰은 거부함
            ignoreExpiration: false,
            // 3. 토큰 서명 확인을 위한 비밀키 (env에서 가져옴)
            secretOrKey: configService.get<string>('JWT_SECRET', 'defaultSecretKey'),
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findOneById(payload.sub);

        if(!user) {
            // 토근은 있는데 해당 유저가 DB에 없는 경우 (탈퇴 등)
            throw new UnauthorizedException('접근 권한이 없습니다.');
        }

        // 여기서 리턴한 값이 컨트롤러의 request.user에 할당
        // 비밀번호는 빼고 리턴하는 것이 안전
        const { password, ...result } = user;
        return result;
    }
}