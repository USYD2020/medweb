import { Injectable } from '@nestjs/common';
import { FormSchema, FormSection, FormField, FieldType, FieldOption } from './types';

@Injectable()
export class MarkdownParserService {
  parseMarkdown(markdown: string, formId: string, version: string): FormSchema {
    const lines = markdown.split('\n');
    const schema: FormSchema = {
      formId,
      title: '',
      version,
      sections: [],
    };

    let currentSection: FormSection | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('### ')) {
        schema.title = line.replace('### ', '').trim();
        continue;
      }

      if (line.startsWith('#### ')) {
        if (currentSection) {
          schema.sections.push(currentSection);
        }
        const sectionTitle = line.replace('#### ', '').trim();
        currentSection = {
          id: this.generateSectionId(sectionTitle),
          title: sectionTitle,
          fields: [],
        };
        continue;
      }

      if (currentSection && line.match(/^\d+\./)) {
        const field = this.parseField(line, lines, i);
        if (field) {
          currentSection.fields.push(field);
        }
      }
    }

    if (currentSection) {
      schema.sections.push(currentSection);
    }

    return schema;
  }

  private parseField(line: string, allLines: string[], currentIndex: number): FormField | null {
    const labelMatch = line.match(/^\d+\.\s+\*\*(.+?)：?\*\*/);
    if (!labelMatch) return null;

    const label = labelMatch[1].trim();
    const required = line.includes('(必填)') || line.includes('*');

    let type: FieldType = 'text';
    let options: FieldOption[] = [];

    // 先检查下一行是否有选项，以确定字段类型
    const nextLineIndex = currentIndex + 1;
    if (nextLineIndex < allLines.length) {
      const nextLine = allLines[nextLineIndex].trim();
      if (nextLine.match(/^[□☐]/)) {
        options = this.parseOptions(allLines, nextLineIndex);
        type = options.length > 0 ? 'checkbox' : 'text';
      } else if (nextLine.match(/^[○◯]/)) {
        options = this.parseOptions(allLines, nextLineIndex);
        type = options.length > 0 ? 'radio' : 'text';
      }
    }

    // 如果没有找到选项，检查行内类型标记
    if (options.length === 0) {
      if (line.includes('[填空]') || line.includes('[文本]')) {
        type = 'text';
      } else if (line.includes('[数字]')) {
        type = 'number';
      } else if (line.includes('[日期]') || line.includes('YYYY-MM-DD')) {
        type = 'date';
      } else if (line.includes('[时间]') || line.includes('HH:mm')) {
        type = 'time';
      } else if (line.includes('[长文本]')) {
        type = 'textarea';
      }
    }

    return {
      id: this.generateFieldId(label, currentIndex),
      type,
      label,
      required,
      options: options.length > 0 ? options : undefined,
    };
  }

  private parseOptions(lines: string[], startIndex: number): FieldOption[] {
    const options: FieldOption[] = [];

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.match(/^\d+\./) || line.startsWith('####')) {
        break;
      }

      const optionMatch = line.match(/^[□☐○◯]\s+(.+)$/);
      if (optionMatch) {
        const optionLabel = optionMatch[1].trim();
        options.push({
          value: this.generateOptionValue(optionLabel),
          label: optionLabel,
        });
      }
    }

    return options;
  }

  private generateSectionId(title: string): string {
    const cleaned = title.replace(/\s+/g, '_').replace(/[^\w]/g, '');
    return cleaned || `section_${Date.now()}`;
  }

  private generateFieldId(label: string, index: number): string {
    const cleaned = label.replace(/\s+/g, '_').replace(/[^\w]/g, '');
    return cleaned || `field_${Date.now()}_${index}`;
  }

  private generateOptionValue(label: string): string {
    const cleaned = label.replace(/\s+/g, '_').replace(/[^\w]/g, '');
    return cleaned || `option_${Date.now()}`;
  }
}
