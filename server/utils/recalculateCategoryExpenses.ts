import { Pool } from "pg";

interface RecalculatedCategory {
  amount_spent: number;
  amount_left: number;
}

interface recalculateExpensesProps {
  pool: Pool;
  category_id: number;
}
// edits the amount left and amount spent of a category
// based on the expenses of that category
export default async function recalculateCategoryExpenses({
  pool,
  category_id,
}: recalculateExpensesProps) {
  const { rows: totalExpenseRows } = await pool.query(
    `SELECT SUM(total) as total_expenses FROM "Expense" WHERE category_id = $1`,
    [category_id]
  );

  const { rows: categoryBudgetRows } = await pool.query(
    `SELECT budget FROM "Category" WHERE category_id = $1`,
    [category_id]
  );

  console.log(categoryBudgetRows);

  const totalExpended = totalExpenseRows[0].total_expenses || 0;
  const budget = categoryBudgetRows[0].budget || 0;
  const amount_left = budget - totalExpended;

  console.log(totalExpended, budget, amount_left);

  if (amount_left < 0) {
    throw Error("Expenses exceeded the budget");
  }

  await pool.query(
    `UPDATE "Category" SET amount_left = $1, amount_spent = $2 WHERE category_id = $3`,
    [amount_left, totalExpended, category_id]
  );

  return {
    amount_left,
    amount_spent: totalExpenseRows[0],
  } satisfies RecalculatedCategory;
}
