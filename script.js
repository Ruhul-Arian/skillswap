const API_URL = "http://localhost:10000"; // Change later to Render URL

// ===== SIGNUP =====
document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  const successMessage = document.getElementById("signupMsg");
  successMessage.textContent = "";

  if (!firstName || !lastName || !email || !password) {
    successMessage.textContent = "⚠️ All fields are required.";
    successMessage.style.color = "red";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, age, email, phone, password })
    });

    const data = await res.json();

    if (res.ok) {
      successMessage.textContent = "✅ Signup successful! Please log in.";
      successMessage.style.color = "green";
      document.getElementById("signupForm").reset();

      document.getElementById("loginSection").style.display = "block";
    } else {
      successMessage.textContent = "⚠️ " + (data.error || "Signup failed.");
      successMessage.style.color = "red";
    }
  } catch (err) {
    console.error("Error:", err);
    successMessage.textContent = "❌ Server error";
    successMessage.style.color = "red";
  }
});

// ===== LOGIN =====
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const loginMsg = document.getElementById("loginMsg");

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      loginMsg.textContent = "✅ Login successful!";
      loginMsg.style.color = "green";

      // Save userId for skills
      localStorage.setItem("userId", data.userId);

      document.getElementById("signupSection").style.display = "none";
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("skillSection").style.display = "block";

      console.log("User logged in:", data.user);
    } else {
      loginMsg.textContent = "⚠️ " + (data.error || "Login failed.");
      loginMsg.style.color = "red";
    }
  } catch (err) {
    console.error("Error:", err);
    loginMsg.textContent = "❌ Server error";
    loginMsg.style.color = "red";
  }
});

// ===== SKILL FORM =====
document.getElementById("skillForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const offer = document.getElementById("offerSkill").value.trim();
  const want = document.getElementById("wantSkill").value.trim();
  const skillMsg = document.getElementById("skillMsg");

  const userId = localStorage.getItem("userId");

  if (!userId) {
    skillMsg.textContent = "⚠️ Please login first.";
    skillMsg.style.color = "red";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/skills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, offer, want })
    });

    const data = await res.json();

    if (res.ok) {
      skillMsg.textContent = data.message;
      skillMsg.style.color = "green";

      if (data.match) {
        skillMsg.textContent += ` 🎯 Matched with user offering "${data.match.offer}" and wanting "${data.match.want}"`;
      }

      document.getElementById("skillForm").reset();
    } else {
      skillMsg.textContent = "⚠️ " + (data.error || "Skill add failed.");
      skillMsg.style.color = "red";
    }
  } catch (err) {
    console.error("Error:", err);
    skillMsg.textContent = "❌ Server error";
    skillMsg.style.color = "red";
  }
});
