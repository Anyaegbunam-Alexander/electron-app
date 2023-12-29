CREATE TABLE "products" (
	"id"	INTEGER NOT NULL,
	"code"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"price"	REAL NOT NULL,
	"quantity"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "sales" (
	"id"	INTEGER NOT NULL,
	"total_amount"	REAL NOT NULL,
	"date"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "sale_items" (
	"id"	INTEGER NOT NULL,
	"sale_id"	INTEGER NOT NULL,
	"product"	INTEGER,
	"amount"	REAL NOT NULL,
	"quantity"	NUMERIC NOT NULL,
	"date"	INTEGER NOT NULL,
	FOREIGN KEY("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE,
	FOREIGN KEY("product") REFERENCES "products"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "info" (
	"store_id"	TEXT
)
