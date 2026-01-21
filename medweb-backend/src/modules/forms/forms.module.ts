import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormVersion } from './entities/form-version.entity';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { MarkdownParserService } from './parsers/markdown-parser.service';

@Module({
  imports: [TypeOrmModule.forFeature([FormVersion])],
  controllers: [FormsController],
  providers: [FormsService, MarkdownParserService],
  exports: [FormsService],
})
export class FormsModule {}
