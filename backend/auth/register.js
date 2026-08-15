const API_URL = "http://localhost:3000";

const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = {
        first_name: document.getElementById("firstName").value.trim(),
        last_name: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value
    };

    if (user.password.length < 8) {
        message.textContent =
            "Hasło musi mieć co najmniej 8 znaków.";

        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Nie udało się utworzyć konta."
            );
        }

        message.textContent =
            "Konto zostało utworzone. Możesz się zalogować.";

        registerForm.reset();

    } catch (error) {
        console.error(error);

        message.textContent =
            error.message;
    }
});
