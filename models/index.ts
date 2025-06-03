  export interface ResidentDto {
    id: number;
    name: string
    balance: number;
    moveInDate: Date;
    moveOutDate?: Date;
    isActive: boolean;
    apartment?: ApartmentDto;
    transactions?: TransactionDto[];
  }

  export interface ApartmentDto {
    id:number;
    apartmentNumber: string;
    area: number;
    airVolume: number;
    resident: ResidentDto;
    transactions?: TransactionDto[];
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
      'földszint 1. ajtó',
      'földszint 2. ajtó',
      'földszint 3. ajtó',
      '1. emelet 1. ajtó',
      '1. emelet 2. ajtó',
      '1. emelet 3. ajtó',
      '2. emelet 1. ajtó',
      '2. emelet 2. ajtó',
      '2. emelet 3. ajtó',
      '3. emelet 1. ajtó',
      '3. emelet 2. ajtó',
      '3. emelet 3. ajtó',
      '4. emelet 1. ajtó',
      '4. emelet 2. ajtó',
      '4. emelet 3. ajtó',
    ]
  }
