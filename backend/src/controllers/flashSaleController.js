//controllers/flashSaleController.js
import FlashSale from "../models/FlashSale.js";

export const createFlashSale = async (req, res) => {
  try {
    const { title, startDate, endDate, products } = req.body;

    const sale = await FlashSale.create({
      title,
      startDate,
      endDate,
      products
    });

    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getActiveFlashSale = async (req, res) => {
  const sale = await FlashSale.findOne({ isActive: true })
    .populate("products");

  res.json(sale);
};


export const getAllFlashSales = async (req, res) => {
  const sales = await FlashSale.find().populate("products");
  res.json(sales);
};

export const deleteFlashSale = async (req, res) => {
  await FlashSale.findByIdAndDelete(req.params.id);
  res.json({ message: "Flash sale deleted" });
};


export const getAllFlashSalesAdmin = async (req, res) => {
  const sales = await FlashSale.find()
    .populate("products")
    .sort({ createdAt: -1 });

  res.json(sales);
};
