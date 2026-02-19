import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import API from "../api/api";
import "../styles/theme.css";

const Banners = () => {
  const [banners, setBanners] = useState([]);

  // Create Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

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

  // ================= CREATE / UPDATE =================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) formData.append("image", image);

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
    setImage(null);
    setEditId(null);
    setShowModal(false);
  };

  return (
    <PageLayout title="Banners">
      {/* ================= ADD BANNER ================= */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Add Banner</h3>

        <div style={{ display: "flex", gap: 10 }}>
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

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button
            className="btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Add Banner"}
          </button>
        </div>
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
                  <img
                    src={b.image}
                    alt={b.title}
                    style={{
                      width: "120px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </td>

                <td>{b.title}</td>
                <td>{b.description}</td>
                <td>{b.isActive ? "Active" : "Disabled"}</td>

                <td>
                  <button
                    className="btn-small"
                    onClick={() => handleEdit(b)}
                  >
                    Edit
                  </button>

                  <button
                    className="danger-btn"
                    onClick={() => deleteBanner(b._id)}
                  >
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

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <div style={{ marginTop: 10 }}>
              <button
                className="btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Banner"}
              </button>

              <button
                className="danger-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Banners;
