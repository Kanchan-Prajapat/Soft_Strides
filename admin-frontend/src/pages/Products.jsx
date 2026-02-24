import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import TableCard from "../components/TableCard";
import ProductModal from "../components/ProductModal";
import ProductViewModal from "../components/ProductViewModal";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../api/products";
import { fetchCategories } from "../api/categories";
import { useToast } from "../components/Toast";
import "../styles/theme.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categoryFilter = searchParams.get("category");


  const { showToast } = useToast();

  const load = async () => {
    const p = await fetchProducts();
    const c = await fetchCategories();
    setProducts(p);
    setCategories(c);
    console.log("Reloaded:", p);

  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    await deleteProduct(id);
    showToast("Product deleted", "success");
    load();
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter
      ? p.category?._id === categoryFilter
      : true;

    return matchesSearch && matchesCategory;
  });


  return (
    <PageLayout title="Products">
      <TableCard
        title="Product Catalog"
        right={
          <div className="products-header">

            <button
              className="btn add-btn"
              onClick={() => {
                setEditProduct(null);
                setModalOpen(true);
              }}
            >
              Add Product
            </button>

            <div className="table-toolbar">
              <input
                className="input search-input"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>


        }
      >


        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th style={{ width: 220 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-row">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td><img
                    src={p.images?.[0] || "/placeholder.png"}
                    alt={p.name}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 8
                    }}
                  />
                  </td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => setSelectedProduct(p)}
                      >
                        View
                      </button>


                      <button
                        className="view-btn"
                        onClick={() => {
                          setEditProduct(p);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="view-btn danger"
                        onClick={() => handleDelete(p._id)}
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

      {modalOpen && (
        <ProductModal
          product={editProduct}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSuccess={load}
        />
      )}
      {selectedProduct && (
        <ProductViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}



    </PageLayout>
  );
};

export default Products;
