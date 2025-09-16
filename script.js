// Auto-switch API: local when opened on localhost/127.0.0.1/file://, otherwise Render
const API_URL = (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "")
  ? "http://localhost:10000"
  : "https://skillbarter-ja8s.onrender.com";

// ===== SIGNUP =====
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    offer: document.getElementById("offer").value,
    want: document.getElementById("want").value,
    phone: document.getElementById("phone").value,
    cell: document.getElementById("cell").value,
    whatsapp: document.getElementById("whatsapp").value,
    facebook: document.getElementById("facebook").value,
    zoom: document.getElementById("zoom").value,
  };

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    document.getElementById("signupMsg").innerText =
      data.message || "Signup successful!";
  } catch (err) {
    document.getElementById("signupMsg").innerText = "❌ Error signing up.";
  }
});

// ===== LOGIN =====
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Save all user info to localStorage
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userOffer", data.user.offer);
      localStorage.setItem("userWant", data.user.want);
      localStorage.setItem("userPhone", data.user.phone || "");
      localStorage.setItem("userCell", data.user.cell || "");
      localStorage.setItem("userWhatsapp", data.user.whatsapp || "");
      localStorage.setItem("userFacebook", data.user.facebook || "");
      localStorage.setItem("userZoom", data.user.zoom || "");

      document.getElementById("loginMsg").innerText = "✅ Login successful!";
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("loginMsg").innerText =
        data.message || "❌ Invalid login.";
    }
  } catch (err) {
    document.getElementById("loginMsg").innerText = "❌ Error logging in.";
  }
});
