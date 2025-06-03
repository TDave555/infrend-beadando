import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TransactionDto } from '../../../models';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = `${environment.apiUrl}/transactions`;

  http = inject(HttpClient);

  getTransactionsOfResident(residentId: number) {
    return this.http.get<TransactionDto[]>(`${this.apiUrl}/resident/${residentId}`);
  }

  getOne(id: number) {
    return this.http.get<TransactionDto>(`${this.apiUrl}/${id}`);
  }

  createPayment(transactionDto: TransactionDto) {
    return this.http.post<TransactionDto>(`${this.apiUrl}/payment`, transactionDto);
  }

  createMultipliedCost(transactionDto: TransactionDto) {
    return this.http.post<TransactionDto[]>(`${this.apiUrl}/multiplied-cost`, transactionDto);
  }

  createDividedCost(transactionDto: TransactionDto) {
    return this.http.post<TransactionDto[]>(`${this.apiUrl}/divided-cost`, transactionDto);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
