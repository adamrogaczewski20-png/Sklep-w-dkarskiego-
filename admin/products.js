const API_URL = "http://localhost:3000";

const token = localStorage.getItem("token");

const productForm = document.getElementById("productForm");
const addProductButton =
    document.getElementById("addProductButton");

const productFormSection =
    document.getElementById("productFormSection");

const cancelButton =
    document.getElementById("cancelButton");
const message = document.getElementById("message");
const productsList = document.getElementById("productsList");
const categorySelect = document.getElementById("category");

if (!token) {
    window.location.href = "../auth/login.html";
}


// ==============================
// POBIERANIE KATEGORII
// ==============================

async function loadCategories() {
    try {
        const response = await fetch(
            `${API_URL}/api/categories`
        );

        const categories = await response.json();

        if (!response.ok) {
            throw new Error(
                categories.error ||
                "Nie udało się pobrać kategorii."
            );
        }

        categorySelect.innerHTML = `
            <option value="">
                Wybierz kategorię
            </option>
        `;

        categories.forEach((category) => {
            const option =
                document.createElement("option");

            option.value = category.id;

            option.textContent =
                category.parent_id
                    ? `↳ ${category.name}`
                    : category.name;

            categorySelect.appendChild(option);
        });

    } catch (error) {
        console.error(error);

        categorySelect.innerHTML = `
            <option value="">
                Nie udało się pobrać kategorii
            </option>
        `;
    }
}


// ==============================
// POBIERANIE PRODUKTÓW
// ==============================

async function loadProducts() {
    try {
        const response = await fetch(
            `${API_URL}/api/admin/products`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                "Nie udało się pobrać produktów."
            );
        }

        if (data.length === 0) {
            productsList.textContent =
                "Brak produktów.";

            return;
        }

        productsList.innerHTML = "";

        data.forEach((product) => {
            const item =
                document.createElement("div");

            item.innerHTML = `
                <h3>${product.name}</h3>

                <p>
                    Kategoria:
                    ${product.category_name}
                </p>

                <p>
                    Cena:
                    ${product.price} zł
                </p>

                <p>
                    SKU:
                    ${product.sku || "-"}
                </p>

                <p>
                    Magazyn:
                    ${product.quantity ?? 0}
                </p>
            `;

            productsList.appendChild(item);
        });

    } catch (error) {
        console.error(error);

        productsList.textContent =
            error.message;
    }
}


// ==============================
// DODAWANIE PRODUKTU
// ==============================

productForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        const product = {
            name:
                document
                    .getElementById("name")
                    .value
                    .trim(),

            category_id:
                categorySelect.value,

            price:
                document
                    .getElementById("price")
                    .value,

            sku:
                document
                    .getElementById("sku")
                    .value
                    .trim(),

            description:
                document
                    .getElementById("description")
                    .value
                    .trim(),

            quantity:
                document
                    .getElementById("quantity")
                    .value
        };

        try {
            const response = await fetch(
                `${API_URL}/api/admin/products`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(product)
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Nie udało się dodać produktu."
                );
            }

            message.textContent =
                "Produkt został dodany.";

            productForm.reset();

            await loadProducts();
} catch (error) {
            console.error(error);

            message.textContent =
                error.message;
        }
    }
);


// ==============================
// START
// ==============================

loadCategories();
loadProducts();
addProductButton.addEventListener(
    "click",
    () => {
        productFormSection.hidden = false;
    }
);

cancelButton.addEventListener(
    "click",
    () => {
        productForm.reset();
        productFormSection.hidden = true;
        message.textContent = "";
    }
);
