import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "credentials" })
export class Credential {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ unique: true, select: false })
  email: string;

  @Column({ length: 60, select: false })
  password: string;
}
