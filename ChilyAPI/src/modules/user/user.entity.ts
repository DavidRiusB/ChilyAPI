import { Role } from "src/common/enums/roles.enum";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Credential } from "../auth/auth.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "enum", enum: Role, default: Role.User })
  role: Role;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Credential, { cascade: ["soft-remove"] })
  @JoinColumn()
  credential: Credential;

  @Column({ length: 250 })
  address: string;

  @Column({ unique: true, nullable: false })
  phone: string;

  @Column({ default: "Colombia" })
  country: string;

  @Column({ default: "Fusagasuga" })
  city: string;

  @Column({ nullable: true, default: "1111-1111-1111-1111" })
  creditCardNumber: string;

  @Column({ nullable: true, default: "Mercado Pago" })
  virtualWallet: string;

  @Column({ nullable: true, default: "Mercado Pago" })
  preferredPaymentMethod: string;
}
