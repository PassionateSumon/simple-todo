import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";

const prisma = new PrismaClient();
const app = express();
dotenv.config();
app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);

async function main() {
  app.get("/", (req, res): any => {
    return res.send("Helllo");
  });

  app.post("/signup", async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json("Invalid credentials!");
    }

    try {
      const existUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (existUser) {
        return res.status(400).json("User already exists!");
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: await bcrypt.hash(password, 10),
        },
      });

      return res.status(201).json({ message: "User created..", user: newUser });
    } catch (error) {
      return res.status(500).json("Internal server error!");
    }
  });

  app.post("/login", async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("Invalid credentials!");
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(400).json("Can't find user!");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json("Invalid password!");
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
        })
        .json({ message: "Login Successfully.", token });
    } catch (error) {
      return res.status(500).json("Internal server error!");
    }
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

app.listen(5000, () => {
  console.log(`Port listen on 5000`);
});
