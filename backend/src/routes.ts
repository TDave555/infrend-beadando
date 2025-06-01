import express from 'express';
import { ResidentController } from './controller/resident.controller';
import { TransactionController } from './controller/transaction.controller';
import { ApartmentController } from './controller/apartment.controller';

export const router = express.Router();

const residentController = new ResidentController();
router.get('/residents', residentController.getAll);
router.get('/residents/active', residentController.getAllActive);
router.get('/residents/:id', residentController.getOne);

const apartmentController = new ApartmentController();
router.get('/apartments', apartmentController.getAll);
router.get('/apartments/:id', apartmentController.getOne);
router.post('/apartments', apartmentController.createWithResident);
router.put('/apartments/move', apartmentController.move);
router.delete('/apartments/:id', apartmentController.delete);

const transactionController = new TransactionController();
router.get('/transactions/resident/:residentId', transactionController.getTransactionsOfResident);
router.get('/transactions/:id', transactionController.getOne);
router.post('/transactions/payment', transactionController.payCost);
router.post('/transactions/multiplied-cost', transactionController.multiplyCostByArea);
router.post('/transactions/divided-cost', transactionController.divideCostByArea);
router.delete('/transactions/:id', transactionController.delete);
