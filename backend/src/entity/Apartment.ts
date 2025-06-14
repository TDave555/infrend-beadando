import { Entity, PrimaryGeneratedColumn, Column, Decimal128, OneToMany, ManyToOne, JoinColumn, OneToOne } from "typeorm"
import { Resident } from "./Resident"
import { ApartmentDto } from "../../../models"
import { Transaction } from "./Transaction";

@Entity({name: "apartments"})
export class Apartment implements ApartmentDto {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar", length: "25", unique: true})
    apartmentNumber!: string;

    //@Column({type: "decimal", precision: 6, scale: 2})
    @Column()
    area!: number;

    @Column()
    airVolume!: number;

    @OneToOne(() => Resident, resident => resident.apartment, {eager: true, cascade: true})
    @JoinColumn()
    resident!: Resident;

    @OneToMany(() => Transaction, transaction => transaction.apartment)
    transactions?: Transaction[];
  }
