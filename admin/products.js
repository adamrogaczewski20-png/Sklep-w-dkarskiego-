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

productForm.addEventListener("submit", async event => {
    event.preventDefault();

    const product = {
        name: document.getElementById("name").value.trim(),
        description: document.getElementById("description").value.trim(),
        sku: document.getElementById("sku").value.trim(),
        price: Number(document.getElementById("price").value),
        category_id: Number(categorySelect.value)
    };

    if (!product.name || !product.price || !product.category_id) {
        message.textContent =
            "Wypełnij nazwę, cenę i kategorię.";

        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/admin/products`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Nie udało się dodać produktu."
            );
        }

        message.textContent =
            `Produkt "${data.product.name}" został dodany.`;

        productForm.reset();

        await loadCategories();

    } catch (error) {
        console.error(error);

        message.textContent =
            error.message;
    }
});

loadCategories();
