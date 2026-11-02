-- PostgreSQL: SELECT и NULL, повторная попытка
-- Выполни подготовку, затем заполни TODO. Контрольные запросы сначала оцени без запуска.

DROP TABLE IF EXISTS practice_clients;

CREATE TABLE practice_clients (
  id integer PRIMARY KEY,
  name text NOT NULL,
  region text,
  debt integer
);

INSERT INTO practice_clients VALUES
(1, 'Anna',   'UA',  100),
(2, 'Bohdan', NULL,    0),
(3, 'Iryna',  'PL', NULL),
(4, 'Dmytro', 'UA',  -10),
(5, 'Olena',  '',      0),
(6, 'Taras',  'DE',   20),
(7, 'Marta',  NULL, NULL),
(8, 'Petro',  'PL',   -5);

-- Задача 1.
-- Выведи id, name, region, debt:
-- region отличается от 'UA', включая NULL;
-- debt <= 0, включая NULL;
-- оба условия выполняются одновременно;
-- сортировка id ASC.

-- TODO: напиши запрос здесь.


-- Задача 2.
-- Сначала запиши ожидаемые id в комментариях. Затем можешь выполнить запросы для проверки.

-- Ожидаемые id: TODO
SELECT id
FROM practice_clients
WHERE NOT (debt > 0)
ORDER BY id;

-- Ожидаемые id: TODO
SELECT id
FROM practice_clients
WHERE NOT (region = 'UA')
ORDER BY id;

-- Ожидаемые id: TODO
SELECT id
FROM practice_clients
WHERE (debt <= 0 OR debt IS NULL)
  AND (region <> 'UA' OR region IS NULL)
ORDER BY id;

-- Задача 3.
-- TODO: чем NULL отличается от пустой строки ''?
--
-- TODO: почему column <> value не включает строки с NULL?
--
