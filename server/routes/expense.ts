import express, { Request, Response } from "express";
import { pool } from "../db";
import Expense from "../types/Expense";

const expenseRouter = express.Router();

expenseRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await pool.query(
      'SELECT * from "Expense" WHERE expense_id = $1',
      [id]
    );

    res.status(200).json({
      data: data.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

expenseRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { expense_name, price, quantity, total }: Expense = req.body;

    const data = await pool.query(
      'UPDATE "Expense" SET expense_name = $1, price = $2, quantity = $3, total = $4 WHERE expense_id = $5 RETURNING *',
      [expense_name, price, quantity, total, id]
    );

    res.status(200).json({
      data: data.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

export default expenseRouter;