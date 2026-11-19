import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Bar,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./App.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CATEGORIES = ["Food", "Transport", "Shopping", "Entertainment", "Health", "Salary", "Other"];

const CATEGORY_COLORS = {
  Food:          "#f59e0b",
  Transport:     "#3b82f6",
  Shopping:      "#ec4899",
  Entertainment: "#8b5cf6",
  Health:        "#22c55e",
  Salary:        "#06b6d4",
  Other:         "#94a3b8",
};

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export default function Dashboard() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [text,         setText]         = useState("");
  const [amount,       setAmount]       = useState("");
  const [category,     setCategory]     = useState("Other");
  const [budget,       setBudget]       = useState(localStorage.getItem("budget") || "");
  const [budgetInput,  setBudgetInput]  = useState(localStorage.getItem("budget") || "");
  const [loading,      setLoading]      = useState(false);

  const userName = localStorage.getItem("userName") || "User";

  const fetchTransactions = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/transactions", {
        headers: authHeader(),
      });
      setTransactions(data);
    } catch {
      logout();
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const addTransaction = async () => {
    if (!text.trim() || !amount) return alert("Please fill in description and amount");
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/transactions",
        { text: text.trim(), amount: Number(amount), category },
        { headers: authHeader() }
      );
      setText(""); setAmount(""); setCategory("Other");
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: authHeader(),
      });
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  const saveBudget = async () => {
    const val = Number(budgetInput);
    if (!val || val < 0) return alert("Enter a valid budget amount");
    try {
      await axios.put(
        "http://localhost:5000/api/auth/budget",
        { budget: val },
        { headers: authHeader() }
      );
      localStorage.setItem("budget", val);
      setBudget(val);
      alert("Budget saved ✓");
    } catch {
      // fallback to localStorage only
      localStorage.setItem("budget", val);
      setBudget(val);
    }
  };

  const logout = () => {
    ["token", "userId", "userName", "budget"].forEach((k) => localStorage.removeItem(k));
    navigate("/login");
  };

  /* ── Derived numbers ──────────────────────── */
  const balance      = transactions.reduce((s, t) => s + Number(t.amount), 0);
  const totalIncome  = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  const budgetNum    = Number(budget);
  const budgetPct    = budgetNum > 0 ? Math.min((totalExpense / budgetNum) * 100, 100) : 0;
  const budgetClass  = budgetPct >= 100 ? "danger" : budgetPct >= 75 ? "warning" : "ok";

  /* ── Chart ────────────────────────────────── */
  const chartLabels   = transactions.slice(0, 10).reverse().map((t) => t.text);
  const chartAmounts  = transactions.slice(0, 10).reverse().map((t) => Number(t.amount));
  const chartBgColors = transactions.slice(0, 10).reverse().map((t) =>
    t.amount >= 0 ? "rgba(34,197,94,0.75)" : "rgba(239,68,68,0.75)"
  );

  const chartData = {
    labels: chartLabels,
    datasets: [{
      label: "Amount (₹)",
      data:  chartAmounts,
      backgroundColor: chartBgColors,
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title:  { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => fmt(ctx.raw),
        },
      },
    },
    scales: {
      y: {
        grid:  { color: "#f1f5f9" },
        ticks: { callback: (v) => `₹${v}`, font: { size: 11 } },
      },
      x: {
        grid:  { display: false },
        ticks: {
          maxRotation: 30,
          font: { size: 11 },
          callback: function(val, i) {
            const lbl = this.getLabelForValue(i);
            return lbl.length > 10 ? lbl.slice(0, 10) + "…" : lbl;
          },
        },
      },
    },
  };

  /* ── Render ───────────────────────────────── */
  return (
    <div className="dashboard-page">

      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-brand">
          <span>💰</span>
          <span>Finance Tracker</span>
        </div>
        <div className="topbar-user">
          <span>👤 {userName}</span>
          <button className="btn-logout" onClick={logout}>Sign Out</button>
        </div>
      </div>

      <div className="dashboard-body">

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card card-balance">
            <span className="icon">💼</span>
            <span className="label">Net Balance</span>
            <span className="value">{fmt(balance)}</span>
          </div>
          <div className="summary-card card-income">
            <span className="icon">📈</span>
            <span className="label">Total Income</span>
            <span className="value">{fmt(totalIncome)}</span>
          </div>
          <div className="summary-card card-expense">
            <span className="icon">📉</span>
            <span className="label">Total Expenses</span>
            <span className="value">{fmt(totalExpense)}</span>
          </div>
        </div>

        {/* Budget Section */}
        <div className="budget-section">
          <div className="budget-header">
            <h3>📊 Monthly Budget</h3>
            {budgetNum > 0 && (
              <span style={{ fontSize: 13, color: "var(--muted)" }}>
                {fmt(totalExpense)} / {fmt(budgetNum)} spent
              </span>
            )}
          </div>
          <div className="budget-row">
            <input
              type="number"
              placeholder="Set monthly budget (₹)"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
            <button className="btn-save-budget" onClick={saveBudget}>Save</button>
          </div>
          {budgetNum > 0 && (
            <>
              <div className="progress-bar-wrap">
                <div
                  className={`progress-bar-fill ${budgetClass}`}
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
              <div className="budget-meta">
                <span>{budgetPct.toFixed(0)}% used</span>
                <span>{fmt(Math.max(budgetNum - totalExpense, 0))} remaining</span>
              </div>
              {totalExpense > budgetNum && (
                <div className="budget-alert">
                  ⚠️ Budget exceeded by {fmt(totalExpense - budgetNum)}!
                </div>
              )}
            </>
          )}
        </div>

        {/* Main Grid */}
        <div className="main-grid">

          {/* Add Transaction */}
          <div className="add-card">
            <h3>➕ Add Transaction</h3>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                placeholder="e.g. Grocery shopping"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTransaction()}
              />
            </div>
            <div className="form-group">
              <label>Amount (use − for expenses)</label>
              <input
                type="number"
                placeholder="e.g. 500 or -250"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTransaction()}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button className="btn-add" onClick={addTransaction} disabled={loading}>
              {loading ? "Adding…" : "Add Transaction"}
            </button>
          </div>

          {/* Right Column */}
          <div className="right-col">

            {/* Chart */}
            <div className="chart-card">
              <h3>📊 Recent Transactions</h3>
              {transactions.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
                  No data yet — add your first transaction!
                </p>
              )}
            </div>

            {/* Transaction List */}
            <div className="txn-card">
              <div className="txn-card-header">
                <h3>🧾 Transactions</h3>
                <span className="txn-count">{transactions.length} entries</span>
              </div>

              {transactions.length === 0 ? (
                <div className="txn-empty">
                  <div className="empty-icon">🪙</div>
                  <p>No transactions yet. Add one above!</p>
                </div>
              ) : (
                <ul className="txn-list">
                  {transactions.map((t) => (
                    <li key={t._id} className={`txn-item ${t.amount >= 0 ? "income" : "expense"}`}>
                      <span
                        className="txn-dot"
                        style={{ background: CATEGORY_COLORS[t.category] || "#94a3b8" }}
                        title={t.category}
                      />
                      <div className="txn-info">
                        <div className="txn-text">{t.text}</div>
                        <div className="txn-meta">
                          {t.category} · {new Date(t.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short",
                          })}
                        </div>
                      </div>
                      <span className="txn-amount">
                        {t.amount >= 0 ? "+" : ""}{fmt(t.amount)}
                      </span>
                      <button className="btn-delete" onClick={() => deleteTransaction(t._id)} title="Delete">
                        🗑
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>{/* right-col */}
        </div>{/* main-grid */}
      </div>{/* dashboard-body */}
    </div>
  );
}
