import express, { Application, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app: Application = express();
app.use(express.json());

const PORT = 5000;

app.post("/create", async (req: Request, res: Response) => {
  let { data } = req.body;
  await prisma.users.createMany({
    data,
    skipDuplicates: true,
  });
  return res.status(200).send({
    message: "successfully created users",
  });
});

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
