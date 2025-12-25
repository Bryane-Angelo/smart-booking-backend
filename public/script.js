function login() {
  const role = localStorage.getItem("role");

   fetch("https://smart-booking-backend.vercel.app/api/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      username: username.value,
      password: password.value,
      role
    })
  })
  .then(r => r.json())
  .then(d => {
    if (!d.success) {
      error.innerText = "Invalid credentials";
      return;
    }

    localStorage.setItem("username", d.username);

    if (d.role === "admin") {
      location.href = "/admin.html";
    } else {
      location.href = "/home.html";
    }
  });
}
