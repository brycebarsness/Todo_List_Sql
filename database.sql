CREATE TABLE "tasks" (
"id" SERIAL PRIMARY KEY,
"item" varchar(200),
"complete" varchar(1),
"due_date" DATE
);

SELECT * "tasks"