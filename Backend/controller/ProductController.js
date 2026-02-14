import productModel from "../schema/productSchema.js";
import axios from "axios";
import cloudinary from "../cloudinary/cloudinary.js";
import {
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} from "../utils/cloudinaryHelper.js";

// Add new product
export const addProduct = async (req, res) => {
  try {
    console.log(
      "[addProduct] req.files keys:",
      req.files && Object.keys(req.files),
    );
    console.log("[addProduct] req.body.subProducts:", req.body.subProducts);
    const {
      name,
      description,
      price,
      category,
      size,
      whatsapp,
      email,
      ownerEmail,
      stock,
      colors,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !whatsapp ||
      !email ||
      !ownerEmail
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least main image is required" });
    }

    // Upload main image to Cloudinary using SDK
    let mainImageUrl = "";
    let mainImagePublicId = "";
    if (req.files.mainImage) {
      const mainImageFile = req.files.mainImage;
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products/main", resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          stream.end(mainImageFile.data);
        });
        mainImageUrl = uploadResult.secure_url;
        mainImagePublicId = uploadResult.public_id; // Save public_id
      } catch (uploadError) {
        console.error("Main image upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: uploadError.message,
        });
      }
    }

    // Upload other images if provided
    let otherImageUrls = [];
    let otherImagesPublicIds = [];
    if (req.files) {
      const otherImageFiles = Array.isArray(req.files.OtherImages)
        ? req.files.OtherImages
        : req.files.OtherImages
          ? [req.files.OtherImages]
          : [];
      for (const img of otherImageFiles) {
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "products/main", resource_type: "auto" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              },
            );
            stream.end(img.data);
          });
          otherImageUrls.push(uploadResult.secure_url);
          otherImagesPublicIds.push(uploadResult.public_id); // Save public_id
        } catch (uploadError) {
          console.error("Other image upload error:", uploadError);
        }
      }
    }

    // Parse colors array if it's a JSON string
    let parsedColors = [];
    if (colors) {
      if (typeof colors === "string") {
        try {
          parsedColors = JSON.parse(colors);
        } catch (e) {
          parsedColors = colors.split(",").map((c) => c.trim());
        }
      } else if (Array.isArray(colors)) {
        parsedColors = colors;
      }
    }

    // Process subProducts if they exist. `req.body.subProducts` may be
    // a JSON string (sent from multipart/form-data) or an array.
    let subProducts = [];
    let rawSubProducts = req.body.subProducts;
    let parsedSubProducts = [];

    if (rawSubProducts) {
      if (typeof rawSubProducts === "string") {
        try {
          parsedSubProducts = JSON.parse(rawSubProducts);
        } catch (e) {
          parsedSubProducts = [];
        }
      } else if (Array.isArray(rawSubProducts)) {
        parsedSubProducts = rawSubProducts;
      }
    }

    if (Array.isArray(parsedSubProducts) && parsedSubProducts.length > 0) {
      for (let i = 0; i < parsedSubProducts.length; i++) {
        const subProduct = parsedSubProducts[i];
        let subImageUrl = "";
        let subImagePublicId = "";

        // Upload sub-product image if exists (express-fileupload stores files in req.files)
        if (req.files && req.files[`subImage${i}`]) {
          const subImageFile = req.files[`subImage${i}`];
          try {
            const uploadResult = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "products/subs", resource_type: "auto" },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                },
              );
              stream.end(subImageFile.data);
            });
            subImageUrl = uploadResult.secure_url;
            subImagePublicId = uploadResult.public_id; // Save public_id
          } catch (uploadError) {
            console.error("Sub-product image upload error:", uploadError);
            return res.status(500).json({
              success: false,
              message: "Sub-product image upload failed",
              error: uploadError.message,
            });
          }
        }

        // Upload sub-product other images if provided
        let subOtherImageUrls = [];
        let subOtherImagesPublicIds = [];
        for (let j = 0; j < 5; j++) {
          const otherImgKey = `subOtherImage${i}_${j}`;
          if (req.files && req.files[otherImgKey]) {
            const otherImgFile = req.files[otherImgKey];
            try {
              const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: "products/subs", resource_type: "auto" },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                  },
                );
                stream.end(otherImgFile.data);
              });
              subOtherImageUrls.push(uploadResult.secure_url);
              subOtherImagesPublicIds.push(uploadResult.public_id); // Save public_id
            } catch (uploadError) {
              console.error(
                "Sub-product other image upload error:",
                uploadError,
              );
            }
          }
        }

        subProducts.push({
          subName: subProduct.subName,
          subDescription: subProduct.subDescription,
          subPrice: subProduct.subPrice,
          subsize: subProduct.subsize,
          subImage: subImageUrl,
          subImagePublicId: subImagePublicId, // Save public_id
          subOtherImages: subOtherImageUrls,
          subOtherImagesPublicIds: subOtherImagesPublicIds, // Save public_ids
        });
      }
    }

    // Create new product
    const newProduct = new productModel({
      name,
      description,
      price,
      category,
      size,
      whatsapp,
      email,
      ownerEmail,
      mainImage: mainImageUrl,
      mainImagePublicId: mainImagePublicId, // Save public_id
      OtherImages: otherImageUrls,
      OtherImagesPublicIds: otherImagesPublicIds, // Save public_ids
      colors: parsedColors,
      subProducts,
      stock: stock || 0,
      vendorId: req.user.vendorId, // Extract from JWT token
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};

// Get all products for a vendor
export const getVendorProducts = async (req, res) => {
  try {
    // Use email from JWT token instead of query param
    const ownerEmail = req.user?.email;

    if (!ownerEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Vendor email not found in token" });
    }

    const products = await productModel
      .find({ ownerEmail })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Get all products (public - for browsing)
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const products = await productModel
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalCount = await productModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    console.log(
      "[updateProduct] req.files keys:",
      req.files && Object.keys(req.files),
    );
    console.log("[updateProduct] req.body.subProducts:", req.body.subProducts);
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      size,
      whatsapp,
      email,
      stock,
      colors,
    } = req.body;

    const product = await productModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update basic fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (size) product.size = size;
    if (whatsapp) product.whatsapp = whatsapp;
    if (email) product.email = email;
    if (stock !== undefined) product.stock = stock;

    // Update colors if provided
    if (colors) {
      if (typeof colors === "string") {
        try {
          product.colors = JSON.parse(colors);
        } catch (e) {
          product.colors = colors.split(",").map((c) => c.trim());
        }
      } else if (Array.isArray(colors)) {
        product.colors = colors;
      }
    }

    // Handle OtherImages upload if new files provided
    if (req.files) {
      const otherImageFiles = Array.isArray(req.files.OtherImages)
        ? req.files.OtherImages
        : req.files.OtherImages
          ? [req.files.OtherImages]
          : [];
      if (otherImageFiles.length > 0) {
        // Delete old other images from Cloudinary
        if (
          product.OtherImagesPublicIds &&
          product.OtherImagesPublicIds.length > 0
        ) {
          for (const publicId of product.OtherImagesPublicIds) {
            try {
              await cloudinary.uploader.destroy(publicId);
              console.log(`Deleted image from Cloudinary: ${publicId}`);
            } catch (deleteError) {
              console.error(`Failed to delete image ${publicId}:`, deleteError);
            }
          }
        }

        let otherImageUrls = [];
        let otherImagesPublicIds = [];
        for (const img of otherImageFiles) {
          try {
            const uploadResult = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "products/main", resource_type: "auto" },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                },
              );
              stream.end(img.data);
            });
            otherImageUrls.push(uploadResult.secure_url);
            otherImagesPublicIds.push(uploadResult.public_id);
          } catch (uploadError) {
            console.error("Other image upload error:", uploadError);
          }
        }
        if (otherImageUrls.length > 0) {
          product.OtherImages = otherImageUrls;
          product.OtherImagesPublicIds = otherImagesPublicIds;
        }
      }
    }

    // Handle main image update if new file provided
    if (req.files && req.files.mainImage) {
      const mainImageFile = req.files.mainImage;
      try {
        // Delete old main image from Cloudinary
        if (product.mainImagePublicId) {
          try {
            await cloudinary.uploader.destroy(product.mainImagePublicId);
            console.log(
              `Deleted main image from Cloudinary: ${product.mainImagePublicId}`,
            );
          } catch (deleteError) {
            console.error(`Failed to delete main image:`, deleteError);
          }
        }

        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products/main", resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          stream.end(mainImageFile.data);
        });
        product.mainImage = uploadResult.secure_url;
        product.mainImagePublicId = uploadResult.public_id;
      } catch (uploadError) {
        console.error("Main image upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: uploadError.message,
        });
      }
    }

    // Handle subProducts update if provided in the request (supports JSON string or array)
    if (req.body.subProducts) {
      let rawSubProducts = req.body.subProducts;
      let parsedSubProducts = [];

      if (typeof rawSubProducts === "string") {
        try {
          parsedSubProducts = JSON.parse(rawSubProducts);
        } catch (e) {
          parsedSubProducts = [];
        }
      } else if (Array.isArray(rawSubProducts)) {
        parsedSubProducts = rawSubProducts;
      }

      const newSubProducts = [];
      if (Array.isArray(parsedSubProducts)) {
        for (let i = 0; i < parsedSubProducts.length; i++) {
          const sp = parsedSubProducts[i];
          let subImageUrl = sp.subImage || "";
          let subImagePublicId = sp.subImagePublicId || "";

          if (req.files && req.files[`subImage${i}`]) {
            const subImageFile = req.files[`subImage${i}`];
            try {
              // Delete old sub-product image from Cloudinary
              if (sp.subImagePublicId) {
                try {
                  await cloudinary.uploader.destroy(sp.subImagePublicId);
                  console.log(
                    `Deleted sub-product image from Cloudinary: ${sp.subImagePublicId}`,
                  );
                } catch (deleteError) {
                  console.error(
                    `Failed to delete sub-product image:`,
                    deleteError,
                  );
                }
              }

              const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: "products/subs", resource_type: "auto" },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                  },
                );
                stream.end(subImageFile.data);
              });
              subImageUrl = uploadResult.secure_url;
              subImagePublicId = uploadResult.public_id;
            } catch (uploadError) {
              console.error(
                "Sub-product image upload error during update:",
                uploadError,
              );
              return res.status(500).json({
                success: false,
                message: "Sub-product image upload failed",
                error: uploadError.message,
              });
            }
          }

          // Upload sub-product other images if provided
          let subOtherImageUrls = [];
          let subOtherImagesPublicIds = [];
          for (let j = 0; j < 5; j++) {
            const otherImgKey = `subOtherImage${i}_${j}`;
            if (req.files && req.files[otherImgKey]) {
              const otherImgFile = req.files[otherImgKey];
              try {
                const uploadResult = await new Promise((resolve, reject) => {
                  const stream = cloudinary.uploader.upload_stream(
                    { folder: "products/subs", resource_type: "auto" },
                    (error, result) => {
                      if (error) reject(error);
                      else resolve(result);
                    },
                  );
                  stream.end(otherImgFile.data);
                });
                subOtherImageUrls.push(uploadResult.secure_url);
                subOtherImagesPublicIds.push(uploadResult.public_id);
              } catch (uploadError) {
                console.error(
                  "Sub-product other image upload error:",
                  uploadError,
                );
              }
            }
          }

          // If new other images were uploaded, delete old ones and use new list
          if (subOtherImageUrls.length > 0) {
            // Delete old sub-product other images from Cloudinary
            if (
              sp.subOtherImagesPublicIds &&
              sp.subOtherImagesPublicIds.length > 0
            ) {
              for (const publicId of sp.subOtherImagesPublicIds) {
                try {
                  await cloudinary.uploader.destroy(publicId);
                  console.log(
                    `Deleted sub-product other image from Cloudinary: ${publicId}`,
                  );
                } catch (deleteError) {
                  console.error(
                    `Failed to delete sub-product other image:`,
                    deleteError,
                  );
                }
              }
            }
          }

          newSubProducts.push({
            subName: sp.subName,
            subDescription: sp.subDescription,
            subPrice: sp.subPrice,
            subsize: sp.subsize,
            subImage: subImageUrl,
            subImagePublicId: subImagePublicId,
            subOtherImages:
              subOtherImageUrls.length > 0
                ? subOtherImageUrls
                : sp.subOtherImages || [],
            subOtherImagesPublicIds:
              subOtherImagesPublicIds.length > 0
                ? subOtherImagesPublicIds
                : sp.subOtherImagesPublicIds || [],
          });
        }
      }

      product.subProducts = newSubProducts;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Delete main image from Cloudinary
    if (product.mainImagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.mainImagePublicId);
        console.log(
          `Deleted main image from Cloudinary: ${product.mainImagePublicId}`,
        );
      } catch (deleteError) {
        console.error(
          `Failed to delete main image from Cloudinary:`,
          deleteError,
        );
      }
    }

    // Delete other images from Cloudinary
    if (
      product.OtherImagesPublicIds &&
      product.OtherImagesPublicIds.length > 0
    ) {
      for (const publicId of product.OtherImagesPublicIds) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted other image from Cloudinary: ${publicId}`);
        } catch (deleteError) {
          console.error(
            `Failed to delete image ${publicId} from Cloudinary:`,
            deleteError,
          );
        }
      }
    }

    // Delete sub-product images from Cloudinary
    if (product.subProducts && product.subProducts.length > 0) {
      for (const subProduct of product.subProducts) {
        // Delete sub-product main image
        if (subProduct.subImagePublicId) {
          try {
            await cloudinary.uploader.destroy(subProduct.subImagePublicId);
            console.log(
              `Deleted sub-product image from Cloudinary: ${subProduct.subImagePublicId}`,
            );
          } catch (deleteError) {
            console.error(
              `Failed to delete sub-product image from Cloudinary:`,
              deleteError,
            );
          }
        }

        // Delete sub-product other images
        if (
          subProduct.subOtherImagesPublicIds &&
          subProduct.subOtherImagesPublicIds.length > 0
        ) {
          for (const publicId of subProduct.subOtherImagesPublicIds) {
            try {
              await cloudinary.uploader.destroy(publicId);
              console.log(
                `Deleted sub-product other image from Cloudinary: ${publicId}`,
              );
            } catch (deleteError) {
              console.error(
                `Failed to delete sub-product other image ${publicId} from Cloudinary:`,
                deleteError,
              );
            }
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// Add review to product
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, comment } = req.body;

    if (!userId || !rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    product.reviews.push({ userId, rating, comment });

    // Calculate average rating
    const totalRating = product.reviews.reduce(
      (sum, rev) => sum + rev.rating,
      0,
    );
    product.rating =
      Math.round((totalRating / product.reviews.length) * 10) / 10;

    const updatedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message,
    });
  }
};

// Toggle product active status
export const toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    product.isActive = !product.isActive;
    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${updatedProduct.isActive ? "activated" : "deactivated"} successfully`,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error toggling product status:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling product status",
      error: error.message,
    });
  }
};

// Get product stats
export const getProductStats = async (req, res) => {
  try {
    // Use email from JWT token instead of query param
    const ownerEmail = req.user?.email;

    if (!ownerEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Vendor email not found in token" });
    }

    const totalProducts = await productModel.countDocuments({ ownerEmail });
    const activeProducts = await productModel.countDocuments({
      ownerEmail,
      isActive: true,
    });
    const avgRating = await productModel.aggregate([
      { $match: { ownerEmail } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        inactiveProducts: totalProducts - activeProducts,
        averageRating: avgRating[0]?.avgRating || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
      error: error.message,
    });
  }
};
