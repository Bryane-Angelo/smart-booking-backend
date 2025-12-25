function login() {
  fetch("https://smart-booking-backend.vercel.app/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(r => r.json())
  .then(d => {
    if (!d.success) {
      error.innerText = "Invalid credentials";
      return;
    }

    // ✅ store values AFTER successful login
    localStorage.setItem("username", d.username);
    localStorage.setItem("role", d.role);

    // ✅ redirect based on role from backend
    if (d.role === "admin") {
      location.href = "/admin.html";
    } else {
      location.href = "/home.html";
    }
  });
}