// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/users";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import Pagination from "../components/Pagination";
import FilterModal from "../components/FilterModal";
import "../styles/app.css";
import useDebounce from "../hooks/useDebounce";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ui state
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  // filter & search & sort
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchUsers();
      const mapped = data.map((u) => {
        const [first, ...rest] = (u.name || "").split(" ");
        return {
          id: u.id,
          firstName: first || "",
          lastName: rest.join(" ") || "",
          email: u.email || "",
          department: u.company?.name || "General",
        };
      });
      setUsers(mapped);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(payload) {
    try {
      setLoading(true);
      const res = await createUser(payload);
      setUsers((prev) => [{ ...payload, id: res.id || Date.now() }, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id, payload) {
    try {
      setLoading(true);
      await updateUser(id, payload);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...payload } : u)));
      setEditingUser(null);
    } catch (err) {
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      setLoading(true);
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  }

  function applyFilters(newFilters) {
    setFilters(newFilters || { firstName: "", lastName: "", email: "", department: "" });
    setPage(1);
  }

  const filtered = users.filter((u) => {
    if (filters.firstName && !u.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) return false;
    if (filters.lastName && !u.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) return false;
    if (filters.email && !u.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
    if (filters.department && !u.department.toLowerCase().includes(filters.department.toLowerCase())) return false;

    if (debouncedQuery) {
      const hay = `${u.firstName} ${u.lastName} ${u.email} ${u.department}`.toLowerCase();
      if (!hay.includes(debouncedQuery.toLowerCase())) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === "id") {
      aVal = Number(aVal);
      bVal = Number(bVal);
      if (Number.isNaN(aVal)) aVal = 0;
      if (Number.isNaN(bVal)) bVal = 0;
    } else {
      aVal = (aVal ?? "").toString().toLowerCase();
      bVal = (bVal ?? "").toString().toLowerCase();
    }

    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const visible = sorted.slice(start, start + pageSize);

  return (
    <div className="container">
      <h1>Ajackus — User Management</h1>
      {error && <div className="error">{error}</div>}

      <div className="controls" style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Search name, email, department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: 8, minWidth: 260 }}
        />

        <button onClick={() => setIsFilterOpen(true)} style={{ padding: "8px 10px" }}>
          Filters
        </button>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label>Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setSortDir("asc");
            }}
          >
            <option value="id">ID</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="email">Email</option>
            <option value="department">Department</option>
          </select>

          <button onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}>
            {sortDir === "asc" ? "▲" : "▼"}
          </button>
        </div>
      </div>

      <UserForm onAdd={handleAdd} editing={editingUser} onUpdate={handleUpdate} onCancel={() => setEditingUser(null)} />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <UserTable users={visible} onEdit={(u) => setEditingUser(u)} onDelete={handleDelete} />
          <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Pagination total={total} page={safePage} pageSize={pageSize} onPage={(p) => setPage(p)} onPageSize={(s) => { setPageSize(s); setPage(1); }} />
            <div style={{ fontSize: 13, color: "#666" }}>
              Showing {Math.min(total, start + 1)} - {Math.min(total, start + visible.length)} of {total}
            </div>
          </div>
        </>
      )}

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={applyFilters} initialFilters={filters} />
    </div>
  );
}
