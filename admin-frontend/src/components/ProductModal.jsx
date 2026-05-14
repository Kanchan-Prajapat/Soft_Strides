import { useState } from "react";
import { createProduct, updateProduct } from "../api/products";
import "./ProductModal.css";
import { useToast } from "../components/Toast";

const ProductModal = ({ product, categories, onClose, onSuccess }) => {
  const [name, setName] = useState(product?.name || "");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || "");
  const [discountPrice, setDiscountPrice] = useState(product?.discountPrice || "");
  const [stock, setStock] = useState(product?.stock || "");
  const [category, setCategory] = useState(
    product?.category?._id ?? ""
  );

  const [sizes, setSizes] = useState(
    product?.sizes ? product.sizes.join(",") : ""
  );
const [descPoints, setDescPoints] = useState(
  product?.description?.length ? product.description : [""]
);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(product?.images || []);
  const [fit, setFit] = useState(product?.fit || "Fit");
  const [fabric, setFabric] = useState(product?.fabric || "Cotton");
  const [length, setLength] = useState(product?.length || "Regular");
  const [closure, setClosure] = useState(product?.closure || "No Closure");
const { showToast } = useToast();
 


  const handleSubmit = async () => {
  try {
    const form = new FormData();

    form.append("name", name);
    form.append("originalPrice", originalPrice);
    form.append("discountPrice", discountPrice);
    form.append("stock", stock);
    form.append("category", category);
    form.append("sizes", sizes);
    form.append("description", JSON.stringify(descPoints));
    form.append("fit", fit);
    form.append("fabric", fabric);
    form.append("length", length);
    form.append("closure", closure);

    if (images.length > 0) {
      images.forEach((img) => {
        form.append("images", img);
      });
    }

    if (product) {
      await updateProduct(product._id, form);
      showToast("Product updated successfully", "success");
    } else {
      await createProduct(form);
      showToast("Product created successfully", "success");
    }

    onSuccess();
    onClose();

  } catch (err) {
    showToast("Something went wrong", "error");
    console.error(err);
  }
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

       {descPoints.map((point, i) => (
  <div key={i} style={{ display: "flex", gap: 6 }}>
    <input
      value={point}
      onChange={(e) => {
        const updated = [...descPoints];
        updated[i] = e.target.value;
        setDescPoints(updated);
      }}
      placeholder={`Point ${i + 1}`}
    />

    <button
      className="remove_btn"
      onClick={() =>
        setDescPoints(descPoints.filter((_, index) => index !== i))
      }
    >
      remove
    </button>
  </div>
))}

        <button className="add-btn" onClick={() => setDescPoints([...descPoints, ""])}>
          + Add Point For Description
        </button>

       

     <input
  type="number"
  placeholder="Original Price"
  value={originalPrice}
  onChange={(e) => setOriginalPrice(e.target.value)}
/>

<input
  type="number"
  placeholder="Discounted Price"
  value={discountPrice}
  onChange={(e) => setDiscountPrice(e.target.value)}
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
          type="text"
          placeholder="Available Sizes (comma separated e.g. S,M,L,XL)"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
        />

        <select value={fit} onChange={(e) => setFit(e.target.value)}>
          <option>Select Fit</option>
          <option>Regular</option>
          <option>Oversized</option>
          <option>Slim</option>
          <option>Relaxed</option>
          <option>Other</option>
        </select>

        <select value={fabric} onChange={(e) => setFabric(e.target.value)}>
          <option>Select Fabric</option>
          <option>Cotton</option>
          <option>Combed Cotton</option>
          <option>Cotton Lycra</option>
          <option>Jersey</option>
          <option>Tri-blend</option>
          <option>Polyester</option>
          <option>Poplin</option>
          <option>Oxford</option>
          <option>Linen</option>
          <option>Twill</option>
          <option>Other</option>
        </select>

        <select value={length} onChange={(e) => setLength(e.target.value)}>
          <option>Select Length</option>
          <option>Regular</option>
          <option>Long</option>
          <option>Short</option>
          <option>Other</option>
        </select>

        <select value={closure} onChange={(e) => setClosure(e.target.value)}>
          <option>Select Closure</option>
          <option>No Closure</option>
          <option>Button</option>
          <option>Zip</option>
          <option>Other</option>
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
