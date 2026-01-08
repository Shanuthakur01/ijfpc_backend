import "../config/env.js";
// scripts/seed_hr_from_sheet.js
import mongoose from "mongoose";
import axios from "axios";
import HrContact from "../models/HrContact.js";
import { toE164 } from "../utils/phone.js"; // 🔁 adjust path if needed

const SHEETDB_URL = "https://sheetdb.io/api/v1/juvv5p5b93dnl"; // your URL

// cutoff: 26/11/2025 inclusive => warm, after that => hot
const CUTOFF_LOCAL = { day: 26, month: 11, year: 2025 }; // dd/mm/yyyy
const cutoffDate = new Date(
  Date.UTC(CUTOFF_LOCAL.year, CUTOFF_LOCAL.month - 1, CUTOFF_LOCAL.day)
);

function parseSheetDate(raw) {
  if (!raw) return null;
  // expects formats like "28/11/25" or "28-11-2025"
  const parts = String(raw)
    .trim()
    .split(/[\/\-]/);
  if (parts.length < 3) return null;
  const [ddStr, mmStr, yyStr] = parts;
  const dd = parseInt(ddStr, 10);
  const mm = parseInt(mmStr, 10);
  let year = parseInt(yyStr, 10);
  if (Number.isNaN(dd) || Number.isNaN(mm) || Number.isNaN(year)) return null;
  if (yyStr.length === 2) {
    // treat "25" as 2025
    year = 2000 + year;
  }
  return new Date(Date.UTC(year, mm - 1, dd));
}

function pickFirstPhone(raw) {
  if (!raw) return null;
  const str = String(raw);
  // split on common separators: "/", ",", " or "
  const firstPart = str.split(/\/|,| or /i)[0];
  if (!firstPart) return null;
  const digits = firstPart.replace(/\D/g, "");
  return digits || null;
}

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error(mongoUri);
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("✅ Connected to Mongo");

  const { data: rows } = await axios.get(SHEETDB_URL);
  console.log(`Fetched ${rows.length} rows from SheetDB`);

  const seenInBatch = new Set(); // phoneE164 to avoid duplicates in this run
  let inserted = 0;
  let skippedNoPhone = 0;
  let skippedInvalidPhone = 0;
  let skippedDuplicate = 0;
  let errors = 0;

  for (const row of rows) {
    try {
      const rawDate = row["DATE"] || row["Date"] || row["date"];
      const companyName = row["Company Name"] || row["Company"] || "";
      const hrName = row["HR Name"] || "";
      const email = (row["Mail ID"] || row["Mail Id"] || row["Email"] || "")
        .toString()
        .trim()
        .toLowerCase();
      const contactField =
        row["Contact No."] ||
        row["Contact No"] ||
        row["Contact"] ||
        row["Phone"] ||
        "";
      const resource = row["resource"] || row["Resource"] || "";

      // --- phone ---
      const phoneRaw = pickFirstPhone(contactField);
      if (!phoneRaw) {
        skippedNoPhone++;
        continue;
      }

      const phoneE164 = toE164(phoneRaw, "IN");
      if (!phoneE164) {
        skippedInvalidPhone++;
        continue;
      }

      if (seenInBatch.has(phoneE164)) {
        skippedDuplicate++;
        continue;
      }
      seenInBatch.add(phoneE164);

      // --- date + quality band ---
      const date = parseSheetDate(rawDate) || new Date();
      const qualityBand = date <= cutoffDate ? "warm" : "hot";

      const payload = {
        date,
        companyName,
        hrName,
        email,
        resource,
        phoneRaw,
        phoneE164,
        qualityBand,
        // seed entries: created by system
        createdBy: null,
      };

      // upsert to avoid dupes against existing DB
      await HrContact.updateOne(
        { phoneE164 },
        { $setOnInsert: payload },
        { upsert: true }
      );

      inserted++;
    } catch (err) {
      errors++;
      console.error("Error seeding a row:", err.message);
    }
  }

  console.log("---- SEED SUMMARY ----");
  console.log("Inserted:", inserted);
  console.log("Skipped (no phone):", skippedNoPhone);
  console.log("Skipped (invalid phone):", skippedInvalidPhone);
  console.log("Skipped (duplicate phone):", skippedDuplicate);
  console.log("Errors:", errors);

  await mongoose.disconnect();
  console.log("✅ Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
