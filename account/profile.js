const userData = localStorage.getItem("user");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const message = document.getElementById("message");
const logoutButton = document.getElementById("logoutButton");

if (!userData) {
    message.textContent = "Nie jesteś zalogowany.";
    logoutButton.style.display = "none";
} else {
    const user = JSON.parse(userData);

    firstName.textContent = user.first_name || "-";
    lastName.textContent = user.last_name || "-";
    email.textContent = user.email || "-";
}

logoutButton.addEventListener("click", () => {
    localStorage.removeItem("user");

    window.location.href = "../auth/login.html";
});
