import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm"
import { Apartment } from "./Apartment";
import { Transaction } from "./Transaction";
import { ResidentDto } from "../../../models"

@Entity({name: "residents"})
export class Resident implements ResidentDto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: "decimal", precision: 6, scale: 2})
    balance: number;

    @Column()
    moveInDate: Date;

    @Column({nullable: true})
    moveOutDate?: Date;

    @Column()
    isActive: boolean;

    @OneToOne(() => Apartment, apartment => apartment.resident, {eager: true})
    apartment?: Apartment;

    @OneToMany(() => Transaction, transaction => transaction.resident)
    transactions: Transaction[];

}
