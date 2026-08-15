-- Kategorie główne
INSERT INTO categories (parent_id, name, slug, description, sort_order)
VALUES
    (NULL, 'Przynęty', 'przynety', 'Wszystkie przynęty wędkarskie.', 1),
    (NULL, 'Sprzęt', 'sprzet', 'Sprzęt wędkarski.', 2),
    (NULL, 'Narzędzia', 'narzedzia', 'Narzędzia i akcesoria.', 3);

-- Podkategoria: Gumy
INSERT INTO categories (parent_id, name, slug, description, sort_order)
SELECT id, 'Gumy', 'gumy', 'Gumowe przynęty wędkarskie.', 1
FROM categories
WHERE slug = 'przynety';

-- Podkategoria: Kopyta
INSERT INTO categories (parent_id, name, slug, description, sort_order)
SELECT id, 'Kopyta', 'kopyta', 'Gumowe przynęty typu kopyto.', 1
FROM categories
WHERE slug = 'gumy';

-- Podkategoria: Twistery
INSERT INTO categories (parent_id, name, slug, description, sort_order)
SELECT id, 'Twistery', 'twistery', 'Gumowe przynęty typu twister.', 2
FROM categories
WHERE slug = 'gumy';
-- Produkty testowe: Kopyta
INSERT INTO products (
    category_id,
    name,
    slug,
    description,
    sku,
    price
)
SELECT
    id,
    'Kopyto 10 cm',
    'kopyto-10-cm',
    'Gumowa przynęta typu kopyto o długości 10 cm.',
    'KOP-10-001',
    4.99
FROM categories
WHERE slug = 'kopyta';

INSERT INTO products (
    category_id,
    name,
    slug,
    description,
    sku,
    price
)
SELECT
    id,
    'Kopyto 12 cm',
    'kopyto-12-cm',
    'Gumowa przynęta typu kopyto o długości 12 cm.',
    'KOP-12-001',
    5.99
FROM categories
WHERE slug = 'kopyta';
INSERT INTO inventory (product_id, quantity)
SELECT id, 20
FROM products
WHERE sku IN ('KOP-10-001', 'KOP-12-001');
-- Testowe metody dostawy
INSERT INTO shipping_methods (name, price, is_active)
VALUES
    ('Paczkomat', 12.99, TRUE),
    ('Kurier', 16.99, TRUE),
    ('Odbiór osobisty', 0.00, TRUE);
-- Testowy kod rabatowy
INSERT INTO discount_codes (
    code,
    discount_percent,
    usage_limit,
    expires_at,
    is_active
)
VALUES (
    'START10',
    10.00,
    100,
    NOW() + INTERVAL '30 days',
    TRUE
);
