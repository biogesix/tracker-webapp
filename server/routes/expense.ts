import express, { Request, Response } from "express";
import { pool } from "../db";
import { Category, Expense } from "../utils/types";
import recalculateCategoryExpenses from "../utils/recalculateCategoryExpenses";
import recalculateSavedCategoryExpenses from "../utils/recalculateWeekSummaryWithSavedCategory";
import recalculateWeekSummaryWithCategory from "../utils/recalculateWeekSummaryWithCategory";
import recalculateWeekSummaryWithSavedCategory from "../utils/recalculateWeekSummaryWithSavedCategory";

const expenseRouter = express.Router();

expenseRouter.post("", async (req: Request, res: Response) => {
  try {
    const {
      expense_name,
      price,
      quantity,
      total,
      category_id,
      date,
      saved_category_id,
    } = req.body as Expense;

    console.log("date: ", date);

    if (!category_id && !saved_category_id) {
      throw Error("Category is required.");
    }
    if (category_id) {
      const budget = await pool.query<Category>(
        `SELECT amount_left FROM "Category" WHERE category_id= $1`,
        [category_id]
      );

      const remainingBudget = budget.rows[0].amount_left;

      if (total > remainingBudget) {
        throw Error("Total exceeds remaining budget.");
      }

      const result = await pool.query<Expense>(
        `INSERT INTO "Expense" (expense_name, price, quantity, total, category_id, date) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [expense_name, price, quantity, total, category_id, date]
      );
      await recalculateCategoryExpenses({
        pool,
        category_id,
      });

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id,
      });

      res.status(200).json({
        data: result.rows[0],
      });
    }

    if (saved_category_id) {
      const budget = await pool.query<Category>(
        'SELECT amount_left FROM "Saved Categories" WHERE saved_category_id= $1',
        [saved_category_id]
      );

      const remainingBudget = budget.rows[0].amount_left;

      if (total > remainingBudget) {
        throw Error("Total exceeds remaining budget.");
      }

      const result = await pool.query<Expense>(
        `INSERT INTO "Expense" (expense_name, price, quantity, total, saved_category_id, date) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [expense_name, price, quantity, total, saved_category_id, date]
      );

      await recalculateSavedCategoryExpenses({
        pool,
        saved_category_id,
      });

      await recalculateWeekSummaryWithSavedCategory({
        pool,
        saved_category_id,
      });

      res.status(200).json({
        data: result.rows[0],
      });
    }
  } catch (error: unknown) {
    res.status(500).json({
      message: "An error has occured",
      error: (error as Error).message,
    });
  }
});

expenseRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await pool.query<Expense>(
      `SELECT * from "Expense" WHERE expense_id = $1`,
      [id]
    );

    res.status(200).json({
      data: data.rows[0],
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: "An error has occured",
      error: (error as Error).message,
    });
  }
});

expenseRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      expense_name,
      price,
      quantity,
      total,
      category_id,
      date,
      saved_category_id,
    } = req.body as Expense;

    const data = await pool.query<Expense>(
      `UPDATE "Expense" SET expense_name = $1, price = $2, quantity = $3, total = $4, date = $5 WHERE expense_id = $6 RETURNING *`,
      [expense_name, price, quantity, total, date, id]
    );
    if (category_id) {
      await recalculateCategoryExpenses({
        pool,
        category_id,
      });

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id,
      });

      res.status(200).json({
        data: data.rows[0],
      });
    }

    if (saved_category_id) {
      await recalculateSavedCategoryExpenses({
        pool,
        saved_category_id,
      });

      await recalculateWeekSummaryWithSavedCategory({
        pool,
        saved_category_id,
      });
      res.status(200).json({
        data: data.rows[0],
      });
    }
    throw Error("No category or saved category id provided.");
  } catch (error: unknown) {
    res.status(500).json({
      message: "An error has occured",
      error: (error as Error).message,
    });
  }
});

expenseRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedExpenseResult = await pool.query<Expense>(
      `DELETE from "Expense" WHERE expense_id = $1 RETURNING *`,
      [id]
    );

    const { category_id, saved_category_id } = deletedExpenseResult.rows[0];

    if (!category_id) {
      throw Error("Category ID is required.");
    }

    if (category_id) {
      await recalculateCategoryExpenses({
        pool,
        category_id,
      });

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id,
      });
    }

    if (saved_category_id) {
      await recalculateSavedCategoryExpenses({
        pool,
        saved_category_id,
      });

      await recalculateWeekSummaryWithCategory({
        pool,
        category_id,
      });
    }

    res.status(200).json({
      data: deletedExpenseResult.rows[0],
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: "An error has occured",
      error: (error as Error).message,
    });
  }
});

export default expenseRouter;
