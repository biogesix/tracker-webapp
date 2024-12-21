import express, { NextFunction, Request, Response } from "express";
import { pool } from "../db";
import groupExpensesByDay from "../utils/groupExpensesByDay";
import { Expense } from "../utils/types";
import getLastSunday from "../utils/getLastSunday";

const chartRouter = express.Router();

chartRouter.get(
  "/user/:user_id/weekly_summary/:weekly_summary_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_id, weekly_summary_id } = req.params;
    const { isRecent } = req.query;
    try {
      if (weekly_summary_id === "0") {
        console.log("parse equal to 0");
        // SQL Query with user_id filter
        const query = `SELECT e.total, e.date
          FROM
            "Expense" e
          LEFT JOIN
            "Category" c
            ON e.category_id = c.category_id
          WHERE
            c.user_id = $1
        `;

        // Pass user_id as a parameter to the query
        const { rows } = await pool.query<Expense>(query, [user_id]);
        const arranged = groupExpensesByDay(rows);

        const date_start = new Date(getLastSunday()).toLocaleString("default", {
          month: "long",
        });
        const date_end = new Date(
          new Date(date_start).setDate(new Date(date_start).getDate() + 6)
        ).toLocaleString("default", {
          month: "long",
        });

        res.status(200).json({
          data: {
            arranged,
            date_start,
            date_end,
          },
        });
      } else {
        console.log("parsn't equal to 0");

        if (isRecent === "true") {
          const { rows } = await pool.query(
            `SELECT e.total, e.date FROM "Expense" e
              LEFT JOIN
                "Category" c
              ON e.category_id = c.category_id
              WHERE c.user_id = $1
            `,
            [user_id]
          );

          const { rows: weeklySummaryRows } = await pool.query(
            `SELECT date_start, date_end FROM "Weekly Summary"
              WHERE user_id = $1
              ORDER BY weekly_summary_id
              DESC LIMIT 1`,
            [user_id]
          );

          const date_start = new Date(
            weeklySummaryRows[0].date_start.toLocaleString("default", {
              month: "long",
            })
          );
          const date_end = new Date(
            weeklySummaryRows[0].date_end.toLocaleString("default", {
              month: "long",
            })
          );

          const arranged = groupExpensesByDay(rows);
          res.status(200).json({
            data: {
              arranged,
              date_start: date_start,
              date_end: date_end,
            },
          });
        } else {
          const { rows } = await pool.query(
            `SELECT e.total, e.date, ws.date_start, ws.date_end FROM "Expense" e
            LEFT JOIN
            "Saved Categories" sc
            ON e.saved_category_id = sc.saved_category_id
              JOIN
              "Weekly Summary" ws
                ON sc.weekly_summary_id = ws.weekly_summary_id
              WHERE
                sc.weekly_summary_id = $1
                `,
            [weekly_summary_id]
          );

          const date_start = new Date(rows[0].date_start).toDateString();
          const date_end = new Date(rows[0].date_end).toDateString();

          const arranged = groupExpensesByDay(rows);
          res.status(200).json({
            data: {
              arranged,
              date_start: date_start,
              date_end: date_end,
            },
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

export default chartRouter;
