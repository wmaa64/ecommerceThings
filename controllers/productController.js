//import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Product from '../models/Product';

// ✅ forces model registration in Mongoose’s internal map before populate runs.
// to ensure the populate work: await Product.find().populate("subcategoryId", "name.en name.ar description.en description.ar");
import "../models/Subcategory.js";

import { upload } from '../utils/cloudinaryConfig';

const getProducts = async () => {
    // Fetch products from the database
    const products = await Product.find().populate("subcategoryId", "name.en");
    return products;
};

const getProductById = async (id) => {
    // Fetch product from the database
    const product = await Product.findById(id);
    return product;
};

const getFeaturedProducts = async () => {
    // Fetch featured products (assuming there's a 'featured' field in the Product model)
    const products = await Product.find({ featured: true }).limit(5);
    return products;
};

const getTopSellingProducts = async () => {
   // Fetch featured products (assuming there's a 'featured' field in the Product model)
    const products = await Product.find({ topselling: true }).limit(5);
    return products;
};

const getTodayProducts = async () => {
    // Fetch products from the database
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    const products = await Product.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    return products;
};

const getProductsByQuery = async (searchTerm) => {
  try {
    // Use MongoDB's text search or regex search for partial matches
    const products = await Product.find({
      $or: [
        {name: { $regex: searchTerm, $options: 'i' }},          // Search in name
        {category: { $regex: searchTerm, $options: 'i' }},
        {description: { $regex: searchTerm, $options: 'i' }}
      ]
    });

    return products;
  
  } catch (error) {
    // Handle any errors
    console.error('Error fetching products:', error);
    throw new Error('Unable to fetch products.');
  }
};

const getProductsForUser = async (userId) => {
  try {
    const products = await Product.find().populate({path: 'shopId', match: { userId: userId }, select: 'name userId',  });

    // Keep only products where shopId matched (user owns the shop)
    const filteredProducts = products.filter((product) => product.shopId !== null);
    return filteredProducts;
  } catch (error) {
    console.error('Error fetching products for user:', error);
    throw new Error('Unable to fetch user products.');
  }
};

const getSubCategoriesProducts = async (subcategoryIdsString) => {
  try {
    // Convert the comma-separated string into ObjectId array
    const subcategoryIds = subcategoryIdsString
      ? subcategoryIdsString.split(',').map(id => new mongoose.Types.ObjectId(id.trim()))  : [];

    const products = await Product.find({ subcategoryId: { $in: subcategoryIds } });
    return products;
  } catch (error) {
    console.error('Error fetching products by subcategories:', error);
    throw new Error('Unable to fetch products by subcategories.');
  }
};

//-----------

// create a new Product
const createProduct =  async (data) => {
    const newProduct = new Product(data);
    return await newProduct.save();
}

// Update a category 
const updateProduct = async (id, data) => {
    return  await Product.findByIdAndUpdate(id, { $set: data }, { new: true });
};


// Delete a category
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};


const uploadProductImage = (req, res) => {
  // Use Multer's `upload.single('image')` inside the controller
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Image upload failed', error: err.message });
    }

    // If no error, the file is uploaded successfully, and we can access it
    try {
      // The uploaded image's URL will be available in req.file.path (from Cloudinary)
      const imageUrl = req.file.path;
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: 'Error handling image upload', error });
    }
  });
};

export { getProducts, getProductById, getProductsByQuery, getTodayProducts, getProductsForUser, 
         getSubCategoriesProducts, createProduct, updateProduct, deleteProduct, uploadProductImage, getFeaturedProducts,
         getTopSellingProducts };