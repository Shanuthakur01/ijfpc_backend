import express from "express";
import HrContact from "../models/HrContact.js";

const router = express.Router();

/**
 * GET /api/hr-upload-report
 * Query:
 *   - date=YYYY-MM-DD
 *   - tz=Asia/Kolkata (optional)
 *
 * ❌ NO AUTH
 */
router.get("/hr-upload-report", async (req, res) => {
  try {
    const date = String(req.query.date || "");
    const tz = String(req.query.tz || "Asia/Kolkata");

    if (!date) {
      return res.status(400).json({
        error: "date is required (YYYY-MM-DD)",
      });
    }

    const pipeline = [
      // 1️⃣ Convert createdAt → local YYYY-MM-DD
      {
        $addFields: {
          dayLocal: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: tz,
            },
          },
        },
      },

      // 2️⃣ Filter by selected date
      {
        $match: { dayLocal: date },
      },

      // 3️⃣ Group by uploader (createdBy → User._id)
      {
        $group: {
          _id: "$createdBy",
          total: { $sum: 1 },
          super_hot: {
            $sum: { $cond: [{ $eq: ["$qualityBand", "super_hot"] }, 1, 0] },
          },
          hot: {
            $sum: { $cond: [{ $eq: ["$qualityBand", "hot"] }, 1, 0] },
          },
          warm: {
            $sum: { $cond: [{ $eq: ["$qualityBand", "warm"] }, 1, 0] },
          },
          cold: {
            $sum: { $cond: [{ $eq: ["$qualityBand", "cold"] }, 1, 0] },
          },
        },
      },

      // 4️⃣ ✅ CORRECT lookup into ijf_rd_users
      {
        $lookup: {
          from: "ijf_rd_users", // ✅ FIX
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      // 5️⃣ Keep rows even if user is missing
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 6️⃣ Final shape
      {
        $project: {
          _id: 0,
          userId: { $toString: "$_id" },
          name: "$user.name",
          username: "$user.username",
          email: "$user.email",
          total: 1,
          super_hot: 1,
          hot: 1,
          warm: 1,
          cold: 1,
        },
      },

      { $sort: { total: -1 } },
    ];

    const uploaders = await HrContact.aggregate(pipeline);

    const summary = uploaders.reduce(
      (acc, r) => {
        acc.total += r.total || 0;
        acc.super_hot += r.super_hot || 0;
        acc.hot += r.hot || 0;
        acc.warm += r.warm || 0;
        acc.cold += r.cold || 0;
        return acc;
      },
      { total: 0, super_hot: 0, hot: 0, warm: 0, cold: 0 }
    );

    res.json({ date, tz, summary, uploaders });
  } catch (err) {
    console.error("HR upload report error:", err);
    res.status(500).json({
      error: "Failed to generate report",
    });
  }
});

export default router;
