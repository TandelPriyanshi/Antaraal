import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Users } from './user.entity';

@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Users, (user: Users) => user.journalEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: Users;

  @Column({ type: 'date' })
  date!: Date;

  @Column('varchar', { length: 255 })
  title!: string;

  @Column('text')
  content!: string;

  @Column('text', { nullable: true })
  summary: string | null = null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
