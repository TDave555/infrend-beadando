import { basename } from "path";
import { createDefaultResident, TransactionDto, TransactionType } from "../../../models";
import { AppDataSource } from "../data-source";
import { Apartment } from "../entity/Apartment";
import { Resident } from "../entity/Resident";
import { Transaction } from "../entity/Transaction";
import { Controller } from "./base.controller";

export class TransactionController extends Controller {
  repository = AppDataSource.getRepository(Transaction);
  residentRepository = AppDataSource.getRepository(Resident);
  apartmentRepository = AppDataSource.getRepository(Apartment);

  getTransactionsOfResident = async (req, res) => {
    try {
      const residentId = req.params.residentId;
      const transactions: Transaction[] = await this.repository.find({
        where: {
           resident: {
            id: residentId,
           },
        },
      });

      res.json(transactions);

    } catch (err) {
      this.handleError(res, err);
    }
  }

  pay = async (req, res) => {
    try {
      const transactionDto = req.body as TransactionDto;

      const residentDto = transactionDto.resident
      const resident = await this.residentRepository.findOneBy({id: residentDto.id})
      resident.balance = Number(resident.balance) - Number(transactionDto.amount)
      const updatedResident = await this.residentRepository.save(resident);

      //const transactionWoId: Omit<TransactionDto, "id"> = transactionDto;
      const transaction = this.repository.create(transactionDto);
      delete transaction.id;
      transaction.type = TransactionType.PAYMENT;
      transaction.date = new Date();
      transaction.resident = updatedResident;
      const savedTransaction = await this.repository.save(transaction);

      res.json(savedTransaction)
    } catch (err) {
      this.handleError(res, err);
    }
  }

  multiplyCostByArea = async (req, res) => {
    try {
      const transactionDto = req.body as TransactionDto;

      const apartments = await this.apartmentRepository.find();

      //const transactionWoId: Omit<TransactionDto, "id"> = transactionDto;
      const transactions: Transaction[] = [];
      const residents: Resident[] = [];

      const amount: number = transactionDto.amount;

      apartments.forEach(apartment => {

        transactionDto.amount = Number(apartment.area) * amount;
        transactionDto.apartment = apartment;
        transactionDto.resident = apartment.resident;

        let resident = apartment.resident;
        resident.balance = Number(resident.balance) + Number(transactionDto.amount);
        residents.push(resident);

        let transaction = this.repository.create(transactionDto);
        delete transaction.id;
        transactions.push(transaction);

      });

      await this.residentRepository.save(residents);
      const createdTransactions = await this.repository.save(transactions);
      res.json(createdTransactions);
    } catch (err) {
      this.handleError(res, err);
    }
  }

  divideCostByArea = async (req, res) => {
    try {
      const transactionDto = req.body as TransactionDto;

      const apartments = await this.apartmentRepository.find();

      //const transactionWoId: Omit<TransactionDto, "id"> = transactionDto;
      const transactions: Transaction[] = [];
      const residents: Resident[] = []

      let areaSum: number = 0;

      apartments.forEach(apartment => {
        areaSum = areaSum + Number(apartment.area)
      });

      const amountForSqrm: number = transactionDto.amount/areaSum;

      apartments.forEach(apartment => {

        transactionDto.amount = Number(apartment.area) * amountForSqrm;
        transactionDto.apartment = apartment;
        transactionDto.resident = apartment.resident;

        let resident = apartment.resident;
        resident.balance = Number(resident.balance) + Number(transactionDto.amount);
        residents.push(resident);

        this.repository.create(transactionDto);
        let transaction = this.repository.create(transactionDto);
        delete transaction.id;
        transactions.push(transaction);
      });

      await this.residentRepository.save(residents);
      const createdTransactions = await this.repository.save(transactions);
      res.json(createdTransactions);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  delete = async (req, res) => {
    try {
      const id = req.params.id;
      const transaction = await this.repository.findOne({
        where: {id: id}, relations: ["resident"]
      });

      if (!transaction) {
        return this.handleError(res, null, 404, 'Entity not found.');
      }

      const resident = transaction.resident

      if (transaction.type = TransactionType.COST) {
        resident.balance = resident.balance - transaction.amount;
      } else if (transaction.type = TransactionType.PAYMENT) {
        resident.balance = Number(resident.balance) + Number(transaction.amount);
      }

      await this.repository.remove(transaction);
      res.send();
    } catch (err) {
      this.handleError(res, err);
    }
  };

}
