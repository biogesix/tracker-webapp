import express, { Request, Response } from "express";
import { pool } from "../db";

const weeklySummaryRouter = express.Router();

weeklySummaryRouter.get(
  "/:id/categories",
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
      'SELECT * FROM "Weekly Summary" WHERE user_id = $1 ORDER BY weekly_summary_id DESC',
      [id]
    );
    res.status(200).json({
      data: rows,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default weeklySummaryRouter;
