import { AppDataSource } from "./data-source"
import express from 'express';
import { router } from "./routes";

async function main() {
  await AppDataSource.initialize();

  const app = express();

  app.use(express.json());

  app.use('/api', router);

  app.listen(3000, () => {
    console.log('Server is listening on port 3000 ...')
  });
}

main().catch((error) => {
    console.error("Error during startup:", error);
});
