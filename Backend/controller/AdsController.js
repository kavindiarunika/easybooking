import AdsSchema from "../schema/Ads.js";
import cloudinary from "../cloudinary/cloudinary.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinaryHelper.js";

export const addads = async (req, res) => {
  try {
    const { villaad, homeAd, goTripAd } = req.files;

    const uploadFiles = async (files, folder) => {
      if (!files) return [];

      const media = [];

      for (const file of files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder,
            resource_type: "auto",
          });

          media.push({
            url: result.secure_url,
            type: result.resource_type,
            public_id: result.public_id, // Save public_id
          });
        } catch (error) {
          console.error(`Upload error for ${folder}:`, error);
        }
      }
      return media;
    };

    const villaMedia = await uploadFiles(villaad, "ads/villaads");
    const homeMedia = await uploadFiles(homeAd, "ads/homeads");
    const goTripMedia = await uploadFiles(goTripAd, "ads/gotripads");

    const ads = new AdsSchema({
      villaad: villaMedia,
      homeAd: homeMedia,
      goTripAd: goTripMedia,
    });
    await ads.save();
    res.status(201).json({ message: "Ads added successfully", ads });
  } catch (error) {
    res.status(500).json({ message: "server Error", error });
  }
};

export const updateAds = async (req, res) => {
  try {
    const { id } = req.params;
    const { villaad, homeAd, goTripAd } = req.files || {};

    const uploadFiles = async (files, folder) => {
      if (!files || files.length === 0) return null;

      const media = [];

      for (const file of files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder,
            resource_type: "auto",
          });

          media.push({
            url: result.secure_url,
            type: result.resource_type,
            public_id: result.public_id, // Save public_id
          });
        } catch (error) {
          console.error(`Upload error for ${folder}:`, error);
        }
      }
      return media;
    };

    // Find existing ads
    const ads = await AdsSchema.findById(id);
    if (!ads) {
      return res.status(404).json({ message: "Ads not found" });
    }

    // Delete old images from Cloudinary before uploading new ones
    if (villaad) {
      if (ads.villaad && ads.villaad.length > 0) {
        for (const media of ads.villaad) {
          if (media.public_id) await deleteFromCloudinary(media.public_id);
        }
      }
    }

    if (homeAd) {
      if (ads.homeAd && ads.homeAd.length > 0) {
        for (const media of ads.homeAd) {
          if (media.public_id) await deleteFromCloudinary(media.public_id);
        }
      }
    }

    if (goTripAd) {
      if (ads.goTripAd && ads.goTripAd.length > 0) {
        for (const media of ads.goTripAd) {
          if (media.public_id) await deleteFromCloudinary(media.public_id);
        }
      }
    }

    // Upload only if new files are sent
    const villaMedia = await uploadFiles(villaad, "ads/villaads");
    const homeMedia = await uploadFiles(homeAd, "ads/homeads");
    const goTripMedia = await uploadFiles(goTripAd, "ads/gotripads");

    // Update fields only if new media exists
    if (villaMedia) ads.villaad = villaMedia;
    if (homeMedia) ads.homeAd = homeMedia;
    if (goTripMedia) ads.goTripAd = goTripMedia;

    await ads.save();

    res.status(200).json({ message: "Ads updated successfully", ads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Ads

export const getAds = async (req, res) => {
  try {
    const ads = await AdsSchema.findOne().sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "server Error", error });
  }
};

//delete ads

export const deleteAds = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // Get the type (villaad, homeAd, or goTripAd) from query params

    if (!type) {
      return res.status(400).json({ message: "Type parameter is required" });
    }

    // Find the ad first to get public_ids before deletion
    const ads = await AdsSchema.findOne();
    if (ads && ads[type]) {
      const mediaIndex = ads[type].findIndex(
        (item) => item._id.toString() === id,
      );
      if (mediaIndex !== -1 && ads[type][mediaIndex].public_id) {
        // Delete from Cloudinary
        await deleteFromCloudinary(ads[type][mediaIndex].public_id);
      }
    }

    const deleteAd = await AdsSchema.findOneAndUpdate(
      {},
      { $pull: { [type]: { _id: id } } },
      { new: true },
    );

    if (!deleteAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.status(200).json({ message: "Ad deleted successfully", deleteAd });
  } catch (error) {
    res.status(500).json({ message: "server Error", error });
  }
};
