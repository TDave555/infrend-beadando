import { TransactionDto, TransactionType } from "../../../models";
import { AppDataSource } from "../data-source";
import { Apartment } from "../entity/Apartment";
import { Resident } from "../entity/Resident";
import { Transaction } from "../entity/Transaction";
import { Controller } from "./base.controller";

export class ResidentController extends Controller {
  repository = AppDataSource.getRepository(Resident);

  getOne = async (req, res) => {
    try {
      const id = req.params.id;
      const resident = await this.repository.findOne({
        where: { id: id }, relations: ["apartment", "transactions"]
      });

      if (!resident) {
        return this.handleError(res, null, 404, 'Entity not found.');
      }
      res.json(resident);
    } catch (err) {
      this.handleError(res, err);
    }
  };

    getAll = async (req, res) => {
      try {
        const residents: Resident[] = await this.repository.find({
          relations: ["apartment"],
        })
        res.json(residents)
      } catch (err) {
        this.handleError(res, err);
      }
    }

    getAllActive = async (req, res) => {
        try {
            const residents: Resident[] = await this.repository.find({
                where: { isActive: true }, relations: ["apartment"],
            });
            res.json(residents);
        } catch (err) {
            this.handleError(res, err);
        }
    };

}
