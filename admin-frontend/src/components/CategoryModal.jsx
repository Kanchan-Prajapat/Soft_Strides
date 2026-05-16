import { useState } from "react";
import { createCategory, updateCategory } from "../api/categories";
import "../styles/theme.css";
import ImageCropper from "./ImageCropper";

const CategoryModal = ({ category, onClose, onSuccess }) => {
  const [name, setName] = useState(category?.name || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(category?.image || "");
  const [cropImage, setCropImage] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropImage(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("name", name);
    if (imageFile) {
      form.append("image", imageFile, imageFile.name || "category.jpg");
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
    <>
      {/* CROPPER — 1:1 square for category thumbnails */}
      {cropImage && (
        <ImageCropper
          image={cropImage}
          defaultAspect={1}
          onClose={() => setCropImage(null)}
          onCropDone={(croppedFile) => {
            setImageFile(croppedFile);
            setPreview(URL.createObjectURL(croppedFile));
            setCropImage(null);
          }}
        />
      )}

      <div className="modal-overlay">
        <div className="modal">
          <h2>{category ? "Edit Category" : "Add Category"}</h2>

          <input
            className="input"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label style={{ color: "#aaa", fontSize: 13, marginBottom: 6, display: "block" }}>
            Category Image (1:1 square)
          </label>
          <input type="file" accept="image/*" onChange={handleImageSelect} />

          {preview && (
            <div style={{ marginTop: 12 }}>
              <div
                style={{
                  width: 120,
                  height: 120,
                  overflow: "hidden",
                  borderRadius: 10,
                  border: "1px solid #222",
                  background: "#111",
                }}
              >
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <button
                className="danger-btn"
                style={{ marginTop: 6, fontSize: 11 }}
                onClick={() => { setPreview(""); setImageFile(null); }}
              >
                Remove
              </button>
            </div>
          )}

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button className="btn" onClick={handleSubmit}>
              Save
            </button>
            <button className="btn" onClick={onClose} style={{ borderColor: "#444" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryModal;
