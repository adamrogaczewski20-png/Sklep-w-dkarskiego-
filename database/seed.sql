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
