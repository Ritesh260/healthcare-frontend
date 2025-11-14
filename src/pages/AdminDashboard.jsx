import React, { useEffect, useState } from "react";
import "../AdminDashboard.css";

const AdminDashboard = () => {
  const [data, setData] = useState({
    users: [],
    contacts: [],
    callbacks: [],
    sos: [],
  });
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 🧠 Fetch all admin data + SOS alerts
 useEffect(() => {
  const fetchAll = async () => {
    try {
      const adminRes = await fetch("http://localhost:5000/api/admin/all-data");
      const sosRes = await fetch("http://localhost:5000/api/sos");

      if (!adminRes.ok) throw new Error("Admin data fetch failed");
      const adminData = await adminRes.json();

      let sosData = [];
      if (sosRes.ok) {
        sosData = await sosRes.json();
      } else {
        console.warn("SOS API not found — skipping");
      }

      setData({
        users: adminData.users || [],
        contacts: adminData.contacts || [],
        callbacks: adminData.callbacks || [],
        sos: sosData || [],
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAll();
}, []);

  if (loading) return <p className="loading-text">Loading dashboard...</p>;

  const recentUsers = data.users.slice(0, 5);

  // 🏠 HOME TAB
  const renderHome = () => (
    <>
      <section className="welcome-card">
        <div className="welcome-left">
          <h1>
            Welcome, <span className="accent">Admin</span> 🚑
          </h1>
          <p className="welcome-sub">
            <strong>SehatSathi</strong> — Your reliable <b>ground ambulance</b>{" "}
            service for rural & remote areas. We connect patients with nearby
            hospitals quickly through emergency calls and location tracking.
          </p>

          <div className="stat-row">
            <div className="stat-card red">
              <div className="stat-number">{data.users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card red">
              <div className="stat-number">{data.contacts.length}</div>
              <div className="stat-label">Contact Requests</div>
            </div>
            <div className="stat-card red">
              <div className="stat-number">{data.callbacks.length}</div>
              <div className="stat-label">Callback Requests</div>
            </div>
            <div className="stat-card red">
              <div className="stat-number">{data.sos.length}</div>
              <div className="stat-label">SOS Alerts</div>
            </div>
          </div>
        </div>

        <div className="welcome-right">
          <h3 className="mini-title">Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-btn" onClick={() => setActiveTab("users")}>
              View Users
            </button>
            <button
              className="action-btn"
              onClick={() => setActiveTab("contacts")}
            >
              View Contacts
            </button>
            <button
              className="action-btn"
              onClick={() => setActiveTab("callbacks")}
            >
              View Callbacks
            </button>
            <button className="action-btn" onClick={() => setActiveTab("sos")}>
              View SOS Alerts
            </button>
          </div>
        </div>
      </section>

      <section className="recent-section">
        <h2>Recent Users</h2>
        {recentUsers.length === 0 ? (
          <p className="muted">No users yet.</p>
        ) : (
          <table className="data-table powerful">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );

  // 👥 USERS TAB
  const renderUsers = () => (
    <>
      <h2 className="section-title">All Users</h2>
      <table className="data-table powerful full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role || "user"}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  // 📩 CONTACT REQUESTS
  const renderContacts = () => (
    <>
      <h2 className="section-title">Contact Requests</h2>
      <table className="data-table powerful full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.contacts.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email || "—"}</td>
              <td>{c.phone}</td>
              <td className="wrap-cell">{c.message || "—"}</td>
              <td>{new Date(c.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  // 📞 CALLBACK REQUESTS
  const renderCallbacks = () => (
    <>
      <h2 className="section-title">Callback Requests</h2>
      <table className="data-table powerful full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.callbacks.map((cb) => (
            <tr key={cb._id}>
              <td>{cb.name}</td>
              <td>{cb.phone}</td>
              <td>{new Date(cb.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  // 🚨 SOS ALERTS TAB
  const renderSOS = () => (
    <>
      <h2 className="section-title">SOS Alerts</h2>
      <table className="data-table powerful full">
        <thead>
          <tr>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Time</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {data.sos.map((s) => (
            <tr key={s._id}>
              <td>{s.latitude}</td>
              <td>{s.longitude}</td>
              <td>{new Date(s.createdAt).toLocaleString()}</td>
              <td>
                <a
                  href={`https://www.google.com/maps?q=${s.latitude},${s.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-btn"
                >
                  View on Map 🗺️
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  // 🔁 Render main content
  const renderMain = () => {
    switch (activeTab) {
      case "home":
        return renderHome();
      case "users":
        return renderUsers();
      case "contacts":
        return renderContacts();
      case "callbacks":
        return renderCallbacks();
      case "sos":
        return renderSOS();
      default:
        return renderHome();
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Responsive topbar */}
      <div className="topbar">
        <div className="topbar-left">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <div className="brand">
            <span className="brand-accent">SEHAT</span> SATHI
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>
            <span className="logo-accent">SEHAT</span> ADMIN
          </h2>
        </div>

        <ul className="menu">
          <li
            className={activeTab === "home" ? "active" : ""}
            onClick={() => setActiveTab("home")}
          >
            🏠 Home
          </li>
          <li
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            👥 Users
          </li>
          <li
            className={activeTab === "contacts" ? "active" : ""}
            onClick={() => setActiveTab("contacts")}
          >
            📩 Contacts
          </li>
          <li
            className={activeTab === "callbacks" ? "active" : ""}
            onClick={() => setActiveTab("callbacks")}
          >
            📞 Callbacks
          </li>
          <li
            className={activeTab === "sos" ? "active" : ""}
            onClick={() => setActiveTab("sos")}
          >
            🚨 SOS Alerts
          </li>
        </ul>

        <div className="logout-section">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">{renderMain()}</main>
    </div>
  );
};

export default AdminDashboard;
