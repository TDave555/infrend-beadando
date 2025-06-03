import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResidentService } from '../../services/resident.service';
import { createDefaultResident, ResidentDto, TransactionDto, TransactionType } from '../../../../models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payment-create',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './payment-create.component.html',
  styleUrl: './payment-create.component.css'
})
export class PaymentCreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  message: string = '';
  isError: boolean = false;
  creationForm: FormGroup;
  residents: ResidentDto[] = [];
  createdTransaction: TransactionDto | null = null;


  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private residentService: ResidentService,
    private router: Router
  ) {
    this.creationForm = this.fb.group({
      resident: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(1)]],
      description: [null, [Validators.required]]
    });

  }

  ngOnInit(): void {
    this.loadResidents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadResidents(): void {
    this.residentService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (residents: ResidentDto[]) => {
        this.residents = residents.filter(resident => resident.balance > 0);
      },
      error: (err: HttpErrorResponse) => {
        this.showError(`Hiba a lakók betöltése közben. Hiba: ${err.status} - ${err.message}`);
      }
    });
  }

  onSubmit(): void {
    if (this.creationForm.valid) {
      const transaction: TransactionDto = {
        id: 0,
        type: TransactionType.PAYMENT,
        amount: this.creationForm.value.amount,
        date: new Date(),
        description: this.creationForm.value.description,
        resident: new createDefaultResident()
      }
      transaction.resident.id = this.creationForm.value.resident;

      this.transactionService.createPayment(transaction).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdTransaction: TransactionDto) => {
          this.showMessage(`Befizetés sikeresen létrehozva (id: ${createdTransaction.id})`);
          this.creationForm.reset();
          this.createdTransaction = createdTransaction;
        },
        error: (err: HttpErrorResponse) => {
          this.showError(`Hiba a tranzakció létrehozása közben. Hiba: ${err.status} - ${err.message}`);
        }
      });
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
