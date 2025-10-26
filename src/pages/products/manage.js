import React, { useEffect, useState } from "react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [shops, setShops] = useState([]);
  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    descEn: "",
    descAr: "",
    brand: "",
    countInStock: 1,
    price: "",
    image: "",
    subcategoryId: "",
    shopId: "",
    featured: false,
    topselling: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🧩 Fetch products, subcategories, and shops on mount
  useEffect(() => {
    fetchProducts();
    fetchSubcategories();
    fetchShops();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await fetch("/api/subcategories");
      const data = await res.json();
      setSubcategories(data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await fetch("/api/shops");
      const data = await res.json();
      setShops(data);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  // 🧩 Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // 🧩 Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    //form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET); // Cloudinary preset
    form.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
        {
          method: "POST",
          body: form,
        }
      );
      const data = await res.json();
      setFormData({ ...formData, image: data.secure_url });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Please upload an image first.");

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/products/${editingId}` : "/api/products";

    const productData = {
      name: { en: formData.nameEn, ar: formData.nameAr },
      description: { en: formData.descEn, ar: formData.descAr },
      brand: formData.brand,
      countInStock: Number(formData.countInStock),
      price: Number(formData.price),
      image: formData.image,
      subcategoryId: formData.subcategoryId || null,
      shopId: formData.shopId || null,
      featured: formData.featured,
      topselling: formData.topselling,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      alert(editingId ? "Product updated!" : "Product added!");
      resetForm();
      fetchProducts();
    } else {
      console.error("Error saving product:", await res.text());
    }
  };

  const resetForm = () => {
    setFormData({
      nameEn: "",
      nameAr: "",
      descEn: "",
      descAr: "",
      brand: "",
      countInStock: 1,
      price: "",
      image: "",
      subcategoryId: "",
      shopId: "",
      featured: false,
      topselling: false,
    });
    setEditingId(null);
  };

  // 🧩 Edit product
  const handleEdit = (product) => {
    setFormData({
      nameEn: product.name.en,
      nameAr: product.name.ar,
      descEn: product.description.en,
      descAr: product.description.ar,
      brand: product.brand,
      countInStock: product.countInStock,
      price: product.price,
      image: product.image,
      subcategoryId: product.subcategoryId?._id || "",
      shopId: product.shopId?._id || "",
      featured: product.featured,
      topselling: product.topselling,
    });
    setEditingId(product._id);
  };

  // 🧩 Delete product
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Products</h1>

      {/* Product Form */}
      <form className="form-container" onSubmit={handleSubmit} >
        <input className="form-field" name="nameEn" placeholder="Name (EN)" value={formData.nameEn} onChange={handleChange} required />
        <input className="form-field" name="nameAr" placeholder="Name (AR)" value={formData.nameAr} onChange={handleChange} required />
        <input className="form-field" name="descEn" placeholder="Description (EN)" value={formData.descEn} onChange={handleChange} />
        <input className="form-field" name="descAr" placeholder="Description (AR)" value={formData.descAr} onChange={handleChange} />
        <input className="form-field" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />
        <input className="form-field" name="countInStock" type="number" placeholder="Count in stock" value={formData.countInStock} onChange={handleChange} />
        <input className="form-field" name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />

        {/* Subcategory Select */}
        <select className="form-field" name="subcategoryId" value={formData.subcategoryId} onChange={handleChange} required>
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name?.en || sub.name}
            </option>
          ))}
        </select>

        {/* Shop Select */}
        <select className="form-field" name="shopId" value={formData.shopId} onChange={handleChange} required>
          <option value="">Select Shop</option>
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.name}
            </option>
          ))}
        </select>

        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {loading ? <p>Uploading image...</p> : formData.image && <img src={formData.image} alt="Uploaded" width="100" />}

        <label>
          Featured
          <input className="form-field"  type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
        </label>
        <label>
          Top Selling
          <input className="form-field" type="checkbox" name="topselling" checked={formData.topselling} onChange={handleChange} />
        </label>

        <button className="form-field" type="submit">{editingId ? "Update Product" : "Add Product"}</button>
      </form>

      {/* Product List */}
      <div>
        <h2>All Products</h2>
        <div className="images-container-manage" >
          {products.map((p) => (
            <div className="image-cart-manage" key={p._id} >
              <img src={p.image} alt={p.name.en} width="100%" />
              <h3>{p.name.en}</h3>
              <p>{p.price} EGP</p>
              <button onClick={() => handleEdit(p)}>Edit</button>
              <button onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;




/*
import React, { useState, useEffect } from "react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    price: "",
    image: "",
    categoryId: "",
    featured: false,
    topselling: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
        const res = await fetch("/api/products");
        const data = await res.json();
        
        // ✅ Handle both possible API formats
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Unexpected response format:", data);
          setProducts([]);
        }
        
        setProducts(data);
    } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
    }

    //setProducts(data);
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ✅ Upload image to Cloudinary
  const uploadImage = async () => {
    if (!imageFile) return form.image;
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET); // Cloudinary preset
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const file = await res.json();
    return file.secure_url;
  };

  // ✅ Add or Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadImage();

    const productData = {
      name: { en: form.nameEn, ar: form.nameAr },
      description: { en: form.descriptionEn, ar: form.descriptionAr },
      price: Number(form.price),
      image: imageUrl,
      categoryId: form.categoryId,
      featured: form.featured,
      topselling: form.topselling,
    };

    if (editingId) {
      await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      setEditingId(null);
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
    }

    setForm({
      nameEn: "",
      nameAr: "",
      descriptionEn: "",
      descriptionAr: "",
      price: "",
      image: "",
      categoryId: "",
      featured: false,
      topselling: false,
    });
    setImageFile(null);
    fetchProducts();
  };

  // ✅ Edit product
  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      nameEn: product.name.en,
      nameAr: product.name.ar,
      descriptionEn: product.description.en,
      descriptionAr: product.description.ar,
      price: product.price,
      image: product.image,
      categoryId: product.categoryId || "",
      featured: product.featured,
      topselling: product.topselling,
    });
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Products</h1>

      
      <form className="form-container" onSubmit={handleSubmit} >
        <div  className="form-field"  >
          <label>English Name:</label>
          <input name="nameEn" value={form.nameEn} onChange={handleChange} required />
        </div>
        <div className="form-field" >
          <label>Arabic Name:</label>
          <input name="nameAr" value={form.nameAr} onChange={handleChange} required />
        </div>
        <div  className="form-field" >
          <label>English Description:</label>
          <textarea name="descriptionEn" value={form.descriptionEn} onChange={handleChange} />
        </div>
        <div className="form-field" >
          <label>Arabic Description:</label>
          <textarea name="descriptionAr" value={form.descriptionAr} onChange={handleChange} />
        </div>
        <div className="form-field" >
          <label>Price:</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} required />
        </div>
        <div className="form-field" >
          <label>Category ID:</label>
          <input name="categoryId" value={form.categoryId} onChange={handleChange} />
        </div>
        <div className="form-field-checkbox">
          <label>Featured:</label>
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
        </div>
        <div className="form-field-checkbox">
          <label>Top Selling:</label>
          <input type="checkbox" name="topselling" checked={form.topselling} onChange={handleChange} />
        </div>
        <div className="form-field" >
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          {form.image && <img src={form.image} alt="preview" style={{ width: "100px", marginTop: "10px" }} />}
        </div>
        <div className="form-field" >
            <button type="submit" >
                {editingId ? "Update Product" : "Add Product"}
            </button>
        </div>
      </form>

      
      <div>
        <h2>All Products</h2>
        {products.length === 0 && <p>No products found</p>}
        <div>
            {Array.isArray(products) && products.length > 0 && (
            products.map((p) => (
                <div key={p._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                    <p>{console.log("✅ product object:", p)}</p>
                    <img src={p.image} alt={p.name.en} style={{ width: "100px" }} />
                    <h3>{p.name.en}</h3>
                    <p>{p.description.en}</p>
                    <p>💲{p.price}</p>
                    <button onClick={() => handleEdit(p)}>
                        Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} style={{ marginLeft: "10px" }}>
                        Delete
                    </button>
                </div>
            )))}
        </div>
        
      </div>
    </div>
  );
};

export default ManageProducts;
*/