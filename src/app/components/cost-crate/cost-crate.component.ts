import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apartment } from '../../../../backend/src/entity/Apartment';
import { ApartmentDto, createDefaultResident, TransactionDto, TransactionType } from '../../../../models';
import { TransactionService } from '../../services/transaction.service';
import { ApartmentService } from '../../services/apartment.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cost-crate',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './cost-crate.component.html',
  styleUrl: './cost-crate.component.css'
})
export class CostCrateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  message: string = '';
  isError: boolean = false;
  creationForm: FormGroup;
  createdTransactions: TransactionDto[] = [];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router
  ) {
    this.creationForm = this.fb.group({
      costType: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(1)]],
      description: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.creationForm.valid) {
      const transaction: TransactionDto = {
        id: 0,
        type: TransactionType.COST,
        amount: this.creationForm.value.amount,
        date: new Date(),
        description: this.creationForm.value.description,
        resident: new createDefaultResident()
      }
      const costType = this.creationForm.value.costType;
      if (costType === 'divided') {
        this.transactionService.createDividedCost(transaction).pipe(takeUntil(this.destroy$)).subscribe({
          next: (transactions: TransactionDto[]) => {
            this.showMessage('A költségek sikeresen rögzítve.');
            this.creationForm.reset();
            this.createdTransactions = transactions;
          },
          error: (err: HttpErrorResponse) => {
            this.showError(`Hiba a költségek rögzítése közben.\nHiba: ${err.status} - ${err.message}`);
          }
        });
      } else if (costType === 'multiplied') {
        this.transactionService.createMultipliedCost(transaction).pipe(takeUntil(this.destroy$)).subscribe({
          next: (transactions: TransactionDto[]) => {
            this.showMessage('A költségek sikeresen rögzítve.');
            this.creationForm.reset();
            this.createdTransactions = transactions;
          },
          error: (err: HttpErrorResponse) => {
            this.showError(`Hiba a költségek rögzítése közben.\nHiba: ${err.status} - ${err.message}`);
          }
        });
      }
    }
  }

  private showMessage(msg: string): void {
    this.message = msg;
    this.isError = false;
    setTimeout(() => this.message = '', 3000);
  }

  private showError(msg: string): void {
    this.message = msg;
    this.isError = true;
    setTimeout(() => this.message = '', 3000);
  }
}
