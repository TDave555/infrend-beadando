import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Resident } from "./Resident";
import { Apartment } from "./Apartment";
import { TransactionDto, TransactionType } from "../../../models";

@Entity({name: "transactions"})
export class Transaction implements TransactionDto {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "enum", enum: TransactionType})
    type!: TransactionType;

    @Column({type: "decimal", precision: 10, scale: 2})
    amount!: number;

    @Column()
    date!: Date;

    @Column()
    description!: string;

    @ManyToOne(() => Resident, resident => resident.transactions, {eager: true})
    resident!: Resident;

    @ManyToOne(() => Apartment, apartment => apartment.transactions, {nullable: true, eager: true})
    apartment?: Apartment;

  }
