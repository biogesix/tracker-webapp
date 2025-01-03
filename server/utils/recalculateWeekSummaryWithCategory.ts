import { Pool } from "pg";
import getLastSunday from "./getLastSunday";
import { Category, WeeklySummary } from "./types";

interface RecalculatedWeek {
  total_spent: number;
  total_budget: number;
}

interface recalculateWeekProps {
  pool: Pool;
  category_id: number;
  user_id?: number;
}
// recalculate the weekly summary based on the expenses of a category
export default async function recalculateWeekSummaryWithCategory({
  pool,
  category_id,
  user_id,
}: recalculateWeekProps) {
  // get category

  let userId = user_id;

  if (!user_id) {
    const { rows: userIdRows } = await pool.query<Category>(
      `SELECT user_id FROM "Category" WHERE category_id = $1`,
      [category_id]
    );

    console.log(userIdRows);
    // get user_id by category
    userId = userIdRows[0].user_id;
  }

  const { rows: calculatedWeekBudgetAndExpendedRows } =
    await pool.query<RecalculatedWeek>(
      `SELECT SUM(budget) as total_budget, SUM(amount_spent) as total_spent FROM "Category" WHERE user_id = $1`,
      [userId]
    );

  const { total_budget, total_spent } =
    calculatedWeekBudgetAndExpendedRows[0] as RecalculatedWeek;
  console.log(total_budget, total_spent);

  const total_not_spent = total_budget - total_spent;
  const lastSunday = new Date(getLastSunday()).toLocaleDateString();

  await pool.query<WeeklySummary>(
    `UPDATE "Weekly Summary" SET total_budget = $1, total_spent = $2, total_not_spent = $3 WHERE date_start = $4 AND user_id = $5`,
    [total_budget, total_spent, total_not_spent, lastSunday, userId]
  );
}
