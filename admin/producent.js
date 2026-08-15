const API_URL = "http://localhost:3000";

const productForm = document.getElementById("productForm");
const categorySelect = document.getElementById("category");
const message = document.getElementById("message");

async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/api/categories`);

        if (!response.ok) {
            throw new Error("Nie udało się pobrać kategorii.");
        }

        const categories = await response.json();

        categorySelect.innerHTML =
            '<option value="">Wybierz kategorię</option>';

        categories.forEach(category => {
            const option = document.createElement("option");

            option.value = category.id;
            option.textContent = category.name;

            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);

        message.textContent =
            "Nie udało się załadować kategorii.";
    }
}

productForm.addEventListener("submit", event => {
    event.preventDefault();

    const product = {
        name: document.getElementById("name").value.trim(),
        description: document.getElementById("description").value.trim(),
        sku: document.getElementById("sku").value.trim(),
        price: Number(document.getElementById("price").value),
        category_id: Number(categorySelect.value)
    };

    console.log("Produkt do zapisania:", product);

    message.textContent =
        "Dane produktu zostały przygotowane. Dodawanie do bazy podłączymy w następnym kroku.";
});

loadCategories();
