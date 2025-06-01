import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResidentDto } from '../../../models';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ResidentServiceService {

  private apiUrl = `${environment.apiUrl}/residents`;

  http = inject(HttpClient);

  getAll() {
    return this.http.get<ResidentDto[]>(this.apiUrl);
  }

  getAllActive() {
    return this.http.get<ResidentDto[]>(`${this.apiUrl}/active`);
  }

  getOne(id: number) {
    return this.http.get<ResidentDto>(`${this.apiUrl}/${id}`);
  }
}
