// routes/payments.routes.js
import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { Student } from "../models/student.model.js";
import PrePlacementStudent from "../models/PrePlacementStudent.js";
import { makeNameKey } from "../lib/nameKey.js";
import { sendMail } from "../lib/mailer.js";
import { buildReceiptHTML } from "../lib/receipt-template.js";
import { htmlToPdf } from "../lib/receipt-pdf.js";
import { welcomeHtml, plainTextFallback } from "../lib/email-template.js";
import fs from "fs";
const router = express.Router();
// --- mini validator (same rules you used before) ---
const MODES = ["ONLINE", "OFFLINE", "SELF_PACED"];
function isEmail(s = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
}
function isYear(n) {
  return Number.isInteger(n) && n >= 1990 && n <= 2100;
}
function validatePersonal(body = {}) {
  const errors = [];
  const reqStr = (v, name) => {
    if (!v || typeof v !== "string" || !v.trim())
      errors.push(`${name} is required`);
  };
  reqStr(body.fullName, "fullName");
  reqStr(body.fathersName, "fathersName");
  reqStr(body.mobile, "mobile");
  reqStr(body.email, "email");
  reqStr(body.address, "address");
  reqStr(body.degree, "degree");
  const passoutYearNum = Number(body.passoutYear);
  if (!isYear(passoutYearNum))
    errors.push("passoutYear must be between 1990 and 2100");
  if (!body.mode || !MODES.includes(body.mode)) errors.push("mode is invalid");
  if (body.email && !isEmail(body.email)) errors.push("email is invalid");
  if (
    body.mobile &&
    !/^\d{10,15}$/.test(String(body.mobile).replace(/\D/g, ""))
  )
    errors.push("mobile is invalid");
  return errors;
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- helper: map RZP method -> friendly mode string

function modeFromPayment(p) {
  const m = p?.method;
  if (m === "upi") return "RZP:UPI";
  if (m === "card") return "RZP:CARD";
  if (m === "netbanking") return "RZP:NETBANKING";
  if (m === "wallet") return `RZP:WALLET:${p?.wallet || "GEN"}`;
  if (m === "emi") return "RZP:EMI";
  if (m === "cardless_emi")
    return `RZP:CARDLESS_EMI:${(
      p?.cardless_emi?.provider || "PROVIDER"
    ).toUpperCase()}`;
  return `RZP:${(m || "UNKNOWN").toUpperCase()}`;
}
// POST /payments/create-order
// POST /payments/create-order
router.post("/create-order", async (req, res) => {
  try {
    // Expect full Step-1 form in body.form
    const { form } = req.body || {};
    const errors = validatePersonal(form || {});
    if (errors.length) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }

    // Fixed ₹1,000 admission fee (paise)
    const amount = 118000;

    // Short receipt
    const ts = Date.now().toString().slice(-8);
    const last4 = String(form?.mobile || "0000").slice(-4);
    const receipt = `ad_${last4}_${ts}`;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt,
      // keep notes small; we'll also send full form again during verify
      notes: {
        purpose: "ADMISSION_1K",
        mobile: form?.mobile || "",
        email: (form?.email || "").toLowerCase(),
      },
    });

    return res.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (e) {
    console.error("create-order error", e);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// POST /payments/verify
router.post("/verify", async (req, res) => {
  try {
    const {
      // Razorpay confirm
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      // Full Step-1 data (save only now)
      form,
    } = req.body || {};

    // 1) Require RZP fields + form
    const errors = validatePersonal(form || {});
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      errors.length
    ) {
      return res.status(400).json({
        verified: false,
        error: errors.length ? "Validation failed" : "Missing fields",
        details: errors.length ? errors : undefined,
      });
    }

    // 2) Signature verify
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res
        .status(400)
        .json({ verified: false, error: "Signature mismatch" });
    }

    // 3) Fetch payment + order
    const [payment, order] = await Promise.all([
      razorpay.payments.fetch(razorpay_payment_id),
      razorpay.orders.fetch(razorpay_order_id),
    ]);

    // 4) Upsert/Create Student now (first successful write)
    const email = String(form.email).trim().toLowerCase();
    const mobile = String(form.mobile).trim();

    // Try to find by unique keys to avoid duplicates
    let s = await Student.findOne({ $or: [{ email }, { mobile }] });

    if (!s) {
      s = await Student.create({
        fullName: form.fullName,
        fathersName: form.fathersName,
        mobile,
        email,
        address: form.address,
        degree: form.degree,
        passoutYear: Number(form.passoutYear),
        mode: form.mode,
        admissionPayment: {
          plan: "ADMISSION_1K", // must exist in schema enum
          status: "PAID",
          amount: order.amount,
          currency: order.currency || "INR",
          orderId: order.id,
          paymentId: payment.id,
          notes: order.notes || {},
          paidAt: new Date(payment.created_at * 1000),
        },
      });
    } else {
      // If student exists, just mark payment fields
      s.admissionPayment = {
        ...(s.admissionPayment || {}),
        plan: "ADMISSION_1K",
        status: "PAID",
        amount: order.amount,
        currency: order.currency || "INR",
        orderId: order.id,
        paymentId: payment.id,
        notes: order.notes || {},
        paidAt: new Date(payment.created_at * 1000),
      };
      await s.save();
    }

    // 5) Upsert PrePlacementStudent (idempotent)
    // after you create or find Student `s` and after fetching `payment` & `order`
    const nameKey = makeNameKey(s.fullName, s.mobile);

    // rupees paid
    const rupees = Math.round((payment.amount || 0) / 100);

    // idempotent upsert that matches your PrePlacementStudent schema defaults
    await PrePlacementStudent.updateOne(
      { nameKey },
      {
        $setOnInsert: {
          name: s.fullName,
          nameKey,
          email: s.email,
          courseName: undefined,
          terms: undefined,
          totalFee: 0,
          dueDate: undefined,
          payments: [], // initialize
          refunds: [],
          totalRefunded: 0,
          netCollected: 0,
          totalReceived: 0,
          remainingFee: 0,
          status: "ACTIVE",
          zone: "BLUE",
          source: { provider: "Admission", lastSyncedAt: new Date() },
          reminders: {},
        },
      },
      { upsert: true }
    );

    // 2️⃣ Push payment separately (only if it’s not already recorded)
    await PrePlacementStudent.updateOne(
      { nameKey, "payments.receiptNos": { $ne: payment.id } },
      {
        $push: {
          payments: {
            amount: Math.round((payment.amount || 0) / 100),
            date: new Date(payment.created_at * 1000),
            mode: modeFromPayment(payment),
            receiptNos: [payment.id, order.receipt].filter(Boolean),
            note: "ADMISSION_1K",
            raw: payment,
          },
        },
      }
    );
    // 6) (Optional) build receipt + email (keep your existing code if you want)
    // 6) Build receipt → PDF → email to student + bcc management
    try {
      const html = buildReceiptHTML({
        student: s.toObject ? s.toObject() : s,
        payment,
        order,
        plan: "ADMISSION_1K",
      });

      const recName = `Receipt_${order?.receipt || payment?.id}.pdf`;
      const pdf = await htmlToPdf({ html, filename: recName });

      // Parse management addresses from env (comma-separated)
      const mgmtList = (process.env.MGMT_EMAILS || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      await sendMail({
        to: s.email,
        bcc: mgmtList, // ✅ management also receives it
        subject: "Welcome to IT Jobs Factory — Payment Received",
        html: welcomeHtml({ name: s.fullName }),
        text: plainTextFallback({ name: s.fullName }),
        attachments: [
          {
            filename: pdf.filename,
            path: pdf.filePath,
            contentType: "application/pdf",
          },
        ],
      });

      await Student.updateOne(
        { _id: s._id },
        { $set: { "admissionPayment.emailSentAt": new Date() } }
      );

      // Clean temp file
      try {
        fs.unlinkSync(pdf.filePath);
      } catch {}
    } catch (mailErr) {
      console.error("Email send failed:", mailErr);
    }

    return res.json({ verified: true, studentId: s._id });
  } catch (e) {
    console.error("verify error", e);
    return res.status(500).json({ error: e.message, verified: false });
  }
});
// IMPORTANT: this route must receive RAW body, not JSON-parsed
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const signature = req.headers["x-razorpay-signature"];

      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(req.body)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.warn("Razorpay webhook: invalid signature");
        return res.status(400).json({ error: "Invalid signature" });
      }

      // Now we know it's from Razorpay
      const payload = JSON.parse(req.body.toString("utf8"));

      // We only care about payment.captured (you can also handle order.paid)
      if (payload.event !== "payment.captured") {
        return res.json({ ok: true, ignored: true });
      }

      const paymentEntity = payload.payload.payment.entity;

      // 1) amount is in paise → convert
      const amount = Number(paymentEntity.amount) / 100;

      // 2) we must know which user this belongs to
      // we will send clerkId in order notes from frontend when we create the order
      const clerkId = paymentEntity.notes?.clerkId;
      if (!clerkId) {
        console.error("Webhook payment has no clerkId in notes");
        return res.json({ ok: true, missingClerkId: true });
      }

      // 3) idempotency: check if we already stored this payment in our fee doc
      // simplest way: look for same payment_id in payments.raw
      // (skip if already present)
      const already = await PrePlacementStudent.findOne({
        clerkId,
        "payments.raw.razorpay_payment_id": paymentEntity.id,
      }).lean();

      if (already) {
        return res.json({ ok: true, duplicated: true });
      }

      // 4) apply our business logic
      const { feeDoc, user } = await applyPaymentToStudent({
        clerkId,
        amount,
        mode: "razorpay-webhook",
        raw: {
          razorpay_payment_id: paymentEntity.id,
          method: paymentEntity.method,
        },
      });

      return res.json({
        ok: true,
        user: user
          ? {
              feePlan: user.feePlan,
              installmentCount: user.installmentCount,
              nextDueAt: user.nextDueAt,
            }
          : null,
        fee: {
          remainingFee: feeDoc.remainingFee,
          netCollected: feeDoc.netCollected,
        },
      });
    } catch (err) {
      console.error("Razorpay webhook error:", err);
      return res.status(500).json({ error: "Webhook failed" });
    }
  }
);

export default router;
