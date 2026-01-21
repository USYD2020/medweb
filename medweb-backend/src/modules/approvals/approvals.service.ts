import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalRequest } from './entities/approval-request.entity';
import { UsersService } from '../users/users.service';
import { ApprovalQueryDto } from './dto/approval-query.dto';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(ApprovalRequest)
    private approvalRepository: Repository<ApprovalRequest>,
    private usersService: UsersService,
  ) {}

  async createApprovalRequest(userId: string): Promise<ApprovalRequest> {
    const approval = this.approvalRepository.create({
      userId,
      status: 'pending',
    });
    return this.approvalRepository.save(approval);
  }

  async findAll(query: ApprovalQueryDto) {
    const { page = 1, limit = 10, status } = query;
    const queryBuilder = this.approvalRepository
      .createQueryBuilder('approval')
      .leftJoinAndSelect('approval.user', 'user')
      .orderBy('approval.submittedAt', 'DESC');

    if (status) {
      queryBuilder.where('approval.status = :status', { status });
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

  async approve(id: string, reviewerId: string, note?: string) {
    const approval = await this.approvalRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!approval) {
      throw new NotFoundException('审核申请不存在');
    }

    if (approval.status !== 'pending') {
      throw new BadRequestException('该申请已被处理');
    }

    approval.status = 'approved';
    approval.reviewerId = reviewerId;
    approval.reviewedAt = new Date();
    approval.decisionNote = note ?? null;
    await this.approvalRepository.save(approval);

    await this.usersService.updateStatus(approval.userId, 'approved');

    return { message: '审核通过' };
  }

  async reject(id: string, reviewerId: string, note: string) {
    const approval = await this.approvalRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!approval) {
      throw new NotFoundException('审核申请不存在');
    }

    if (approval.status !== 'pending') {
      throw new BadRequestException('该申请已被处理');
    }

    approval.status = 'rejected';
    approval.reviewerId = reviewerId;
    approval.reviewedAt = new Date();
    approval.decisionNote = note;
    await this.approvalRepository.save(approval);

    await this.usersService.updateStatus(approval.userId, 'rejected');

    return { message: '审核拒绝' };
  }
}
