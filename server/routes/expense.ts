import express, { Request, Response } from "express";
import { pool } from "../db";
import { Expense } from "../utils/types";
import recalculateCategoryExpenses from "../utils/recalculateCategoryExpenses";
import recalculatedWeekCategories from "../utils/recalculateWeekSummaryWithExpenses";

const expenseRouter = express.Router();

expenseRouter.post("", async (req: Request, res: Response) => {
  try {
    const { expense_name, price, quantity, total, category_id, date }: Expense =
      req.body;

    console.log("date: ", date);

    if (!category_id) {
      throw Error("Category ID is required.");
    }
    const budget = await pool.query(
      'SELECT amount_left FROM "Category" WHERE category_id= $1',
      [category_id]
    );

    const remainingBudget = budget.rows[0].amount_left;

    if (total > remainingBudget) {
      throw Error("Total exceeds remaining budget.");
    }

    const result = await pool.query(
      `INSERT INTO "Expense" (expense_name, price, quantity, total, category_id, date) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [expense_name, price, quantity, total, category_id, date]
    );
    await recalculateCategoryExpenses({
      pool,
      category_id,
    });

    await recalculatedWeekCategories({
      pool,
      category_id,
    });

    res.status(200).json({
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

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
    const { expense_name, price, quantity, total, category_id, date }: Expense =
      req.body;

    console.log("date: ", date);

    const data = await pool.query(
      `UPDATE "Expense" SET expense_name = $1, price = $2, quantity = $3, total = $4, date = $5 WHERE expense_id = $6 RETURNING *`,
      [expense_name, price, quantity, total, date, id]
    );

    if (!category_id) {
      throw Error("Category ID is required.");
    }

    await recalculateCategoryExpenses({
      pool,
      category_id,
    });

    await recalculatedWeekCategories({
      pool,
      category_id,
    });

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

expenseRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedExpenseResult = await pool.query(
      'DELETE from "Expense" WHERE expense_id = $1 RETURNING *',
      [id]
    );

    const { category_id } = deletedExpenseResult.rows[0] as Expense;

    if (!category_id) {
      throw Error("Category ID is required.");
    }

    await recalculateCategoryExpenses({
      pool,
      category_id,
    });

    await recalculatedWeekCategories({
      pool,
      category_id,
    });

    res.status(200).json({
      data: deletedExpenseResult.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

export default expenseRouter;
