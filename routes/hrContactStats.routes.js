// routes/hrContactStats.routes.js
import express from "express";
import mongoose from "mongoose";
import HrContact from "../models/HrContact.js"; // adjust path if needed

const router = express.Router();

/**
 * GET /api/hr-contacts/stats/uploaders?date=YYYY-MM-DD
 * Example: /api/hr-contacts/stats/uploaders?date=2026-01-08
 *
 * Returns: per-uploader counts for that date (IST day window)
 */
router.get("/stats/uploaders", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      return res
        .status(400)
        .json({ message: "date query param is required (YYYY-MM-DD)" });
    }

    // Basic validation for YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD" });
    }

    // Build IST day window: [00:00:00, 23:59:59.999] in Asia/Kolkata
    // Asia/Kolkata is UTC+05:30 (no DST)
    const startIST = new Date(`${date}T00:00:00.000+05:30`);
    const endIST = new Date(`${date}T23:59:59.999+05:30`);

    const pipeline = [
      {
        $match: {
          date: { $gte: startIST, $lte: endIST },
        },
      },

      // Normalize email + phone, and keep createdBy
      {
        $project: {
          createdBy: 1,
          email: {
            $cond: [
              {
                $and: [{ $ne: ["$email", null] }, { $ne: ["$email", ""] }],
              },
              { $toLower: { $trim: { input: "$email" } } },
              null,
            ],
          },
          phoneE164: {
            $cond: [
              {
                $and: [
                  { $ne: ["$phoneE164", null] },
                  { $ne: ["$phoneE164", ""] },
                ],
              },
              "$phoneE164",
              null,
            ],
          },
        },
      },

      // Group by uploader, collect distinct emails/phones
      {
        $group: {
          _id: "$createdBy",
          totalUploaded: { $sum: 1 },
          emailsSet: { $addToSet: "$email" },
          phonesSet: { $addToSet: "$phoneE164" },
        },
      },

      // Remove nulls from sets and count
      {
        $project: {
          uploaderId: "$_id",
          _id: 0,
          totalUploaded: 1,
          uniqueEmails: {
            $size: {
              $filter: {
                input: "$emailsSet",
                as: "e",
                cond: { $and: [{ $ne: ["$$e", null] }, { $ne: ["$$e", ""] }] },
              },
            },
          },
          uniquePhones: {
            $size: {
              $filter: {
                input: "$phonesSet",
                as: "p",
                cond: { $and: [{ $ne: ["$$p", null] }, { $ne: ["$$p", ""] }] },
              },
            },
          },
        },
      },

      // Join uploader details from User collection
      {
        $lookup: {
          from: "users", // change if your User collection name differs
          localField: "uploaderId",
          foreignField: "_id",
          as: "uploader",
        },
      },
      { $unwind: { path: "$uploader", preserveNullAndEmptyArrays: true } },

      // Shape final response per uploader
      {
        $project: {
          uploaderId: 1,
          uploaderName: {
            $ifNull: ["$uploader.fullName", "$uploader.name"],
          },
          uploaderEmail: "$uploader.email",
          totalUploaded: 1,
          uniquePhones: 1,
          uniqueEmails: 1,
        },
      },

      { $sort: { totalUploaded: -1 } },
    ];

    const rows = await HrContact.aggregate(pipeline);

    const totals = rows.reduce(
      (acc, r) => {
        acc.totalUploaded += r.totalUploaded || 0;
        acc.uniquePhones += r.uniquePhones || 0;
        acc.uniqueEmails += r.uniqueEmails || 0;
        return acc;
      },
      { totalUploaded: 0, uniquePhones: 0, uniqueEmails: 0 }
    );

    return res.json({
      date,
      window: { startIST, endIST },
      totals,
      uploaders: rows,
    });
  } catch (err) {
    console.error("HR contact uploader stats error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
