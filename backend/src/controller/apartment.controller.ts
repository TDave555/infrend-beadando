import { AppDataSource } from "../data-source";
import { Apartment } from "../entity/Apartment";
import { Resident } from "../entity/Resident";
import { Controller } from "./base.controller";
import { ApartmentDto, createDefaultResident, ResidentDto, TransactionDto, TransactionType } from "../../../models";
import { Transaction } from "../entity/Transaction";

export class ApartmentController extends Controller {
  apartmentRepository = AppDataSource.getRepository(Apartment);
  residentRepository = AppDataSource.getRepository(Resident);
  transactionRepository = AppDataSource.getRepository(Transaction);

  createWithResident = async(req, res) => {
    try {
      const { apartmentDetails, newResidentName } = req.body;
      const apartmentDto: ApartmentDto = apartmentDetails

      const residentDto: ResidentDto = new createDefaultResident;
      residentDto.name = newResidentName;
      const residentWoId: Omit<ResidentDto, "id"> = residentDto;
      const newResident = this.residentRepository.create(residentDto);

      const newApartment = this.apartmentRepository.create(apartmentDto);
      newApartment.resident = newResident;
      const savedApartment = await this.apartmentRepository.save(newApartment);


      res.json(savedApartment);
    } catch(err) {
      this.handleError(res, err);
    }
  };

  move = async (req, res) => {
    try {
      const { apartmentId, newResidentName, withCost} = req.body;

      if (!apartmentId || !newResidentName) {
        return this.handleError(res, null, 400, "Missing information");
      }

      const apartment = await this.apartmentRepository.findOneBy({id: apartmentId});

      const oldResident = apartment.resident;
      oldResident.moveOutDate = new Date();
      oldResident.isActive = false;
      const savedOldResident = await this.residentRepository.save(oldResident);

      const residentDto: ResidentDto = new createDefaultResident();
      residentDto.name = newResidentName;
      const residentWoId: Omit<ResidentDto, "id"> = residentDto;
      const newResident = this.residentRepository.create(residentWoId);
      const savedNewResident = await this.residentRepository.save(newResident);

      apartment.resident = savedNewResident;
      const savedApartment = await this.apartmentRepository.save(apartment);

      if (withCost) {
        const addCost = this.transactionRepository.create({
          type: TransactionType.COST,
          amount: savedOldResident.balance,
          date: new Date(),
          description: 'Cost transfered from previous rersident.',
          resident: newResident
        });

        const removeCost = this.transactionRepository.create({
          type: TransactionType.COST,
          amount: savedOldResident.balance*(-1),
          date: new Date(),
          description: 'Cost transfered to new rersident.',
          resident: oldResident
        });

        await this.transactionRepository.save(addCost);
        await this.transactionRepository.save(removeCost);
      }

      res.json(savedApartment)
    } catch (err) {
      this.handleError(res, err);
    }
  };

}
