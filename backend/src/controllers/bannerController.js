//controllers/bannerController.js
import Banner from "../models/Banner.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


export const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "softstrides/banners" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const uploaded = await streamUpload();

    const banner = await Banner.create({
      title: req.body.title,
      image: uploaded.secure_url,
      link: req.body.link,
      description: req.body.description,
    });

    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const { title, description } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    banner.title = title || banner.title;
    banner.description = description || banner.description;

    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "softstrides/banners" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const uploaded = await streamUpload();
      banner.image = uploaded.secure_url;
    }

    const updatedBanner = await banner.save();

    res.json(updatedBanner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const deleteBanner = async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: "Banner deleted" });
};
