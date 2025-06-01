import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApartmentDto } from '../../../models';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApartmentServiceService {

  private apiUrl = `${environment.apiUrl}/apartments`;

  http = inject(HttpClient);

  getAll() {
    return this.http.get<ApartmentDto[]>(this.apiUrl);
  }

  getOne(id: number) {
    return this.http.get<ApartmentDto>(`${this.apiUrl}/${id}`);
  }

  createWithResident(apartmentDto: ApartmentDto, newResidentName: string) {
    const reqBody = {
      apartmentDetails: apartmentDto,
      newResidentName: newResidentName,
    }
    return this.http.post<ApartmentDto>(this.apiUrl, reqBody);
  }

  move(apartmentId: number, newResidentName: string, withCost: boolean) {
    const reqBody = {
      apartmentId: apartmentId,
      newResidentName: newResidentName,
      withCost: withCost
    }
    return this.http.put<ApartmentDto>(`${this.apiUrl}/move`, reqBody);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
