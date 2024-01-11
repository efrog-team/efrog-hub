CREATE DATABASE db;

USE db;

CREATE TABLE task (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    task_id BIGINT UNSIGNED NOT NULL,
    version BIGINT UNSIGNED NOT NULL,
    version_name TEXT, 
    name TEXT NOT NULL,
    time_limit INT UNSIGNED NOT NULL,
    memory_limit INT UNSIGNED NOT NULL,
    statement TEXT NOT NULL,
    input_statement TEXT NOT NULL,
    output_statement TEXT NOT NULL,
    note TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE test (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    task_id BIGINT UNSIGNED NOT NULL,
    test_id BIGINT UNSIGNED NOT NULL,
    input TEXT NOT NULL,
    output TEXT NOT NULL,
    status TEXT NOT NULL,
    version BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE author (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    task_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    status TEXT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO task (task_id, version, version_name, name, time_limit, memory_limit, statement, input_statement, output_statement, note) VALUES (1, 0, 'Task creation','Square of a number', 1, 256, 'Your are given a number n. Return the square of n.', 'n <= 10^6', 'n ** 2', 'Nothing');

INSERT INTO author (task_id, user_id, status) VALUES (1, 1, 'author');

INSERT INTO test (task_id, test_id, input, output, status, version) VALUES (1, 1, '1', '1', 'Opened', 0);
INSERT INTO test (task_id, test_id, input, output, status, version) VALUES (1, 2, '2', '4', 'Closed', 0);
INSERT INTO test (task_id, test_id, input, output, status, version) VALUES (1, 3, '3', '9', 'Closed', 0);
INSERT INTO test (task_id, test_id, input, output, status, version) VALUES (1, 4, '4', '16', 'Closed', 0);
INSERT INTO test (task_id, test_id, input, output, status, version) VALUES (1, 5, '100', '10000', 'Closed', 0);
INSERT INTO test (task_id, test_id, input, output, status, version) VALUES (1, 6, '1000000', '1000000000000', 'Closed', 0);