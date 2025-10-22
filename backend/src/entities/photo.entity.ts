import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  filename!: string;

  @Column()
  path!: string;

  @Column({ default: 'New Folder' })
  folder!: string;

  @Column()
  userId!: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt!: Date;

  @Column()
  size!: number;

  @Column()
  mimetype!: string;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: Users;

  // Alias for TypeORM repository
  static getRepository = (dataSource: any) => dataSource.getRepository(Photo);
}
