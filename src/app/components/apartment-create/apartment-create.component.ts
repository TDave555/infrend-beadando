import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApartmentDto, createDefaultResident, globalConstants } from '../../../../models';
import { ApartmentService } from '../../services/apartment.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-apartment-create',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './apartment-create.component.html',
  styleUrl: './apartment-create.component.css'
})
export class ApartmentCreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  message: string = '';
  isError: boolean = false;
  creationForm: FormGroup;
  existingApartmentNumbers: string[] = [];
  freeApartmentNumbers: string[] = [];

  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService,
    private router: Router
  ) {
    this.creationForm = this.fb.group({
      apartmentNumber: [null, [, Validators.required, Validators.maxLength(25)]],
      area: [null, [Number, Validators.required, Validators.min(20.0), Validators.max(50.0)]],
      airVolume: [null, [Validators.required, Validators.min(50.0), Validators.max(150.0)]],
      residentName: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getFreeApartmentNumbers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFreeApartmentNumbers(): void {
    this.apartmentService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (apartments: ApartmentDto[]) => {
        this.existingApartmentNumbers = apartments.map(apartment => apartment.apartmentNumber);

        globalConstants.apartmentNumbers.forEach(apartmentNumber => {
        if (!this.existingApartmentNumbers.includes(apartmentNumber)) {
          this.freeApartmentNumbers.push(apartmentNumber);
        }
    });

      },
      error: (err: HttpErrorResponse) => {
          this.showError(`Váratlan hiba.\nHiba: ${err.status} - ${err.message}`);
      }
    });
  }

  onSubmit(): void {
    if (this.creationForm.valid) {
      const apartment: ApartmentDto = {
        id: 0,
        apartmentNumber: this.creationForm.value.apartmentNumber,
        area: this.creationForm.value.area,
        airVolume: this.creationForm.value.airVolume,
        resident: new createDefaultResident
      };
      const newResidentName = this.creationForm.value.residentName;
      this.apartmentService.createWithResident(apartment, newResidentName).pipe(takeUntil(this.destroy$)).subscribe({
        next: (createdApartment: ApartmentDto) => {
          this.showMessage(`Lakás ${createdApartment.apartmentNumber} sikeresen létrehozva, id: ${createdApartment.id}`);
          this.freeApartmentNumbers.length = 0;
          this.existingApartmentNumbers.length = 0;
          this.getFreeApartmentNumbers();
          this.creationForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.showError(`Hiba történt az apartman létrehozása során.\nHiba: ${err.status} - ${err.message}`);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/apartments']);
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
