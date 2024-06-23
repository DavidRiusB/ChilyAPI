import { Role } from "src/common/enums/roles.enum";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Credential } from "../../auth/auth.entity";
import { Order } from "../../order/entity/order.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "enum", enum: Role, default: Role.User })
  role: Role;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 20 })
  //national identification number
  NIN: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Credential)
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

  @OneToMany(() => Order, (order) => order.user, {})
  orders: Order[];

  @Column({ nullable: true, default: "1111-1111-1111-1111" })
  creditCardNumber: string;

  @Column({ nullable: true, default: "Mercado Pago" })
  virtualWallet: string;

  @Column({ nullable: true, default: "Mercado Pago" })
  preferredPaymentMethod: string;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt?: Date;
}
