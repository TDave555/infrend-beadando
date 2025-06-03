import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResidentService } from '../../services/resident.service';
import { ResidentDto } from '../../../../models';
import { TransactionService } from '../../services/transaction.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-resident-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resident-details.component.html',
  styleUrl: './resident-details.component.css'
})
export class ResidentDetailsComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  message: string = '';
  isError: boolean = false;
  detailsForm: FormGroup;
  resident: ResidentDto | null = null;
  residentId: number | null = null;
  loading: boolean = false;

  constructor(
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private residentService: ResidentService,
      private transactionService: TransactionService,
      private router: Router
  ) {
    this.detailsForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      balance: [null, [Validators.required, Validators.min(0)]],
      moveInDate: [null, [Validators.required]],
      moveOutDate: [null],
      apartment: [null],
    });
  }

  ngOnInit(): void {
    this.residentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.residentId) {
      this.loadResidentDetails(this.residentId);
    } else {
      this.showError('Hibás lakó azonosító.');
      this.router.navigate(['/residents']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadResidentDetails(id: number): void {
    this.loading = true;
    this.residentService.getOne(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (resident: ResidentDto) => {
        this.resident = resident;
        this.detailsForm.patchValue({
          id: resident.id,
          name: resident.name,
          balance: resident.balance,
          moveInDate: new Date(resident.moveInDate).toISOString().split('T')[0],
          moveOutDate: resident.moveOutDate ? new Date(resident.moveOutDate).toISOString().split('T')[0] : null,
          apartment: resident.apartment ? `${resident.apartment.apartmentNumber} (id: ${resident.apartment.id})` : ''
        });
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.showError(`Hiba történt a lakás adatainak betöltése során.\nHiba: ${err.status} - ${err.message}`);
      }
    });
  }

  onSubmit(): void {
    if (this.detailsForm.valid && this.resident) {
      this.resident.name = this.detailsForm.value.name;

      this.residentService.update(this.resident).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.showMessage('A lakó adatai sikeresen frissítve.');
          this.loadResidentDetails(this.resident!.id);
        },
        error: (err: HttpErrorResponse) => {
          this.showError(`Hiba történt a lakó adatainak frissítése során.\nHiba: ${err.status} - ${err.message}`);
        }
      });
    }
  }

  goBackToList(): void {
    this.router.navigate(['/residents']);
  }

  deleteTransaction(transactionId: number): void {
    if (window.confirm('Biztosan törölni szeretné a kiválasztott tranzakciót?')) {
      this.transactionService.delete(transactionId).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.showMessage('A tranzakció sikeresen törölve.');
          this.loadResidentDetails(this.resident!.id);
        },
        error: (err: HttpErrorResponse) => {
          this.showError(`Hiba történt a tranzakció törlése során.\nHiba: ${err.status} - ${err.message}`);
        }
      });
    }
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const dateString = new Date(date).toISOString().split('T')[0];
    return dateString;
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
