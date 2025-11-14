import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAmbulance,
  faHospital,
  faPills,
  faFirstAid,
} from "@fortawesome/free-solid-svg-icons";

import "./App.css";
const API_URL = import.meta.env.VITE_API_URL;



function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [voiceResult, setVoiceResult] = useState(
    "Say: 'Ambulance' or 'Hospital'"
  );
  const [hospitals, setHospitals] = useState([]);
  const [ambulances, setAmbulances] = useState([]);

  // ✅ Callback Form State
  const [callbackData, setCallbackData] = useState({ name: "", phone: "" });
  const [loadingCallback, setLoadingCallback] = useState(false);

  const handleChangeCallback = (e) => {
    setCallbackData({ ...callbackData, [e.target.name]: e.target.value });
  };

  const handleCallbackSubmit = async () => {
    if (!callbackData.name || !callbackData.phone) {
      alert("Please fill all fields");
      return;
    }

    setLoadingCallback(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/callback/request`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(callbackData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Error submitting request");
      } else {
        alert("Your request has been submitted. We will call you shortly!");
        setCallbackData({ name: "", phone: "" });
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    } finally {
      setLoadingCallback(false);
    }
  };
  
  // 🎤 Voice Search Function
  const handleVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      let result = event.results[0][0].transcript.toLowerCase();
      setVoiceResult(`You said: ${result}`);

      if (result.includes("ambulance")) {
        getLocationAndAmbulances();
      } else if (result.includes("hospital")) {
        getLocationAndHospitals();
      } else {
        setVoiceResult("Please say 'Ambulance' or 'Hospital'");
      }
    };
  };

  // 🏥 Get Nearby Hospitals
  const getLocationAndHospitals = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchNearbyHospitals, () => {
        alert("Please allow location access!");
      });
    } else {
      alert("Geolocation is not supported in your browser.");
    }
  };

  const fetchNearbyHospitals = (position) => {
    const { latitude, longitude } = position.coords;

    fetch(`${import.meta.env.VITE_API_URL}/api/hospitals?lat=${latitude}&lng=${longitude}`)

      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setHospitals(data.results);
          setAmbulances([]);
        }
      })
      .catch((err) => console.error(err));
  };

  // 🚑 Get Nearby Ambulances
  const getLocationAndAmbulances = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchNearbyAmbulances, () => {
        alert("Please allow location access!");
      });
    } else {
      alert("Geolocation is not supported in your browser.");
    }
  };

  const fetchNearbyAmbulances = (position) => {
    const { latitude, longitude } = position.coords;

    fetch(`${import.meta.env.VITE_API_URL}/api/ambulances?lat=${latitude}&lng=${longitude}`)

      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setAmbulances(data.results);
          setHospitals([]);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="red-text">SEH</span>AT SATHI
        </div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="#about">About Us</a>
          <a href="#presence">Our Presence</a>
          <a href="#services">Services</a>
          <a href="#choose">Why Choose Us</a>
          <Link to="/contact">Contact Us</Link>
          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-text">
          <h1>
            Reliable Ground Ambulance Services <br />
            <span className="red-text">For Rural & Remote Areas</span>
          </h1>
          <p>
            Whether it’s an emergency in a village, transfer to the nearest
            hospital, or support during critical care, we ensure safe, fast, and
            reliable ground transportation with trained medical staff.
          </p>
          <Link to="/contact">
            <button className="btn-primary">Contact Us</button>
          </Link>
        </div>

        {/* Callback Form */}
        <div className="callback-form">
          <p>
            Upon filling the details, you will receive a call within 5 seconds
          </p>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={callbackData.name}
            onChange={handleChangeCallback}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone No"
            value={callbackData.phone}
            onChange={handleChangeCallback}
          />
          <button
            className="btn-red"
            onClick={handleCallbackSubmit}
            disabled={loadingCallback}
          >
            {loadingCallback ? "Submitting..." : "REQUEST A CALLBACK"}
          </button>
        </div>
      </section>

      {/* 🎤 Voice Search Section */}
      <section className="voice-section">
        <button id="voiceBtn" onClick={handleVoiceSearch}>
          🎤 Speak Your Need
        </button>
        <p>{voiceResult}</p>
      </section>

      {/* Nearby Hospitals */}
      {hospitals.length > 0 && (
        <section className="nearby-section">
          <h2>Nearby Hospitals</h2>
          <div className="card-grid">
            {hospitals.slice(0, 5).map((h, index) => (
              <div className="location-card" key={index}>
                <div className="card-icon">🏥</div>
                <div className="card-info">
                  <h3>{h.name}</h3>
                  <p>{h.vicinity}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${h.geometry.location.lat},${h.geometry.location.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="map-link"
                  >
                    📍 View on Map
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Nearby Ambulances */}
      {ambulances.length > 0 && (
        <section className="nearby-section">
          <h2>Nearby Ambulances</h2>
          <div className="card-grid">
            {ambulances.slice(0, 5).map((a, index) => (
              <div className="location-card" key={index}>
                <div className="card-icon">🚑</div>
                <div className="card-info">
                  <h3>{a.name}</h3>
                  <p>{a.vicinity}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${a.geometry.location.lat},${a.geometry.location.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="map-link"
                  >
                    📍 View on Map
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Who We Are */}
      <section id="about" className="who-we-are">
        <div className="about-image">
          <img src="public/Images/medical.jpg" alt="Ambulance" />
        </div>
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            At <strong>Sehat Sathi</strong>, we are a patient-first organization
            committed to delivering safe, reliable, and advanced medical
            transport solutions. With over two decades of expertise, we provide
            unmatched critical care and air ambulance services.
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="services">
        <h2 className="section-title">
          Our <span className="red-text">Services</span>
        </h2>
        <div className="service-grid">
          <div className="service-card">
            <FontAwesomeIcon icon={faAmbulance} size="3x" color="#e74c3c" />
            <h3>Local Ambulance Booking</h3>
            <p>Instantly book nearby ambulances with real-time availability.</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faHospital} size="3x" color="#3498db" />
            <h3>Nearby Hospital Finder</h3>
            <p>Locate the nearest hospital with essential facilities in one click.</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faPills} size="3x" color="#2ecc71" />
            <h3>Emergency Medicine Help</h3>
            <p>Get details of nearby medical stores and emergency providers.</p>
          </div>
          <div className="service-card">
            <FontAwesomeIcon icon={faFirstAid} size="3x" color="#f1c40f" />
            <h3>First Aid Guidance</h3>
            <p>Step-by-step first aid tips before medical help arrives.</p>
          </div>
        </div>
      </section>
 
      <section className="sos">
  <h2>Emergency?</h2>
  <button
    className="sos-btn"
    onClick={async () => {
      try {
        // 1️⃣ Get user location
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;

              // 2️⃣ Send location to backend
           await fetch(`${import.meta.env.VITE_API_URL}/api/sos`, {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latitude, longitude }),
              });

              // 3️⃣ Open dialer
              window.location.href = "tel:108";

              alert("📍 Location sent and emergency call initiated!");
            },
            (error) => {
              alert("Failed to get location. Please enable GPS.");
              console.error(error);
            }
          );
        } else {
          alert("Geolocation is not supported by your browser.");
        }
      } catch (err) {
        console.error(err);
        alert("Error sending SOS alert. Try again!");
      }
    }}
  >
    🚨 Call & Send Location
  </button>
</section>


      {/* Footer */}
      <footer className="footer">
  <div className="footer-content">
    <div className="footer-brand">
      <h2 className="brand-title">
        <span className="brand-accent-dark">SEHAT</span>{" "}
        <span className="brand-accent-light">SATHI</span>
      </h2>
      <p>
        Empowering rural and remote areas with reliable emergency medical and
        ambulance services — because every life matters.
      </p>
    </div>

    <div className="footer-links">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#services">Our Services</a></li>
        <li><a href="#about">About Us</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>

    <div className="footer-contact">
      <h4>Contact Us</h4>
      <p>📞 +91 98765 43210</p>
      <p>📧 support@sehatsathi.in</p>
      <p>🏥 Mumbai, Maharashtra</p>
    </div>

    <div className="footer-social">
      <h4>Follow Us</h4>
      <div className="social-icons">
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-linkedin-in"></i></a>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    <p>
      © 2025 <span className="accent">SEHAT SATHI</span> | All Rights Reserved
    </p>
  </div>
</footer>


    </div>
  );
}

export default HomePage;
