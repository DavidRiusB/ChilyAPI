import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

interface Location {
  lat: number;
  lng: number;
}

@Entity({
  name: "addresses",
})
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column({ type: "jsonb" })
  location: Location;

  @Column({
    nullable: true,
    length: 50,
  })
  note: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
