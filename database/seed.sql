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
