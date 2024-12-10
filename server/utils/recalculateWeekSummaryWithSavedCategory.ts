import { Pool } from "pg";

interface RecalculatedWeek {
  total_spent: number;
  total_budget: number;
}

interface recalculateSavedExpensesProps {
  pool: Pool;
  saved_category_id: number;
}

// update week summary with saved category id
export default async function recalculateWeekSummaryWithSavedCategory({
  pool,
  saved_category_id,
}: recalculateSavedExpensesProps) {
  // get weekly summary saved expenses

  const { rows: weeklySummaryIdRows } = await pool.query(
    `SELECT weekly_summary_id FROM "Saved Categories" WHERE saved_category_id = $1`,
    [saved_category_id]
  );

  const weeklySummaryId = weeklySummaryIdRows[0].weekly_summary_id;

  const { rows: calculatedWeekBudgetAndExpendedRows } = await pool.query(
    `SELECT SUM(budget) as total_budget, SUM(amount_spent) as total_spent FROM "Saved Categories" WHERE saved_category_id = $1`,
    [weeklySummaryId]
  );

  const { total_budget, total_spent } =
    calculatedWeekBudgetAndExpendedRows[0] as RecalculatedWeek;

  const total_not_spent = total_budget || 0 - total_spent || 0;

  const res = await pool.query(
    `UPDATE "Weekly Summary" SET total_budget = $1, total_spent = $2, total_not_spent = $3 WHERE weekly_summary_id = $4`,
    [total_budget, total_spent, total_not_spent, weeklySummaryId]
  );
  console.log(res);
}
