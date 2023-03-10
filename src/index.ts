import express, { Application, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cors from "cors";

const prisma = new PrismaClient();

const app: Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.get("/", async (req: Request, res: Response) => {
  return res.status(200).send({
    message: `server running at port: ${process.env.PORT} `,
  });
});

let router = express.Router();

app.post("/createUser", async (req: Request, res: Response) => {
  let { data } = req.body;
  try {
    const result = await prisma.users.create({
      data: data,
    });
    return res.status(201).send({
      message: `successfully created users ${JSON.stringify(result)}`,
    });
  } catch (error) {
    res.send(error);
  }
});

app.put("/putUserDetails/:name/:score", async (req: Request, res: Response) => {
  const { name, score } = req.params;

  try {
    const user_exists = await prisma.users.findUnique({
      where: { name: name },
    });
    if (user_exists) {
      if (Number(user_exists.total_score) < Number(score)) {
        await prisma.users.update({
          where: { name: name },
          data: { total_score: Number(score) },
        });
      }
    }
    return res.status(200).json({
      message: `successfully updated user details`,
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/getUserDetails", async (req: Request, res: Response) => {
  try {
    const result = await prisma.users.findMany({
      select: {
        name: true,
        total_score: true,
        updatedAt: true,
      },
      orderBy: [
        {
          total_score: "desc",
        },
      ],
    });
    return res.status(200).json({
      message: `successfully fetched user details`,
      data: result,
    });
  } catch (error) {
    res.send(error);
  }
});

try {
  app.listen(process.env.PORT, (): void => {
    console.log(`Connected successfully on port ${process.env.PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
