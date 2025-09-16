const API_URL = "https://skillbarter-ja8s.onrender.com";

// Get user from localStorage
const userId = localStorage.getItem("userId");
const userName = localStorage.getItem("userName");
const userEmail = localStorage.getItem("userEmail");
const userOffer = localStorage.getItem("userOffer");
const userWant = localStorage.getItem("userWant");
const userPhone = localStorage.getItem("userPhone");
const userCell = localStorage.getItem("userCell");
const userWhatsapp = localStorage.getItem("userWhatsapp");
const userFacebook = localStorage.getItem("userFacebook");
const userZoom = localStorage.getItem("userZoom");

if (!userId) {
  alert("⚠️ You must log in first!");
  window.location.href = "index.html";
} else {
  // Fill user profile
  document.getElementById("userName").innerText = userName || "";
  document.getElementById("userEmail").innerText = userEmail || "";
  document.getElementById("userOffer").innerText = userOffer || "";
  document.getElementById("userWant").innerText = userWant || "";

  if (userPhone) {
    document.getElementById("userPhone").innerText = userPhone;
    document.getElementById("userPhone").href = `tel:${userPhone}`;
  }

  if (userCell) {
    document.getElementById("userCell").innerText = userCell;
    document.getElementById("userCell").href = `tel:${userCell}`;
  }

  if (userWhatsapp) {
    document.getElementById("userWhatsapp").innerText = "Chat on WhatsApp";
    document.getElementById("userWhatsapp").href = `https://wa.me/${userWhatsapp}`;
  }

  if (userFacebook) {
    document.getElementById("userFacebook").href = userFacebook;
  }

  if (userZoom) {
    document.getElementById("userZoom").href = userZoom;
  }

  // Fetch matches
  fetch(`${API_URL}/matches/${userId}`)
    .then(res => res.json())
    .then(data => {
      const matchesDiv = document.getElementById("matches");
      matchesDiv.innerHTML = "";

      if (data.matches && data.matches.length > 0) {
        data.matches.forEach(match => {
          matchesDiv.innerHTML += `
            <div class="match">
              <p><strong>${match.name}</strong></p>
              <p>Offers: ${match.offer} | Wants: ${match.want}</p>
              ${match.email ? `<p>📧 <a href="mailto:${match.email}">${match.email}</a></p>` : ""}
              ${match.phone ? `<p>📞 <a href="tel:${match.phone}">${match.phone}</a></p>` : ""}
              ${match.cell ? `<p>📱 <a href="tel:${match.cell}">${match.cell}</a></p>` : ""}
              ${match.whatsapp ? `<p>💬 <a href="https://wa.me/${match.whatsapp}" target="_blank">WhatsApp Chat</a></p>` : ""}
              ${match.facebook ? `<p>📘 <a href="${match.facebook}" target="_blank">Facebook Profile</a></p>` : ""}
              ${match.zoom ? `<p>🎥 <a href="${match.zoom}" target="_blank">Zoom Meeting</a></p>` : ""}
            </div>
          `;
        });
      } else {
        matchesDiv.innerHTML = "<p>No matches found yet.</p>";
      }
    })
    .catch(() => {
      document.getElementById("matches").innerHTML = "<p>Error loading matches.</p>";
    });
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
