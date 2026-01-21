import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { FormQueryDto } from './dto/form-query.dto';
import { Roles, Role } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('forms')
@Roles(Role.ADMIN)
export class FormsController {
  constructor(private formsService: FormsService) {}

  @Post()
  async create(@Body() createFormDto: CreateFormDto, @CurrentUser() user: any) {
    return this.formsService.create(createFormDto, user.id);
  }

  @Get()
  async findAll(@Query() query: FormQueryDto) {
    return this.formsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.formsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formsService.update(id, updateFormDto);
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string) {
    return this.formsService.publish(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.formsService.delete(id);
    return { message: '删除成功' };
  }
}
