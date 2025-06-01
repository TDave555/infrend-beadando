import { TransactionDto, TransactionType } from "../../../models";
import { AppDataSource } from "../data-source";
import { Apartment } from "../entity/Apartment";
import { Resident } from "../entity/Resident";
import { Transaction } from "../entity/Transaction";
import { Controller } from "./base.controller";

export class ResidentController extends Controller {
  residentRepository = AppDataSource.getRepository(Resident);

    getAll = async (req, res) => {
      try {
        const residents: Resident[] = await this.residentRepository.find({
          relations: ["apartment"],
        })
        res.json(residents)
      } catch (err) {
        this.handleError(res, err);
      }
    }


    getAllActive = async (req, res) => {
        try {
            const residents: Resident[] = await this.residentRepository.find({
                where: { isActive: true }, relations: ["apartment"],
            });
            res.json(residents);
        } catch (err) {
            this.handleError(res, err);
        }
    };

}
