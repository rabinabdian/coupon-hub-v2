import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('events')
export class Event {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  type: string;

  @ApiProperty()
  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  userId: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
