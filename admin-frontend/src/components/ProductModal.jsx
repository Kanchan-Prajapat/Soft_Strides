import { useState } from "react";
import { createProduct, updateProduct } from "../api/products";
import "./ProductModal.css";

const ProductModal = ({ product, categories, onClose, onSuccess }) => {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [stock, setStock] = useState(product?.stock || "");
const [category, setCategory] = useState(
  product?.category?._id ?? ""
);
  const [description, setDescription] = useState(product?.description || "");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(product?.images || []);



  const handleSubmit = async () => {
    const form = new FormData();

    form.append("name", name);
    form.append("price", price);
    form.append("stock", stock);
    form.append("category", category);
    form.append("description", description);

  if (images.length > 0) {
  images.forEach((img) => {
    form.append("images", img);
  });
}

    if (product) {
      await updateProduct(product._id, form);
    } else {
      await createProduct(form);
    }

    onSuccess();
    onClose();
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{product ? "Edit Product" : "Add Product"}</h2>

        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Product description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>


        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
<input
  type="file"
  multiple
  onChange={(e) => {
  const files = Array.from(e.target.files);
  setImages(files);

  const previewUrls = files.map((file) =>
    URL.createObjectURL(file)
  );

  setPreview(previewUrls);
}}
/>
<div style={{ display: "flex", gap: 10, marginTop: 10 }}>
  {preview.map((src, i) => (
    <img
      key={i}
      src={src}
      alt="preview"
      style={{
        width: 80,
        height: 80,
        objectFit: "cover",
        borderRadius: 8,
        border: "1px solid #333"
      }}
    />
  ))}
</div>


        <div style={{ marginTop: 12 }}>
          <button className="view-btn" onClick={handleSubmit}>
            Save
          </button>
          <button className="view-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
