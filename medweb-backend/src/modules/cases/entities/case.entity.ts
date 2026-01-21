import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { FormVersion } from '../../forms/entities/form-version.entity';

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'case_number', unique: true, length: 50 })
  @Index()
  caseNumber: string;

  @Column({ name: 'created_by', type: 'uuid' })
  @Index()
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ name: 'form_version_id', type: 'uuid', nullable: true })
  formVersionId: string | null;

  @ManyToOne(() => FormVersion, { nullable: true })
  @JoinColumn({ name: 'form_version_id' })
  formVersion: FormVersion | null;

  @Column({ length: 20, default: 'draft' })
  @Index()
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'submitted_at', type: 'timestamp', nullable: true })
  submittedAt: Date | null;

  @Column({ name: 'patient_hospital_number', type: 'varchar', length: 100, nullable: true })
  patientHospitalNumber: string | null;

  @Column({ name: 'patient_admission_date', type: 'date', nullable: true })
  patientAdmissionDate: Date | null;

  @Column({ name: 'arrest_type', type: 'varchar', length: 20, nullable: true })
  arrestType: string | null;
}
