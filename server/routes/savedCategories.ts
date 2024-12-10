import express, { Request, Response } from "express";
import { pool } from "../db";
import { SavedCategories } from "../utils/types";

const savedCategoriesRouter = express.Router();

savedCategoriesRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM "Saved Categories" WHERE saved_category_id = $1`,
      [id]
    );

    res.status(200).json({
      data: rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      error,
    });
  }
});
savedCategoriesRouter.put("/:id", async (req: Request, res: Response) => {
  console.log("PUT request received for ID:", req.params.id);
  try {
    const { id } = req.params;
    const {
      saved_category_id,
      category_name,
      budget,
      category_color,
      amount_left,
      amount_spent,
      weekly_summary_id,
    }: SavedCategories = req.body;
    const data = await pool.query(
      `
      UPDATE "Saved Categories" SET
      saved_category_id = $1,
      category_name = $2,
      budget = $3,
      category_color = $4,
      amount_left = $5,
      amount_spent = $6,
      weekly_summary_id = $7
      WHERE saved_category_id = $8 RETURNING *`,
      [
        saved_category_id,
        category_name,
        budget,
        category_color,
        amount_left,
        amount_spent,
        weekly_summary_id,
        id,
      ]
    );
    res.status(200).json({ data: data.rows[0] });
  } catch (error: any) {
    res.status(500).json({
      message: "An error has occured",
      error: error.message,
    });
  }
});

savedCategoriesRouter.get(
  "/:id/expenses",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { rows } = await pool.query(
        `SELECT * FROM "Expense" WHERE saved_category_id = $1`,
        [id]
      );

      res.status(200).json({
        data: rows,
      });
    } catch (error: any) {
      res.status(500).json({
        error,
      });
    }
  }
);

export default savedCategoriesRouter;
