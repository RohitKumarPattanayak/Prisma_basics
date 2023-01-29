import express, { Application, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";

const prisma = new PrismaClient();

const app: Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  return res.status(200).send({
    message: `server running at port: ${process.env.PORT} `,
  });
});

let router = express.Router();

app.post("/createUser", async (req: Request, res: Response) => {
  let { data } = req.body;
  console.log(JSON.stringify(data));
  await prisma.users.create({
    data,
    include: {
      profile: true,
    },
  });
  return res.status(200).send({
    message: "successfully created users",
  });
});
app.get("/getUsers", async (req: Request, res: Response) => {
  const data = await prisma.users.findMany({
    select: {
      name: true,
      profile: {
        select: {
          bio: true,
        },
      },
    },
  });
  return res.status(200).send({
    message: data,
  });
});

try {
  app.listen(process.env.PORT, (): void => {
    console.log(`Connected successfully on port ${process.env.PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
