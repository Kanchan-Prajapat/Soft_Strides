import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import API from "../api/api";
import "../styles/theme.css";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadBanners = async () => {
    const res = await API.get("/banners");
    setBanners(res.data);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleCreate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);

      await API.post("/banners", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setImage(null);
      loadBanners();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBanner = async (id) => {
    await API.put(`/banners/${id}/toggle`);
    loadBanners();
  };

  const deleteBanner = async (id) => {
    await API.delete(`/banners/${id}`);
    loadBanners();
  };

  return (
    <PageLayout title="Banners">
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
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button
            className="btn"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Add Banner"}
          </button>
        </div>
      </div>

      <div className="card">
        <h3>All Banners</h3>

        <table className="table">
          <thead>
  <tr>
    <th>Image</th>
    <th>Title</th>
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

      <td>{b.isActive ? "Active" : "Disabled"}</td>

      <td>
        <button
          className="btn-small"
          onClick={() => toggleBanner(b._id)}
        >
          Toggle
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
    </PageLayout>
  );
};

export default Banners;
