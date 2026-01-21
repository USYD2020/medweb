import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from './entities/case.entity';
import { CaseAnswer } from './entities/case-answer.entity';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CaseQueryDto } from './dto/case-query.dto';

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private caseRepository: Repository<Case>,
    @InjectRepository(CaseAnswer)
    private answerRepository: Repository<CaseAnswer>,
  ) {}

  async create(userId: string, createCaseDto: CreateCaseDto): Promise<Case> {
    const caseNumber = await this.generateCaseNumber();

    const newCase = this.caseRepository.create({
      caseNumber,
      createdBy: userId,
      formVersionId: createCaseDto.formVersionId || null,
      status: 'draft',
    });

    const savedCase = await this.caseRepository.save(newCase);

    const answer = this.answerRepository.create({
      caseId: savedCase.id,
      answersJson: {},
    });
    await this.answerRepository.save(answer);

    return savedCase;
  }

  async findAll(userId: string, role: string, query: CaseQueryDto) {
    const { page = 1, limit = 10, status } = query;
    const queryBuilder = this.caseRepository
      .createQueryBuilder('case')
      .leftJoinAndSelect('case.formVersion', 'formVersion')
      .leftJoinAndSelect('case.creator', 'creator');

    if (role !== 'admin') {
      queryBuilder.where('case.createdBy = :userId', { userId });
    }

    if (status) {
      queryBuilder.andWhere('case.status = :status', { status });
    }

    const [items, total] = await queryBuilder
      .orderBy('case.createdAt', 'DESC')
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

  async findOne(id: string, userId: string, role: string): Promise<any> {
    const caseEntity = await this.caseRepository.findOne({
      where: { id },
      relations: ['formVersion', 'creator'],
    });

    if (!caseEntity) {
      throw new NotFoundException('病例不存在');
    }

    if (role !== 'admin' && caseEntity.createdBy !== userId) {
      throw new ForbiddenException('无权访问此病例');
    }

    const answer = await this.answerRepository.findOne({
      where: { caseId: id },
    });

    return {
      ...caseEntity,
      answers: answer?.answersJson || {},
    };
  }

  async update(
    id: string,
    userId: string,
    role: string,
    updateDto: UpdateCaseDto,
  ): Promise<any> {
    const caseEntity = await this.findOne(id, userId, role);

    if (caseEntity.status !== 'draft') {
      throw new BadRequestException('只有草稿状态的病例可以编辑');
    }

    if (updateDto.answers) {
      await this.answerRepository.update(
        { caseId: id },
        { answersJson: updateDto.answers },
      );

      const updates: any = {};
      if (updateDto.answers.patient_hospital_number) {
        updates.patientHospitalNumber = updateDto.answers.patient_hospital_number;
      }
      if (updateDto.answers.patient_admission_date) {
        updates.patientAdmissionDate = updateDto.answers.patient_admission_date;
      }
      if (updateDto.answers.arrest_type) {
        updates.arrestType = updateDto.answers.arrest_type;
      }

      if (Object.keys(updates).length > 0) {
        await this.caseRepository.update(id, updates);
      }
    }

    return this.findOne(id, userId, role);
  }

  async submit(id: string, userId: string, role: string): Promise<any> {
    const caseEntity = await this.findOne(id, userId, role);

    if (caseEntity.status !== 'draft') {
      throw new BadRequestException('只有草稿状态的病例可以提交');
    }

    await this.caseRepository.update(id, {
      status: 'submitted',
      submittedAt: new Date(),
    });

    return this.findOne(id, userId, role);
  }

  async delete(id: string, userId: string, role: string): Promise<void> {
    const caseEntity = await this.findOne(id, userId, role);

    if (caseEntity.status !== 'draft') {
      throw new BadRequestException('只有草稿状态的病例可以删除');
    }

    // 先删除关联的答案记录
    await this.answerRepository.delete({ caseId: id });
    // 再删除病例记录
    await this.caseRepository.delete(id);
  }

  private async generateCaseNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const prefix = 'CASE' + year + month + day;

    const lastCase = await this.caseRepository
      .createQueryBuilder('case')
      .where('case.caseNumber LIKE :prefix', { prefix: prefix + '%' })
      .orderBy('case.caseNumber', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastCase) {
      const lastSequence = parseInt(lastCase.caseNumber.slice(-4));
      sequence = lastSequence + 1;
    }

    return prefix + sequence.toString().padStart(4, '0');
  }
}
