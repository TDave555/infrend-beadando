import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ResidentDto } from '../../../../models';
import { ResidentService } from '../../services/resident.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-resident-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './resident-list.component.html',
  styleUrl: './resident-list.component.css'
})
export class ResidentListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  message: string = '';
  isError: boolean = false;
  residents: ResidentDto[] = [];
  listAll: boolean = true;

  constructor(private residentService: ResidentService, private router: Router) { }

  ngOnInit(): void {
    this.loadResidents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadResidents(): void {
    if (this.listAll) {
      this.getAllResidents();
    } else {
      this.getAllActiveResidents();
    }
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const dateString = new Date(date).toISOString().split('T')[0];
    return dateString;
  }

  getAllResidents(): void {
    this.residentService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (residents: ResidentDto[]) => {
        this.residents = residents.sort((a, b) => b.id - a.id);
      },
      error: (err: HttpErrorResponse) => {
        this.showError(`Váratlan hiba.\nHiba: ${err.status} - ${err.message}`);
      }
    });
  }

  getAllActiveResidents(): void {
    this.residentService.getAllActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: (residents: ResidentDto[]) => {
        this.residents = residents.sort((a, b) => b.id - a.id);
      },
      error: (err: HttpErrorResponse) => {
        this.showError(`Váratlan hiba.\nHiba: ${err.status} - ${err.message}`);
      }
    });
  }

  goToMove(): void {
    this.router.navigate(['/move']);
  }

  goToDetails(id: number): void {
    this.router.navigate(['/residents', id]);
  }

  goToApartment(apartmentId: number): void {
    this.router.navigate(['/apartments', apartmentId]);
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
