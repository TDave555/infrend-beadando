  export interface ResidentDto {
    id: number;
    name: string
    balance: number;
    moveInDate: Date;
    moveOutDate?: Date;
    isActive: boolean;
  }

  export interface ApartmentDto {
    id:number;
    apartmentNumber: string;
    area: number;
    airVolume: number;
    resident: ResidentDto;
  }

  export interface TransactionDto {
    id: number;
    type: TransactionType;
    amount: number;
    date: Date;
    description: string;
    resident: ResidentDto;
    apartment?: ApartmentDto;
  }

  export enum TransactionType {
    COST,
    PAYMENT
  }

  export class createDefaultResident implements ResidentDto {
    id = 0;
    name = '';
    balance = 0;
    moveInDate = new Date();
    moveOutDate = undefined;
    isActive = true;
  }

  export class globalConstants {
    public static readonly apartmentNumbers: string[] = [
      '1/1', '102', '103', '104', '105'
    ]
  }
