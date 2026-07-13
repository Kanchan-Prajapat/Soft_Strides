import express from "express";
import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category");

    if (!product) {
      return res.status(404).send("Product not found");
    }

    const htmlPath = path.join(
      __dirname,
      "../views/productOG.html"
    );

    let html = fs.readFileSync(htmlPath, "utf8");

    html = html
      .replaceAll("{{TITLE}}", product.name)
      .replaceAll(
        "{{DESCRIPTION}}",
        product.description?.[0] ||
          "Premium oversized t-shirts from Soft Strides."
      )
      .replaceAll(
        "{{IMAGE}}",
        product.images[0]
      )
      .replaceAll(
        "{{URL}}",
        `https://softstrides.in/product/${product._id}`
      );

    res.send(html);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;