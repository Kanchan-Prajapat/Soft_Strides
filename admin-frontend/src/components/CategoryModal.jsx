import { useState } from "react";
import {
  createCategory,
  updateCategory,
} from "../api/categories";
import "../styles/theme.css";

const CategoryModal = ({ category, onClose, onSuccess }) => {
  const [name, setName] = useState(category?.name || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(category?.image || "");

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("name", name);

    if (image) {
      form.append("image", image);
    }

    if (category) {
      await updateCategory(category._id, form);
    } else {
      await createCategory(form);
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <input
          className="input"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 10,
              marginTop: 12,
              border: "1px solid #222",
            }}
          />
        )}

        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 10,
          }}
        >
          <button className="btn" onClick={handleSubmit}>
            Save
          </button>

          <button
            className="btn"
            onClick={onClose}
            style={{ borderColor: "#444" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
