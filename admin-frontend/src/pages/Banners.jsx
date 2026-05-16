import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import API from "../api/api";
import "../styles/theme.css";
import ImageCropper from "../components/ImageCropper";

const Banners = () => {
  const [banners, setBanners] = useState([]);

  // Create Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cropImage, setCropImage] = useState(null);

  // Edit State
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  // ================= LOAD BANNERS =================
  const loadBanners = async () => {
    try {
      const res = await API.get("/banners");
      setBanners(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // ================= IMAGE SELECT → OPEN CROPPER =================
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropImage(reader.result);
    reader.readAsDataURL(file);
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (imageFile) formData.append("image", imageFile, imageFile.name || "banner.jpg");

      if (editId) {
        await API.put(`/banners/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/banners", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      loadBanners();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (banner) => {
    setTitle(banner.title || "");
    setDescription(banner.description || "");
    setPreview(banner.image || null);
    setImageFile(null);
    setEditId(banner._id);
    setShowModal(true);
  };

  // ================= DELETE =================
  const deleteBanner = async (id) => {
    try {
      await API.delete(`/banners/${id}`);
      loadBanners();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    setPreview(null);
    setCropImage(null);
    setEditId(null);
    setShowModal(false);
  };

  // ================= FORM BODY (reused for Add + Edit) =================
  const FormBody = () => (
    <div className="banner-form">
      <input
        className="input"
        placeholder="Banner Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="input"
        placeholder="Banner Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label style={{ color: "#aaa", fontSize: 13, marginBottom: 6, display: "block" }}>
        Banner Image (16:9 landscape recommended)
      </label>
      <input type="file" accept="image/*" onChange={handleImageSelect} />

      {preview && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              aspectRatio: "16/9",
              overflow: "hidden",
              borderRadius: 8,
              border: "1px solid #333",
              background: "#111",
            }}
          >
            <img
              src={preview}
              alt="Banner Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <button
            className="danger-btn"
            style={{ marginTop: 8 }}
            onClick={() => { setPreview(null); setImageFile(null); }}
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* CROPPER — 16:9 for banners */}
      {cropImage && (
        <ImageCropper
          image={cropImage}
          defaultAspect={16 / 9}
          onClose={() => setCropImage(null)}
          onCropDone={(croppedFile) => {
            setImageFile(croppedFile);
            setPreview(URL.createObjectURL(croppedFile));
            setCropImage(null);
          }}
        />
      )}

      <PageLayout title="Banners">
        {/* ================= ADD BANNER ================= */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3>Add Banner</h3>
          <FormBody />
          <button
            className="btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: 12 }}
          >
            {loading ? "Processing..." : "Add Banner"}
          </button>
        </div>

        {/* ================= TABLE ================= */}
        <div className="card">
          <h3>All Banners</h3>

          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {banners.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div
                      style={{
                        width: 160,
                        aspectRatio: "16/9",
                        overflow: "hidden",
                        borderRadius: 6,
                        background: "#111",
                      }}
                    >
                      <img
                        src={b.image}
                        alt={b.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  </td>

                  <td>{b.title}</td>
                  <td>{b.description}</td>
                  <td>{b.isActive ? "Active" : "Disabled"}</td>

                  <td>
                    <button className="btn-small" onClick={() => handleEdit(b)}>
                      Edit
                    </button>

                    <button className="danger-btn" onClick={() => deleteBanner(b._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= EDIT MODAL ================= */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Banner</h3>
              <FormBody />
              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <button className="btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Updating..." : "Update Banner"}
                </button>
                <button className="danger-btn" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </PageLayout>
    </>
  );
};

export default Banners;
