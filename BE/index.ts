import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const prisma = new PrismaClient();
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);

interface extendRequest extends Request {
  userId?: string;
}

const authMiddleware = async (
  req: extendRequest,
  res: Response,
  next: () => void
): Promise<any> => {
  try {
    // const token = req.headers.authorization as string;
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json("Unauthorized!");
    }
    const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (!id) {
      return res.status(401).json("token doesn't match!");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(401).json("Can't find user!");
    }
    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(500).json("Internal middleware error!");
  }
};

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

  app.post(
    "/create-todo",
    authMiddleware,
    async (req: extendRequest, res: Response): Promise<any> => {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json("Title is required!");
      }
      try {
        const newPost = await prisma.todo.create({
          data: {
            title: title as string,
            description: description as string,
            userId: req.userId as string,
          },
        });
        return res
          .status(201)
          .json({ message: "Post created..", post: newPost });
      } catch (error) {
        return res.status(500).json("Internal server error!");
      }
    }
  );

  app.get(
    "/get-todos",
    authMiddleware,
    async (req: extendRequest, res: Response): Promise<any> => {
      try {
        const id = req.userId;
        const todos = await prisma.todo.findMany({
          where: {
            userId: id,
          },
        });

        if (!todos) {
          return res.status(400).json("No todos found!");
        }

        return res.status(200).json(todos);
      } catch (error) {
        return res.status(500).json("Internal server error to get!!");
      }
    }
  );

  app.put(
    "/edit-todo/:t_id",
    authMiddleware,
    async (req: extendRequest, res: Response): Promise<any> => {
      try {
        const { t_id } = req.params;
        if (!t_id) {
          return res.status(400).json("Todo id is required!");
        }
        const { title, description, isDone } = req.body;
        if (!title && !description && !isDone) {
          return res.status(400).json("At least one update is required!");
        }

        const todo = await prisma.todo.findUnique({
          where: { id: t_id },
        });
        if (!todo) {
          return res.status(400).json("No todo found!");
        }

        const updatedTodo = await prisma.todo.update({
          where: { id: t_id },
          data: {
            title,
            description,
            isDone,
          },
        });

        return res.status(200).json(updatedTodo);
      } catch (error) {
        return res.status(500).json("Internal server error to edit!!");
      }
    }
  );

  app.delete(
    "/delete-todo/:t_id",
    authMiddleware,
    async (req: extendRequest, res: Response): Promise<any> => {
      try {
        const { t_id } = req.params;
        if (!t_id) {
          return res.status(400).json("Todo id is required!");
        }
        const findTodo = await prisma.todo.findUnique({
          where: {
            id: t_id,
          },
        });
        if (!findTodo) {
          return res.status(400).json("No todo found!");
        }
        await prisma.todo.delete({
          where: {
            id: t_id,
          },
        });
        return res.status(200).json("Successfully deleted!");
      } catch (error) {
        return res.status(500).json("Internal server error to delete!!");
      }
    }
  );
}

main().catch((e) => console.error(e));

process.on("exit", async () => {
  await prisma.$disconnect();
  console.log("Prisma disconnected!");
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisma disconnected!");
  process.exit(0);
});

app.listen(5000, () => {
  console.log(`Port listen on 5000`);
});
