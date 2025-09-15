document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get values
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  // Get error fields
  const firstNameError = document.getElementById("firstNameError");
  const lastNameError = document.getElementById("lastNameError");
  const ageError = document.getElementById("ageError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const passwordError = document.getElementById("passwordError");
  const successMessage = document.getElementById("successMessage");

  // Reset messages
  [firstNameError, lastNameError, ageError, emailError, phoneError, passwordError].forEach(e => e.textContent = "");
  successMessage.textContent = "";
  successMessage.className = "";

  let valid = true;

  // Name checks
  if (firstName.length < 2) {
    firstNameError.textContent = "First name must be at least 2 characters.";
    valid = false;
  }
  if (lastName.length < 2) {
    lastNameError.textContent = "Last name must be at least 2 characters.";
    valid = false;
  }

  // Age
  if (isNaN(age) || age < 18) {
    ageError.textContent = "You must be 18 or older to sign up.";
    valid = false;
  }

  // Email regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    emailError.textContent = "Enter a valid email address.";
    valid = false;
  }

  // Phone regex
  const phonePattern = /^\+?\d{7,15}$/;
  if (!phonePattern.test(phone)) {
    phoneError.textContent = "Enter a valid phone number (7–15 digits).";
    valid = false;
  }

  // Password strength
  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
  if (!passwordPattern.test(password)) {
    passwordError.textContent =
      "Password must be 6+ chars, include uppercase, lowercase, and a number.";
    valid = false;
  }

  // Success
  if (valid) {
    successMessage.textContent = "Signup successful! 🎉";
    successMessage.className = "success";
    document.getElementById("signupForm").reset();
  }
});
