import { AppDataSource } from "./data-source"
import express from 'express';
import { router } from "./routes";
import { Apartment } from "./entity/Apartment";
import { Resident } from "./entity/Resident";
import { error } from "console";
import cors from "cors";

async function main() {
  await AppDataSource.initialize().then( async () => {
    const resident1 = new Resident();
    resident1.name = "Kiss János";
    resident1.balance = 0;
    resident1.isActive = true;
    resident1.moveInDate = new Date();

    const resident2 = new Resident();
    resident2.name = "Kovács Béla";
    resident2.balance = 0;
    resident2.isActive = true;
    resident2.moveInDate = new Date();

    const resident3 = new Resident();
    resident3.name = "Kerekes Zoltán";
    resident3.balance = 0;
    resident3.isActive = true;
    resident3.moveInDate = new Date();

    const apartment1 = new Apartment();
    apartment1.apartmentNumber = "földszint 1. ajtó";
    apartment1.area = 50;
    apartment1.airVolume = 100;
    apartment1.resident = resident1;
    const apartment2 = new Apartment();

    apartment2.apartmentNumber = "földszint 2. ajtó";
    apartment2.area = 50;
    apartment2.airVolume = 100;
    apartment2.resident = resident2;
    const apartment3 = new Apartment();

    apartment3.apartmentNumber = "földszint 3. ajtó";
    apartment3.area = 50;
    apartment3.airVolume = 100;
    apartment3.resident = resident3;

    await AppDataSource.manager.save(apartment1);
    await AppDataSource.manager.save(apartment2);
    await AppDataSource.manager.save(apartment3);
    console.log("Apartments and Residents have been initialized!");

    console.log("Data Source has been initialized!");
  }).catch (error => {
    console.error("Error during Data Source initialization:", error);
    AppDataSource.destroy();
  });

  const app = express();

  app.use(express.json());

  app.use(cors({ origin: "http://localhost:4200" }));

  app.use('/api', router);

  app.listen(3000, () => {
    console.log('Server is listening on port 3000 ...')
  });

}

main().catch((error) => {
    console.error("Error during startup:", error);
});
