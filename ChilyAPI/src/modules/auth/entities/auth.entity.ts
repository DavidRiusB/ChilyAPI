import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "credentials" })
export class Credential {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ unique: true, length: 20 })
  //national identification number
  NIN: string;

  @Column({ unique: true, nullable: false })
  phone: string;

  @Column({ unique: true, select: false })
  email: string;

  @Column({ length: 60, select: false })
  password: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ type: "timestamp", nullable: true })
  resetPasswordExpires: Date;
}
