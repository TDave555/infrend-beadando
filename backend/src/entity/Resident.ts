import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm"
import { Apartment } from "./Apartment";
import { Transaction } from "./Transaction";
import { ResidentDto } from "../../../models"

@Entity({name: "residents"})
export class Resident implements ResidentDto {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    balance!: number;

    @Column()
    moveInDate!: Date;

    @Column({nullable: true})
    moveOutDate?: Date;

    @Column({default: true})
    isActive!: boolean;

    @OneToOne(() => Apartment, apartment => apartment.resident)
    apartment?: Apartment;

    @OneToMany(() => Transaction, transaction => transaction.resident)
    transactions?: Transaction[];

}
