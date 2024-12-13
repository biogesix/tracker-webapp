import express, { Request, Response } from "express";
import { pool } from "../db";
import {
  Category,
  Expense,
  SavedCategories,
  WeeklySummary,
} from "../utils/types";
import getLastSunday from "../utils/getLastSunday";

const weeklySummaryRouter = express.Router();

weeklySummaryRouter.post("/user/:id", async (req: Request, res: Response) => {
  try {
    const { newBudgets } = req.body;
    const { id } = req.params;
    console.log(newBudgets);

    // get recent weekly summary, either from last week or a few weeks ago basta recent

    const { rows: recentWeeklySummaryRows } = await pool.query(
      `
      SELECT * FROM "Weekly Summary" WHERE user_id = $1 ORDER BY date_start DESC`,
      [id]
    ); // here

    const weeklySummary: WeeklySummary = recentWeeklySummaryRows[0];

    // get all user categories

    const { rows: categories } = await pool.query<Category>(
      `
      SELECT * FROM "Category" WHERE user_id = $1`,
      [id]
    );

    if (!categories) {
      throw Error("Error fetching categories.");
    }

    // do something for each of the categories
    categories.forEach(async (category) => {
      // create a new saved category on the saved categories table

      const newSavedCategory: SavedCategories = {
        ...category,
        weekly_summary_id: weeklySummary.weekly_summary_id!,
      };

      const { rows: savedCategoryRows } = await pool.query<SavedCategories>(
        `INSERT INTO "Saved Categories"(category_name, budget, category_color, amount_left, amount_spent, weekly_summary_id, description) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          newSavedCategory.category_name,
          newSavedCategory.budget,
          newSavedCategory.category_color,
          newSavedCategory.amount_left,
          newSavedCategory.amount_spent,
          newSavedCategory.weekly_summary_id,
          newSavedCategory.description,
        ]
      );

      const savedCategory = savedCategoryRows[0];

      // get expenses of this category

      const { rows: expensesRows } = await pool.query<Expense>(
        `SELECT * FROM "Expense" WHERE category_id = $1`,
        [category.category_id]
      );

      // edit each expense of this category to have an assigned saved_category, and have a null category_id

      expensesRows.forEach(async (expense) => {
        try {
          await pool.query(
            `UPDATE "Expense" SET category_id = $1, saved_category_id = $2 WHERE expense_id = $3`,
            [null, savedCategory.saved_category_id!, expense.expense_id]
          );
        } catch (error: any) {
          throw Error(error);
        }
      });

      // update category's budget

      if (newBudgets[category.category_id!]) {
        console.log("new category budget ", newBudgets[category.category_id!]);
        console.log("category id ", category.category_id);

        await pool.query(
          'UPDATE "Category" SET budget = $1 WHERE category_id = $2',
          [newBudgets[category.category_id!], category.category_id]
        );
      } else {
        console.log(category.category_id);
      }
    });

    const lastSunday = new Date(getLastSunday()).toLocaleDateString();

    const nextSaturday = new Date(lastSunday);
    nextSaturday.setDate(nextSaturday.getDate() + 6);

    const { rows: weeklySummaryRows } = await pool.query(
      `INSERT INTO "Weekly Summary"(date_start, date_end, user_id) VALUES($1, $2, $3) RETURNING *`,
      [lastSunday, nextSaturday.toLocaleDateString(), id]
    );

    res.json({
      data: weeklySummaryRows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

weeklySummaryRouter.get(
  "/user/:id/categories",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log(id);

      const result = await pool.query(
        `SELECT * FROM "Category" WHERE user_id = $1`,
        [id]
      );

      res.status(200).json({ data: result.rows });
    } catch {
      res.status(500).send("Error fetching categories");
    }
  }
);

weeklySummaryRouter.get("/user/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT * FROM "Weekly Summary" WHERE user_id = $1 ORDER BY weekly_summary_id DESC`,
      [id]
    );

    console.log(rows);
    res.status(200).json({
      data: rows,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
});

weeklySummaryRouter.get(
  "/:id/savedcategories",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log(id);

      const result = await pool.query(
        `SELECT * FROM "Saved Categories" WHERE weekly_summary_id = $1`,
        [id]
      );

      res.status(200).json({ data: result.rows });
    } catch {
      res.status(500).send("Error fetching saved categories");
    }
  }
);

weeklySummaryRouter.get(
  "/user/:id/recent",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { rows } = await pool.query(
        `SELECT * FROM "Weekly Summary" WHERE user_id = $1 ORDER BY weekly_summary_id DESC LIMIT 1`,
        [id]
      );
      console.log(rows);
      res.status(200).json({
        data: rows[0],
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default weeklySummaryRouter;
