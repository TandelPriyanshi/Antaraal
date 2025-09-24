import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JournalEntry } from './Journal.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'profile_pic', nullable: true, default: null })
  profilePic?: string;

  @OneToMany(() => JournalEntry, (journalEntry) => journalEntry.user)
  journalEntries: JournalEntry[];

  // Alias for TypeORM repository
  static getRepository = (dataSource: any) => dataSource.getRepository(Users);
}
