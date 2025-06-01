import { basename } from "path";
import { createDefaultResident, TransactionDto, TransactionType } from "../../../models";
import { AppDataSource } from "../data-source";
import { Apartment } from "../entity/Apartment";
import { Resident } from "../entity/Resident";
import { Transaction } from "../entity/Transaction";
import { Controller } from "./base.controller";

export class TransactionController extends Controller {
  transactionRepository = AppDataSource.getRepository(Transaction);
  residentRepository = AppDataSource.getRepository(Resident);
  apartmentRepository = AppDataSource.getRepository(Apartment);

  getTransactionsOfResident = async (req, res) => {
    try {
      const residentId = req.params.residentId;
      const transactions: Transaction[] = await this.transactionRepository.find({
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

  payCost = async (req, res) => {
    try {
      const transactionDto = req.body as TransactionDto;

      const residentDto = transactionDto.resident
      const resident = await this.residentRepository.findOneBy({id: residentDto.id})
      resident.balance = resident.balance - transactionDto.amount
      const updatedResident = await this.residentRepository.save(resident);

      const transactionWoId: Omit<TransactionDto, "id"> = transactionDto;
      const transaction = this.transactionRepository.create(transactionWoId);
      transaction.type = TransactionType.PAYMENT;
      transaction.date = new Date();
      transaction.resident = updatedResident;
      const savedTransaction = await this.transactionRepository.save(transaction);

      res.json(updatedResident)
    } catch (err) {
      this.handleError(res, err);
    }
  }

  multiplyCostByArea = async (req, res) => {
    try {
      const transactionDto = req.body as TransactionDto;

      const apartments = await this.apartmentRepository.find();

      const transactionWoId: Omit<TransactionDto, "id"> = transactionDto;
      const transactions: Transaction[] = [];
      const residents: Resident[] = [];

      apartments.forEach(apartment => {

        transactionWoId.amount = apartment.area * transactionWoId.amount;
        transactionWoId.apartment = apartment;
        transactionWoId.resident = apartment.resident;

        let resident = apartment.resident;
        resident.balance = resident.balance + transactionWoId.amount;
        residents.push(resident);

        transactions.push(this.transactionRepository.create(transactionWoId));
      });

      await this.residentRepository.save(residents);
      const createdTransactions = await this.transactionRepository.save(transactions);
      req.json(createdTransactions);
    } catch (err) {
      this.handleError(res, err);
    }
  }

  divideCostByArea = async (req, res) => {
    try {
      const transactionDto = req.body as TransactionDto;

      const apartments = await this.apartmentRepository.find();

      const transactionWoId: Omit<TransactionDto, "id"> = transactionDto;
      const transactions: Transaction[] = [];
      const residents: Resident[] = []

      let areaSum: number = 0;

      apartments.forEach(apartment => {
        areaSum = areaSum + apartment.area
      });

      const amountForSqrm = transactionWoId.amount/areaSum;

      apartments.forEach(apartment => {

        transactionWoId.amount = amountForSqrm * apartment.area;
        transactionWoId.apartment = apartment;
        transactionWoId.resident = apartment.resident;

        let resident = apartment.resident;
        resident.balance = resident.balance + transactionWoId.amount;
        residents.push(resident);

        transactions.push(this.transactionRepository.create(transactionWoId));
      });

      await this.residentRepository.save(residents);
      const createdTransactions = await this.transactionRepository.save(transactions);
      req.json(createdTransactions);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  delete = async (req, res) => {
    try {
      const id = req.params.id;
      const transaction = await this.transactionRepository.findOne({
        where: {id: id}, relations: ["resident"]
      });

      if (!transaction) {
        return this.handleError(res, null, 404, 'Entity not found.');
      }

      const resident = transaction.resident

      if (transaction.type = TransactionType.COST) {
        resident.balance = resident.balance - transaction.amount;
      } else if (transaction.type = TransactionType.PAYMENT) {
        resident.balance = resident.balance + transaction.amount;
      }

      await this.transactionRepository.remove(transaction);
      res.send();
    } catch (err) {
      this.handleError(res, err);
    }
  };

}
