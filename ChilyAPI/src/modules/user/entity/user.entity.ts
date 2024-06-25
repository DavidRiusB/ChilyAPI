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
import { Credential } from "../../auth/entities/auth.entity";
import { Order } from "../../order/entity/order.entity";
import { Address } from "src/modules/addresses/entities/addresses.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "enum", enum: Role, default: Role.User })
  role: Role;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 20, default: "google_account"})
  //national identification number
  NIN?: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: "google_account", nullable: true, default: false })
  googleAuth: boolean;
  @OneToOne(() => Credential)
  @JoinColumn()
  credential: Credential;
  
  @OneToMany(() => Address, (address) => address.user, {})
  addresses: Address[];
  @Column({ unique: true, nullable: false, default: "google_account"})
  phone?: string;

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
