import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApartmentService } from '../../services/apartment.service';
import { ApartmentDto } from '../../../../models';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-apartment-move',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './apartment-move.component.html',
  styleUrl: './apartment-move.component.css'
})
export class ApartmentMoveComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  message: string = '';
  isError: boolean = false;
  moveForm: FormGroup;
  apartments: ApartmentDto[] = [];
  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService,
    private router: Router
  ) {
    this.moveForm = this.fb.group({
      apartmentId: [null, [Validators.required]],
      newResidentName: [null, [Validators.required]],
      withCost: [false, []]
    });
  }

  ngOnInit(): void {
      this.loadApartments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadApartments(): void {
    this.apartmentService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (apartments: ApartmentDto[]) => {
        this.apartments = apartments;
      },
      error: (err: HttpErrorResponse) => {
        this.showError(`Váratlan hiba.\nHiba: ${err.status} - ${err.message}`);
      }
    });
  }

  onCancel(): void {
    //this.router.navigate(['/apartments']);
  }

  onSubmit(): void {
    if (this.moveForm.valid) {
      const moveData = this.moveForm.value;
      this.apartmentService.move(moveData.apartmentId, moveData.newResidentName, moveData.withCost)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (apartment: ApartmentDto) => {
          this.showMessage(`Sikeres költöztetés! A(z) ${apartment.apartmentNumber}
            lakás új lakója: ${apartment.resident.name} (id: ${apartment.resident.id}),
            költségek átvállalva: ${moveData.withCost ? 'igen' : 'nem'}.`);
          //this.router.navigate(['/apartments', apartment.id]);
        },
        error: (err: HttpErrorResponse) => {
          this.showError(`Váratlan hiba.\nHiba: ${err.status} - ${err.message}`);
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
