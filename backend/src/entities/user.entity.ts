import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JournalEntry } from './Journal.entity';
import { Photo } from './photo.entity';

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

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified!: boolean;

  @Column({ name: 'email_verification_token', nullable: true })
  emailVerificationToken?: string;

  @Column({ name: 'email_verification_expires', nullable: true })
  emailVerificationExpires?: Date;

  @OneToMany(() => JournalEntry, (journalEntry) => journalEntry.user)
  journalEntries: JournalEntry[];

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  // Alias for TypeORM repository
  static getRepository = (dataSource: any) => dataSource.getRepository(Users);
}
