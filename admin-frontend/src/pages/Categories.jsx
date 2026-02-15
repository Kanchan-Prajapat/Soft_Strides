import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import TableCard from "../components/TableCard";
import CategoryModal from "../components/CategoryModal";
import {
  fetchCategories,
  deleteCategory,
} from "../api/categories";
import { useToast } from "../components/Toast";
import "../styles/theme.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const { showToast } = useToast();

  const load = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      showToast("Category deleted", "success");
      load();
    } catch (err) {
      showToast(
        err.response?.data?.message ||
        "Cannot delete category with products",
        "error"
      );
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout title="Categories">
      <TableCard
        title="Product Categories"
        right={
          <button
            className="btn"
            onClick={() => {
              setEditCategory(null);
              setModalOpen(true);
            }}
          >
            Add Category
          </button>
        }
      >
        {/* SEARCH BAR */}
        <div className="table-toolbar">
          <input
            className="input search-input"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Products</th>
              <th>Created</th>
              <th style={{ width: 220 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No categories found
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c._id}>
                  <td>
                    <img
                      src={c.image}
                      alt={c.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #222",
                      }}
                    />
                  </td>

                  <td>
                    <span
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() =>
                        window.location.href = `/products?category=${c._id}`
                      }
                    >
                      {c.name}
                    </span>
                  </td>

                  <td>
                    <span className="badge">
                      {c.productCount || 0}
                    </span>
                  </td>

                  <td>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => {
                          setEditCategory(c);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="view-btn danger"
                        onClick={() =>
                          handleDelete(c._id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableCard>

      {/* MODAL */}
      {modalOpen && (
        <CategoryModal
          category={editCategory}
          onClose={() => setModalOpen(false)}
          onSuccess={load}
        />
      )}
    </PageLayout>
  );
};

export default Categories;
