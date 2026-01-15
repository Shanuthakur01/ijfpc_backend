import express from "express";
import mongoose from "mongoose";
import PostPlacementOffer from "../models/PostPlacementOffer.js";

const router = express.Router();

// GET all offers
router.get("/list", async (req, res) => {
  try {
    const offers = await PostPlacementOffer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    console.error("GET /list error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET single offer
router.get("/:id", async (req, res) => {
  try {
    const offer = await PostPlacementOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: "Not found" });
    res.json(offer);
  } catch (err) {
    console.error("GET /:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE new offer
router.post("/create", async (req, res) => {
  try {
    const offer = new PostPlacementOffer(req.body);
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    console.error("POST /create error:", err);
    res.status(400).json({ error: err.message });
  }
});

// UPDATE an offer
router.put("/:id", async (req, res) => {
  try {
    const offer = await PostPlacementOffer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!offer) return res.status(404).json({ error: "Not found" });
    res.json(offer);
  } catch (err) {
    console.error("PUT /:id error:", err);
    res.status(400).json({ error: err.message });
  }
});
router.get("/__ping", (req, res) => {
  console.log("OFFERS ROUTER PING HIT");
  res.json({
    ok: true,
    where: "offers router",
    time: new Date().toISOString(),
  });
});

// DELETE an offer
router.delete("/:id", async (req, res) => {
  try {
    const offer = await PostPlacementOffer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add installment
router.post("/:id/installments", async (req, res) => {
  try {
    const offer = await PostPlacementOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: "Not found" });

    offer.installments.push(req.body);
    await offer.save();

    res.json(offer);
  } catch (err) {
    console.error("POST /:id/installments error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Update installment
router.patch("/:id/installments/:instId", async (req, res) => {
  try {
    const offer = await PostPlacementOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: "Not found" });

    const inst = offer.installments.id(req.params.instId);
    if (!inst) return res.status(404).json({ error: "Installment not found" });

    Object.assign(inst, req.body);
    await offer.save();

    res.json(offer);
  } catch (err) {
    console.error("PATCH /:id/installments/:instId error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Delete installment (Atomic)
router.delete("/:id/installments/:instId", async (req, res) => {
  try {
    const { id, instId } = req.params;

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(instId)) {
      return res.status(400).json({ error: "Invalid id/instId" });
    }

    // Cast instId to ObjectId to avoid mismatch
    const offer = await PostPlacementOffer.findOneAndUpdate(
      { _id: id },
      { $pull: { installments: { _id: new mongoose.Types.ObjectId(instId) } } },
      { new: true }
    );

    if (!offer) return res.status(404).json({ error: "Not found" });

    return res.json(offer);
  } catch (err) {
    console.error("DELETE /:id/installments/:instId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
