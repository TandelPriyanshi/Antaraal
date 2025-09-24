import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { JournalEntry } from './Journal.entity';

@Entity('tags')
export class Tags {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => JournalEntry, (journalEntry) => journalEntry.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'journal_id' })
  journal!: JournalEntry;

  @Column('varchar', { length: 100 })
  tag_text!: string;
}
