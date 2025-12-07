import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    // 회원가입 (사용자 생성)
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { loginId, email, name, password, phone } = createUserDto;

        // 중복 확인 (ID or Email)
        const existingUser = await this.usersRepository.findOne({
            where: [
                { loginId }, { email },
            ],
        });

        if (existingUser) {
            if(existingUser.loginId === loginId) {
                throw new ConflictException('이미 사용 중인 로그인 ID입니다.');
            }
            if(existingUser.email === email) {
                throw new ConflictException('이미 사용 중인 이메일입니다.');
            }
        }

        // 비밀번호 해싱
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 사용자 객체 생성 및 저장
        try {
            const newUser = this.usersRepository.create({
                loginId,
                email,
                name,
                password: hashedPassword,
                phone: phone || null,
            });

            return await this.usersRepository.save(newUser);
        } catch (error) {
            throw new InternalServerErrorException('사용자 생성 중 오류가 발생했습니다.');
        }
    }

    // 로그인 시 사용자 조회를 위한 메서드
    async findByLoginId(loginId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { loginId } });
    }

    // ID로 사용자 찾기 (JWT Strategy에서 사용 예정)
    async findOneById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }
}