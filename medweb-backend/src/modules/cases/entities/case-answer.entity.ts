import {
  Entity,
  Column,
  PrimaryColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Case } from './case.entity';

@Entity('case_answers')
export class CaseAnswer {
  @PrimaryColumn({ name: 'case_id', type: 'uuid' })
  caseId: string;

  @OneToOne(() => Case, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'case_id' })
  case: Case;

  @Column({ name: 'answers_json', type: 'jsonb', default: {} })
  answersJson: any;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
