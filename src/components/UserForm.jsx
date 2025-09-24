import React, { useEffect, useState } from "react";

export default function UserForm({ onAdd, editing, onUpdate, onCancel }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("General");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editing) {
      setFirstName(editing.firstName || "");
      setLastName(editing.lastName || "");
      setEmail(editing.email || "");
      setDepartment(editing.department || "General");
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setDepartment("General");
    }
  }, [editing]);

  // validation function
  function validate() {
    const e = {};
    if (!firstName.trim()) e.firstName = "First Name is required";
    if (!lastName.trim()) e.lastName = "Last Name is required";
    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Invalid email format";
    }
    if (!department.trim()) e.department = "Department is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = { firstName, lastName, email, department };
    if (editing) {
      onUpdate(editing.id, payload);
    } else {
      onAdd(payload);
      // clear after adding
      setFirstName("");
      setLastName("");
      setEmail("");
      setDepartment("General");
    }
  }

  const isInvalid = Object.keys(errors).length > 0;

  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>
      <div>
        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        {errors.firstName && <div className="small-error">{errors.firstName}</div>}
      </div>
      <div>
        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        {errors.lastName && <div className="small-error">{errors.lastName}</div>}
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <div className="small-error">{errors.email}</div>}
      </div>
      <div>
        <input
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        {errors.department && <div className="small-error">{errors.department}</div>}
      </div>
      <div className="actions">
        <button type="submit" disabled={isInvalid}>
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
