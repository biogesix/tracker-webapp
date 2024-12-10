import express, { Request, Response } from "express";
import categoryRouter from "./routes/categories";
import { pool } from "./db";
import userRouter from "./routes/users";
import cors from "cors";
import expenseRouter from "./routes/expense";
import savedCategoriesRouter from "./routes/savedCategories";
import weeklySummaryRouter from "./routes/weeklySummary";
import chartRouter from "./routes/charts";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
app.use(cors());
app.use("/expense", expenseRouter);
app.use("/category", categoryRouter);
app.use("/user", userRouter);
app.use("/expense", expenseRouter);
app.use("/savedCategories", savedCategoriesRouter);
app.use("/summary", weeklySummaryRouter);
app.use("/charts", chartRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello world!",
  });
});

app.listen(port, async () => {
  console.log("Listening to ", port);
  await pool.connect();
});
