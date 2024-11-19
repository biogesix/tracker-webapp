import express, { Request, Response } from "express";
import { pool } from "../db";
import Expense from "../types/Expense";

const expenseRouter = express.Router();

expenseRouter.put(":expense_id", async (req: Request, res: Response) => {
  try {
    const { expense_id } = req.params;
    const { name, price, quantity, total }: Expense = req.body;
    const data = await pool.query(
      'UPDATE "Expense" SET name = $1, price = $2, quantity = $3, total = $4 WHERE expense_id = $5 RETURNING *',
      [name, price, quantity, total, expense_id]
    );

    res.json({
      data: data.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

expenseRouter.delete(":expense_id", async (req: Request, res: Response) => {
  try {
    const { expense_id } = req.params;
    const data = await pool.query(
      'DELETE FROM "Expense" WHERE expense_id = $1 RETURNING *',
      [expense_id]
    );

    res.status(200).json({
      data: data.rows,
      message: "Successfully deleted expense",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

export default expenseRouter;
