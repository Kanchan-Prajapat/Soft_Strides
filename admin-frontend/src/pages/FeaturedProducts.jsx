import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import PageLayout from "../components/PageLayout";
import TableCard from "../components/TableCard";
import ProductModal from "../components/ProductModal";
import ProductViewModal from "../components/ProductViewModal";
import SortableProductRow from "../components/SortableProductRow";

import {
  fetchFeaturedProducts,
  deleteProduct,
  toggleProductVisibility,
  reorderFeaturedProducts,
} from "../api/products";

import { fetchCategories } from "../api/categories";
import { useToast } from "../components/Toast";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { showToast } = useToast();

  const load = async () => {
    try {
      const p = await fetchFeaturedProducts();
      const c = await fetchCategories();

      setProducts(p);
      setCategories(c);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    )
      return;

    await deleteProduct(id);

    showToast("Product deleted", "success");

    load();
  };

  const handleVisibility = async (id) => {
    try {
      const res = await toggleProductVisibility(id);

      showToast(res.message, "success");

      load();
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          "Something went wrong",
        "error"
      );
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex(
      (p) => p._id === active.id
    );

    const newIndex = products.findIndex(
      (p) => p._id === over.id
    );

    const reordered = arrayMove(
      products,
      oldIndex,
      newIndex
    );

    setProducts(reordered);

    try {
      await reorderFeaturedProducts(reordered);

      showToast(
        "Featured products reordered",
        "success"
      );
    } catch (err) {
      showToast(
        "Failed to reorder",
        "error"
      );

      load();
    }
  };

  return (
    <PageLayout title="Featured Products">
      <TableCard
        title="Featured Products"
        right={
          <div className="table-toolbar">
            <input
              className="input search-input"
              placeholder="Search featured products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        }
      >
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredProducts.map(
              (p) => p._id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 45 }}></th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Original Price</th>
                  <th>Discount Price</th>
                  <th>Stock</th>
                  <th style={{ width: 220 }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="empty-row"
                    >
                      No Featured Products
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <SortableProductRow
                    
                      key={p._id}
                      product={p}
                      onView={
                        setSelectedProduct
                      }
                      onEdit={(product) => {
                        setEditProduct(
                          product
                        );
                        setModalOpen(true);
                      }}
                      onDelete={
                        handleDelete
                      }
                      onVisibility={
                        handleVisibility
                      }
                    />
                  ))
                )}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </TableCard>

      {modalOpen && (
        <ProductModal
          product={editProduct}
          categories={categories}
          onClose={() =>
            setModalOpen(false)
          }
          onSuccess={() => {
            load();
            setModalOpen(false);
          }}
        />
      )}

      {selectedProduct && (
        <ProductViewModal
          product={selectedProduct}
          onClose={() =>
            setSelectedProduct(null)
          }
        />
      )}
    </PageLayout>
  );
};

export default FeaturedProducts;