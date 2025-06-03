import { AppDataSource } from "../data-source";
import { Apartment } from "../entity/Apartment";
import { Resident } from "../entity/Resident";
import { Controller } from "./base.controller";
import { ApartmentDto, createDefaultResident, ResidentDto, TransactionDto, TransactionType } from "../../../models";
import { Transaction } from "../entity/Transaction";

export class ApartmentController extends Controller {
  repository = AppDataSource.getRepository(Apartment);
  residentRepository = AppDataSource.getRepository(Resident);
  transactionRepository = AppDataSource.getRepository(Transaction);

  createWithResident = async(req, res) => {
    try {
      const { apartmentDetails, newResidentName } = req.body;

      const residentDto: ResidentDto = new createDefaultResident;
      residentDto.name = newResidentName;
      //const residentWoId: Omit<ResidentDto, "id"> = residentDto;
      const newResident = this.residentRepository.create(residentDto);
      delete newResident.id;
      const savedResident = await this.residentRepository.save(newResident);

      const apartmentDto: ApartmentDto = apartmentDetails;
      //onst apartmentWoId: Omit<ApartmentDto, "id"> = apartmentDto;
      const newApartment = this.repository.create(apartmentDto);
      newApartment.resident = savedResident;
      delete newApartment.id;
      const savedApartment = await this.repository.save(newApartment);


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

      const apartment = await this.repository.findOneBy({id: apartmentId});

      const oldResident = apartment.resident;
      oldResident.moveOutDate = new Date();
      oldResident.isActive = false;
      const savedOldResident = await this.residentRepository.save(oldResident);

      const residentDto: ResidentDto = new createDefaultResident();
      residentDto.name = newResidentName;
      //const residentWoId: Omit<ResidentDto, "id"> = residentDto;
      const newResident = this.residentRepository.create(residentDto);
      delete newResident.id;
      const savedNewResident = await this.residentRepository.save(newResident);

      apartment.resident = savedNewResident;
      const savedApartment = await this.repository.save(apartment);

      if (withCost === true) {
        const addCost = this.transactionRepository.create({
          type: TransactionType.COST,
          amount: savedOldResident.balance,
          date: new Date(),
           description: 'Költözés során átvállalt költségek.',
          resident: newResident
        });

        const removeCost = this.transactionRepository.create({
          type: TransactionType.COST,
          amount: savedOldResident.balance*(-1),
          date: new Date(),
          description: 'Költségek átvállalva az új lakó által.',
          resident: oldResident
        });

        newResident.balance = savedOldResident.balance;
        await this.residentRepository.save(newResident);
        oldResident.balance = 0;
        await this.residentRepository.save(oldResident);

        await this.transactionRepository.save(addCost);
        await this.transactionRepository.save(removeCost);
      }

      res.json(savedApartment)
    } catch (err) {
      this.handleError(res, err);
    }
  };

}
