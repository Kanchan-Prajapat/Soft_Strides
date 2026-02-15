import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import StatCard from "../components/StatCard";
import { fetchDashboardStats } from "../api/dashboards";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import "./Dashboard.css";
import "../styles/theme.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardStats().then((data) => {
      setStats([
        { label: "Products", value: data.totalProducts },
        { label: "Categories", value: data.totalCategories },
        { label: "Orders", value: data.totalOrders },
        { label: "Revenue", value: `₹${data.totalRevenue}` },
      ]);

      setRecentOrders(data.recentOrders || []);

      // 👇 Generate monthly revenue from recent orders
      const monthly = {};

      (data.recentOrders || []).forEach((order) => {
        const month = new Date(order.createdAt).toLocaleString("default", {
          month: "short",
        });

        if (!monthly[month]) monthly[month] = 0;
        monthly[month] += order.totalAmount;
      });

      const formatted = Object.keys(monthly).map((month) => ({
        month,
        revenue: monthly[month],
      }));

      setChartData(formatted);
    });
  }, []);

  if (!stats) return null;

  return (
    <PageLayout title="Dashboard">
      {/* KPI GRID */}
      <div className="stats-grid">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div className="card">
        <h3>Recent Orders</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No recent orders
                </td>
              </tr>
            ) : (
              recentOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o.user?.name || "—"}</td>
                  <td>₹{o.totalAmount}</td>
                  <td>
                    <span
                      className={`badge ${
                        o.paymentStatus === "Verified"
                          ? "badge-paid"
                          : "badge-pending"
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* REAL CHART */}
      <div className="card">
        <h3>Revenue Overview</h3>

        {chartData.length === 0 ? (
          <div className="chart-placeholder">No revenue data</div>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#222" />
                <XAxis dataKey="month" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d9d9d9"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;
