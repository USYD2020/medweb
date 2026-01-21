import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormVersion } from './entities/form-version.entity';
import { MarkdownParserService } from './parsers/markdown-parser.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { FormQueryDto } from './dto/form-query.dto';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(FormVersion)
    private formRepository: Repository<FormVersion>,
    private markdownParser: MarkdownParserService,
  ) {}

  async create(createFormDto: CreateFormDto, userId: string): Promise<FormVersion> {
    const schemaJson = this.markdownParser.parseMarkdown(
      createFormDto.markdownContent,
      '',
      createFormDto.version,
    );

    const form = this.formRepository.create({
      name: createFormDto.name,
      version: createFormDto.version,
      description: createFormDto.description,
      schemaJson,
      status: 'draft',
      createdBy: userId,
    });

    return this.formRepository.save(form);
  }

  async findAll(query: FormQueryDto): Promise<any> {
    const { page = 1, limit = 10, status } = query;
    const queryBuilder = this.formRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.creator', 'creator')
      .orderBy('form.createdAt', 'DESC');

    if (status) {
      queryBuilder.where('form.status = :status', { status });
    }

    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<FormVersion> {
    const form = await this.formRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!form) {
      throw new NotFoundException('表单不存在');
    }

    return form;
  }

  async update(id: string, updateFormDto: UpdateFormDto): Promise<FormVersion> {
    const form = await this.findOne(id);

    if (form.status !== 'draft') {
      throw new BadRequestException('只有草稿状态的表单可以编辑');
    }

    if (updateFormDto.name) {
      form.name = updateFormDto.name;
    }

    if (updateFormDto.description !== undefined) {
      form.description = updateFormDto.description;
    }

    if (updateFormDto.markdownContent) {
      form.schemaJson = this.markdownParser.parseMarkdown(
        updateFormDto.markdownContent,
        form.id,
        form.version,
      );
    }

    return this.formRepository.save(form);
  }

  async publish(id: string): Promise<FormVersion> {
    const form = await this.findOne(id);

    if (form.status !== 'draft') {
      throw new BadRequestException('只有草稿状态的表单可以发布');
    }

    form.status = 'published';
    form.publishedAt = new Date();

    return this.formRepository.save(form);
  }

  async delete(id: string): Promise<void> {
    const form = await this.findOne(id);

    if (form.status === 'published') {
      throw new BadRequestException('已发布的表单不能删除');
    }

    await this.formRepository.delete(id);
  }
}
