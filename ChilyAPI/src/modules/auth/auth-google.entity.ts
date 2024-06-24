import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usersGoogle' })
export class UserGoogle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  displayName: string;
}
