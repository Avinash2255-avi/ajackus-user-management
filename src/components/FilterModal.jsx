import React, { useState, useEffect } from "react";

export default function FilterModal({ isOpen, onClose, onApply, initialFilters }) {
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  // Load existing filters when modal opens
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters, isOpen]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  function handleApply() {
    onApply(filters);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Filter Users</h2>

        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={filters.firstName}
            onChange={handleChange}
            placeholder="Filter by first name"
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={filters.lastName}
            onChange={handleChange}
            placeholder="Filter by last name"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={filters.email}
            onChange={handleChange}
            placeholder="Filter by email"
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={filters.department}
            onChange={handleChange}
            placeholder="Filter by department"
          />
        </div>

        <div className="modal-actions">
          <button onClick={handleApply}>Apply</button>
          <button onClick={onClose} className="secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
