import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApartmentDto } from '../../../../models';
import { ApartmentService } from '../../services/apartment.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-apartment-list',
  imports: [ CommonModule],
  templateUrl: './apartment-list.component.html',
  styleUrl: './apartment-list.component.css'
})
export class ApartmentListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  message: string = '';
  isError: boolean = false;
  apartments: ApartmentDto[] = [];

  constructor(private apartmentService: ApartmentService, private router: Router) { }

  ngOnInit(): void {
    this.getAllApartments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllApartments(): void {
    this.apartmentService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (apartments: ApartmentDto[]) => {
        this.apartments = apartments.sort((a, b) => b.id - a.id);
      },
      error: (err: HttpErrorResponse) => {
        this.showError(`Váratlan hiba.\nHiba: ${err.status} - ${err.message}`);
      }
    });
  }

  goToCreate(): void {
    this.router.navigate(['/apartments/create']);
  }

  goToMove() {
    this.router.navigate(['/move']);
  }

  goToDetails(id: number): void {
    this.router.navigate(['/apartments', id]);
  }

  goToResident(residentId: number): void {
    this.router.navigate(['/residents', residentId]);
  }

  /*deleteApartment(id: number): void {
    const confirmed = window.confirm(`Biztosan törölni szeretné a(z) ${id} azonosítójú lakást?`);
    if (!confirmed) {
      return;
    }
    this.apartmentService.delete(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.showMessage(`${id} azonosítójú lakás sikeresen törölve.`);
        this.getAllApartments();
      },
      error: (err: HttpErrorResponse) => {
        this.showError(`Hiba a törlés közben.\nHiba: ${err.status} - ${err.message}`);
      }
    });
  }*/

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
