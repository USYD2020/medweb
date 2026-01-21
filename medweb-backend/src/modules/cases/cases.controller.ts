import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { CaseQueryDto } from './dto/case-query.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  async create(
    @Body() createCaseDto: CreateCaseDto,
    @CurrentUser() user: any,
  ) {
    return this.casesService.create(user.id, createCaseDto);
  }

  @Get()
  async findAll(@Query() query: CaseQueryDto, @CurrentUser() user: any) {
    return this.casesService.findAll(user.id, user.role, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.casesService.findOne(id, user.id, user.role);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCaseDto: UpdateCaseDto,
    @CurrentUser() user: any,
  ) {
    return this.casesService.update(id, user.id, user.role, updateCaseDto);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @CurrentUser() user: any) {
    return this.casesService.submit(id, user.id, user.role);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.casesService.delete(id, user.id, user.role);
    return { message: '病例删除成功' };
  }
}
