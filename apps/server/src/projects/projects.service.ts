import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {}

    // 프로젝트 생성 (유저 정보 포함)
    async create(createProjectDto: CreateProjectDto, user: User): Promise<Project> {
        const project = this.projectRepository.create({
            ...createProjectDto,
            user,
        });

        return await this.projectRepository.save(project);
    }

    // 내 프로젝트 목록 조회
    async findAll(user: User): Promise<Project[]> {
        return this.projectRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
        });
    }

    // 특정 프로젝트 상세 ㅈ회
    async findOne(id: string, user: User): Promise<Project> {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if(!project) {
            throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
        }

        // 보안: 남의 프로젝트를 조회하려고 할 때 차단하기
        if(project.user.id !== user.id) {
            throw new ForbiddenException('접근 권한이 없습니다.');
        }

        return project;
    }

    // 프로젝트 삭제
    async remove(id: string, user: User): Promise<void> {
        // 존재 여부 확인
        const project = await this.findOne(id, user);
        await this.projectRepository.remove(project);
    }
}