//controllers/bannerController.js
import Banner from "../models/Banner.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadToCloudinary = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "softstrides/banners",
  });
};


export const createBanner = async (req, res) => {
  try {
    const desktopFile = req.files?.desktopImage?.[0];
    const mobileFile = req.files?.mobileImage?.[0];

    if (!desktopFile || !mobileFile) {
      return res.status(400).json({
        message: "Both images required",
      });
    }

    const desktopUploaded =
      await uploadToCloudinary(desktopFile.path);

    const mobileUploaded =
      await uploadToCloudinary(mobileFile.path);

    const banner = await Banner.create({
      title: req.body.title,
      description: req.body.description,

      desktopImage: desktopUploaded.secure_url,
      mobileImage: mobileUploaded.secure_url,
    });

    res.status(201).json(banner);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};


export const getActiveBanners = async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(banners);
};

export const toggleBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  banner.isActive = !banner.isActive;
  await banner.save();
  res.json(banner);
};


export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        message: "Banner not found",
      });
    }

    banner.title = req.body.title || banner.title;

    banner.description =
      req.body.description || banner.description;

    const desktopFile = req.files?.desktopImage?.[0];
    const mobileFile = req.files?.mobileImage?.[0];

    if (desktopFile) {
      const uploaded = await uploadToCloudinary(
        desktopFile.path
      );

      banner.desktopImage = uploaded.secure_url;
    }

    if (mobileFile) {
      const uploaded = await uploadToCloudinary(
        mobileFile.path
      );

      banner.mobileImage = uploaded.secure_url;
    }

    await banner.save();

    res.json(banner);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};



export const deleteBanner = async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: "Banner deleted" });
};
