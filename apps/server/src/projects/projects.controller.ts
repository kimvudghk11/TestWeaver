import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    @ApiOperation({ summary: '새 프로젝트 생성' })
    create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
        return this.projectsService.create(createProjectDto, req.user);
    }

    @Get()
    @ApiOperation({ summary: '내 프로젝트 조회' })
    findAll(@Request() req) {
        return this.projectsService.findAll(req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: '프로젝트 상세 조회' })
    findOne(@Param('id') id: string, @Request() req) {
        return this.projectsService.findOne(id, req.user);
    }

    @Delete(':id')
    @ApiOperation({ summary: '프로젝트 삭제' })
    remove(@Param('id') id: string, @Request() req) {
        return this.projectsService.remove(id, req.user);
    }

    @Patch(':id')
    @ApiOperation({ summary: '프로젝트 수정' })
    update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req) {
        return this.projectsService.update(id, updateProjectDto, req.user);
    }
}