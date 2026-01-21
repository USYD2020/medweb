import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { ApprovalQueryDto } from './dto/approval-query.dto';
import { ApprovalDecisionDto } from './dto/approval-decision.dto';
import { Roles, Role } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('approvals')
@Roles(Role.ADMIN)
export class ApprovalsController {
  constructor(private approvalsService: ApprovalsService) {}

  @Get()
  async findAll(@Query() query: ApprovalQueryDto) {
    return this.approvalsService.findAll(query);
  }

  @Post(':id/approve')
  async approve(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() decisionDto: ApprovalDecisionDto,
  ) {
    return this.approvalsService.approve(id, user.id, decisionDto.note);
  }

  @Post(':id/reject')
  async reject(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() decisionDto: ApprovalDecisionDto,
  ) {
    if (!decisionDto.note) {
      return { message: '拒绝时必须填写原因' };
    }
    return this.approvalsService.reject(id, user.id, decisionDto.note);
  }
}
