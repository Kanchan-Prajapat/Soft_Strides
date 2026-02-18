//admin/pages/flashSales.jsx
import { useEffect, useState } from "react";
import { getFlashSalesAdmin, createFlashSale } from "../api/flash-sale";
import API from "../api/api"; // for products only
import PageLayout from "../components/PageLayout";
import TableCard from "../components/TableCard";
import "../styles/theme.css";
import { deleteFlashSale } from "../api/flash-sale";

const FlashSales = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sales, setSales] = useState([]);

useEffect(() => {
  loadProducts();
  loadSales();
}, []);

  const loadProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const loadSales = async () => {
    const res = await API.get("/flash-sales/admin");
    setSales(res.data);
  };


const handleDelete = async (id) => {
  if (!window.confirm("Delete this flash sale?")) return;

  await deleteFlashSale(id);
  loadSales();
};


 const handleCreate = async () => {
  await createFlashSale({
    startDate,
    endDate,
    products: selectedProducts,
  });

  setSelectedProducts([]);
  loadSales();
};


  return (
    <PageLayout title="Flash Sales">

      {/* CREATE SECTION */}
      <TableCard title="Create Flash Sale">

        <div className="flash-form">

         
            <div className="date-group">
              <div>
                <label className="label">Start Date</label>
                <input type="datetime-local" className="input"  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)} />
              </div>

              <div>
                <label className="label">End Date</label>
                <input type="datetime-local" className="input" value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

 

          <h3 style={{ marginTop: 20 }}>Select Products</h3>

          <div className="product-select-grid">
            {products.map((p) => (
              <label key={p._id} className="product-checkbox">
                <input
                  type="checkbox"
                  value={p._id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts([...selectedProducts, p._id]);
                    } else {
                      setSelectedProducts(
                        selectedProducts.filter((id) => id !== p._id)
                      );
                    }
                  }}
                />
                {p.name}
              </label>
            ))}
          </div>

          <button
            className="btn"
            style={{ marginTop: 20 }}
            onClick={handleCreate}
          >
            Create Flash Sale
          </button>

        </div>
      </TableCard>

      {/* EXISTING SALES */}
      <TableCard title="Existing Flash Sales">

        {sales.length === 0 ? (
          <p className="empty-state">No flash sales created</p>
        ) : (
          <table className="table">
           <thead>
  <tr>
    <th>Start</th>
    <th>End</th>
    <th>Products</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {sales.map((sale) => (
    <tr key={sale._id}>
      <td>{new Date(sale.startDate).toLocaleString()}</td>
      <td>{new Date(sale.endDate).toLocaleString()}</td>
      <td>{sale.products.length}</td>
      <td>
  {new Date() > new Date(sale.endDate)
    ? "Expired"
    : "Active"}
</td>
      <td>
        <button
          className="btn danger"
          onClick={() => handleDelete(sale._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        )}

      </TableCard>

    </PageLayout>
  );
};

export default FlashSales;
