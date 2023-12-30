CREATE TABLE "products" (
	"id"	INTEGER NOT NULL,
	"code"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"price"	REAL NOT NULL,
	"quantity"	INTEGER NOT NULL,
	"created"	INTEGER NOT NULL,
	"modified"	INTEGER NOT NULL,
	"source"	TEXT,
	"server_id"	TEXT,
	"is_verified"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "sales" (
	"id"	INTEGER NOT NULL,
	"total_amount"	REAL NOT NULL,
	"date"	INTEGER NOT NULL,
	"source"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "sale_items" (
	"id"	INTEGER NOT NULL,
	"sale_id"	INTEGER NOT NULL,
	"product_id"	INTEGER,
	"amount"	REAL NOT NULL,
	"quantity"	NUMERIC NOT NULL,
	"date"	INTEGER NOT NULL,
	"source"	TEXT,
	FOREIGN KEY("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE,
	FOREIGN KEY("product_id") REFERENCES "products"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "info" (
	"id"	INTEGER NOT NULL,
	"store_id"	TEXT,
	"access_key"	TEXT,
	"last_get"	INTEGER,
	"last_post"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);