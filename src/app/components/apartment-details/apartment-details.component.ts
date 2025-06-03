import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApartmentService } from '../../services/apartment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApartmentDto, globalConstants } from '../../../../models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-apartment-details',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './apartment-details.component.html',
  styleUrl: './apartment-details.component.css'
})
export class ApartmentDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    message: string = '';
    isError: boolean = false;
    detailsForm: FormGroup;
    apartment: ApartmentDto | null = null;
    existingApartmentNumbers: string[] = [];
    freeApartmentNumbers: string[] = [];

  constructor(
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private apartmentService: ApartmentService,
      private router: Router
  ) {
    this.detailsForm = this.fb.group({
      id: [0],
      apartmentNumber: [null, [, Validators.required, Validators.maxLength(25)]],
      area: [null, [Number, Validators.required, Validators.min(20.0), Validators.max(50.0)]],
      airVolume: [null, [Validators.required, Validators.min(50.0), Validators.max(150.0)]],
      resident: [null],
    });
  }

  ngOnInit(): void {
    const apartmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (apartmentId) {
      this.loadApartmentDetails(apartmentId);
    } else {
      this.showError('Hibás lakás azonosító.');
      this.router.navigate(['/apartments']);
    }

    this.getFreeApartmentNumbers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadApartmentDetails(id: number): void {
    this.apartmentService.getOne(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (apartment: ApartmentDto) => {
        this.apartment = apartment;
        this.detailsForm.patchValue({
          id: apartment.id,
          apartmentNumber: apartment.apartmentNumber,
          area: apartment.area,
          airVolume: apartment.airVolume,
          resident: `${apartment.resident.name} (id: ${apartment.resident.id})`
        });
      },
      error: (err: HttpErrorResponse) => {
        this.showError(`Hiba történt a lakás adatainak betöltése során.\nHiba: ${err.status} - ${err.message}`);
      }
    });
  }

    getFreeApartmentNumbers(): void {
    this.apartmentService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (apartments: ApartmentDto[]) => {
        this.existingApartmentNumbers = apartments.map(apartment => apartment.apartmentNumber);
      },
      error: (err: HttpErrorResponse) => {
          this.showError(`Váratlan hiba.\nHiba: ${err.status} - ${err.message}`);
      }
    });
    globalConstants.apartmentNumbers.forEach(apartmentNumber => {
      if (!this.existingApartmentNumbers.includes(apartmentNumber)) {
        this.freeApartmentNumbers.push(apartmentNumber);
      }
    });
  }

  onSubmit(): void {
    if (this.detailsForm.valid && this.apartment) {
      this.apartment.apartmentNumber = this.detailsForm.value.apartmentNumber;
      this.apartment.area = this.detailsForm.value.area;
      this.apartment.airVolume = this.detailsForm.value.airVolume;
      this.apartmentService.update(this.apartment).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.showMessage(`A lakás adatai sikeresen frissítve.`);
          this.loadApartmentDetails(this.apartment!.id);
          this.freeApartmentNumbers.length = 0;
          this.existingApartmentNumbers.length = 0;
          this.getFreeApartmentNumbers();
        },
        error: (err: HttpErrorResponse) => {
          this.showError(`Hiba történt a lakás adatainak frissítése során.\nHiba: ${err.status} - ${err.message}`);
        }
      });
    }
  }

  goBackToList(): void {
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
