import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    @ApiProperty({ description: '프로젝트 이름', example: 'Project Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: '프로젝트 설명', example: 'This is a sample project.', required: false })
    @IsString()
    @IsOptional()
    description?: string;
    
    @ApiProperty({ description: 'Swagger URL', example: 'http://example.com/swagger.json', required: false })
    @IsOptional()
    @IsUrl({}, { message: 'swaggerUrl은 유효한 URL이어야 합니다.' })
    swaggerUrl?: string;
}