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
  try {
    const result = await prisma.users.create({
      data: data,
    });
    return res.status(200).send({
      message: `successfully created users ${JSON.stringify(result)}`,
    });
  } catch (error) {
    res.send(error);
  }
});

app.put("/putUserDetails/:id/:score", async (req: Request, res: Response) => {
  const { id, score } = req.params;
  try {
    await prisma.users.update({
      where: { id: Number(id) },
      data: { total_score: Number(score) },
    });
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
        id: true,
        name: true,
        total_score: true,
        updatedAt: true,
      },
    });
    return res.status(200).json({
      message: `successfully fetched user details`,
      data: result,
    });
  } catch (error) {
    res.send(error);
  }
});
// app.get("/getUsers", async (req: Request, res: Response) => {
//   const data = await prisma.users.findMany({
//     select: {
//       name: true,
//       profile: {
//         select: {
//           bio: true,
//         },
//       },
//     },
//   });
//   return res.status(200).send({
//     message: data,
//   });
// });

try {
  app.listen(process.env.PORT, (): void => {
    console.log(`Connected successfully on port ${process.env.PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
