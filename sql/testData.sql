CREATE TABLE IF NOT EXISTS reminders (
	id INT auto_increment PRIMARY KEY,
	doc_number INT,
    store_id INT,
    created_at DATETIME NOT NULL
) ENGINE=INNODB;

INSERT INTO reminders (doc_number, store_id, created_at)
	VALUES
		(1, 100, '2021-05-03 08:25:38'),
        (2, 100, '2021-05-04 08:25:36'),
        (3, 100, '2021-05-05 09:25:38'),
        (4, 100, '2021-05-05 09:35:38'),
        (5, 100, '2021-05-05 09:45:38'),
        (6, 100, '2021-05-05 09:55:38'),
        (7, 100, '2021-05-05 10:05:38'),
        (1, 200, '2021-05-05 10:15:38'),
        (2, 200, '2021-05-05 08:41:36'),
        (3, 200, '2021-05-05 09:15:38'),
        (4, 200, '2021-05-05 09:25:38'),
        (5, 200, '2021-05-05 10:15:38'),
        (1, 300, '2021-05-05 10:15:58'),
        (2, 300, '2021-05-05 10:25:58'),
        (3, 300, '2021-05-05 10:35:58'),
        (4, 300, '2021-05-05 10:45:58'),
        (4, 300, '2021-05-05 10:45:58'),
        (5, 300, '2021-05-05 10:55:58'),
        (1, 400, '2021-05-05 10:15:58'),
        (2, 400, '2021-05-05 10:25:58'),
        (1, 500, '2021-05-05 10:05:58'),
        (2, 500, '2021-05-05 10:35:58'),
        (1, 600, '2021-05-05 10:45:58'),
        (2, 600, '2021-05-05 10:55:58');
		