import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

// CreateProjectDto의 모든 속성을 가져오되, 전부 선택 사항으로 변경
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}