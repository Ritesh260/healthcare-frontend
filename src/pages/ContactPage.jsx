import React, { useState } from "react";
import "./ContactPage.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/contact/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Error submitting request");
      } else {
        alert("Your request has been submitted successfully!");
        // Reset form
        setFormData({ name: "", email: "", phone: "", message: "" });
      }
    } catch (err) {
      console.error("Server error:", err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-header">
        <h1>SehatSathi 24/7</h1>
        <p>Your Health, Our Priority – Anytime, Anywhere</p>
      </div>

      <div className="contact-card">
        <div className="contact-image">
          <img src="/service.png" alt="service" />
        </div>

        <div className="contact-form-box">
          <h2>Want to know more about our services?</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone no"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      <footer className="contact-footer">
        <p>© {new Date().getFullYear()} SehatSathi. All Rights Reserved.</p>
        <p>
          📍 New Delhi, India | 📞 +91 9876543210 | ✉️ support@sehatsathi.com
        </p>
      </footer>
    </div>
  );
};

export default ContactPage;
