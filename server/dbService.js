const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "store.db");
let instance = null;
const inStore = "In Store";
const inApp = "Ven3";
const infoId = 1;

class DbService {
	constructor() {
		this.db = new sqlite3.Database(
			dbPath,
			sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
			(err) => {
				if (err) {
					console.error(err.message);
				}
				// console.log('Connected to the people database.');
			}
		);
	}
	/*
	To resolve the issue of creating a new database connection every time,
	a new instance of DbService is created, the Singleton pattern is used.
	This pattern restricts the instantiation of a class to a single
	instance and provides a global point of access to it. Hence the need
	for the getDbServiceInstance method.
	*/
	static getDbServiceInstance() {
		return instance ? instance : new DbService();
	}

	getInfo() {
		return new Promise((resolve, reject) => {
			this.db.all("SELECT * FROM info WHERE id = ?", [infoId], (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	setAppId(id) {
		return new Promise((resolve, reject) => {
			this.db.run(
				`INSERT INTO info (id, store_id) 
				VALUES (?, ?) 
				ON CONFLICT(id) DO UPDATE SET store_id=excluded.store_id;
				;`,
				[infoId, id],
				function (err) {
					if (err) {
						reject(err);
					} else {
						resolve(this.lastID);
					}
				}
			);
		});
	}

	setAccessKey(key) {
		return new Promise((resolve, reject) => {
			this.db.run(
				"UPDATE info SET access_key = ? WHERE id = ?;",
				[key, infoId],
				function (err) {
					if (err) {
						reject(err);
						return false;
					} else {
						resolve(this.changes);
						console.log(`Row(s) updated: ${this.changes}`);
						return this.changes === 1 ? true : false;
					}
				}
			);
		});
	}

	getProducts() {
		return new Promise((resolve, reject) => {
			this.db.all("SELECT * FROM products", (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	getOneProductById(id) {
		id = parseInt(id, 10);
		return new Promise((resolve, reject) => {
			this.db.all(
				"SELECT * FROM products WHERE id = ? ",
				[id],
				function (err, rows) {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				}
			);
		});
	}

	updateProductById(id, name, price, quantity, source = inStore) {
		id = parseInt(id, 10);
		const date = new Date();
		return new Promise((resolve, reject) => {
			this.db.run(
				"UPDATE products SET name = ?, price = ?, quantity = ?, modified = ?, source = ? WHERE id = ?",
				[name, price, quantity, date, source, id],
				function (err) {
					if (err) {
						reject(err);
						return false;
					} else {
						resolve(this.changes);
						console.log(`Row(s) updated: ${this.changes}`);
						return this.changes === 1 ? true : false;
					}
				}
			);
		});
	}

	getSales() {
		return new Promise((resolve, reject) => {
			this.db.all("SELECT * FROM sales", (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	getOneSaleById(id) {
		id = parseInt(id, 10);
		return new Promise((resolve, reject) => {
			this.db.all(
				`SELECT * FROM sales WHERE id = ? `,
				[id],
				function (err, rows) {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				}
			);
		});
	}

	getSaleItemsBySaleId(id) {
		id = parseInt(id, 10);
		return new Promise((resolve, reject) => {
			this.db.all(
				`SELECT sale_items.quantity AS sale_item_quantity, 
				products.quantity AS product_quantity,
				sale_items.*, 
				products.*
				FROM sale_items
				JOIN products ON sale_items.product_id = products.id
				WHERE sale_items.sale_id = ?
				`,
				[id],
				(err, rows) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				}
			);
		});
	}

	insertNewProduct(name, code, price, quantity) {
		const date = new Date();
		return new Promise((resolve, reject) => {
			this.db.run(
				"INSERT INTO products (name, code, price, quantity, created, modified, source) VALUES (?, ?, ?, ?, ?, ?, ?);",
				[name, code, price, quantity, date, date, inStore],
				function (err) {
					if (err) {
						reject(err);
					} else {
						resolve(this.lastID);
					}
				}
			);
		});
	}

	insertNewSale(date, total_amount = null) {
		return new Promise((resolve, reject) => {
			this.db.run(
				"INSERT INTO sales (date, total_amount, source) VALUES (?, ?, ?)",
				[date, total_amount ? total_amount : 0, inStore],
				function (err) {
					if (err) {
						reject(err);
					} else {
						resolve(this.lastID);
					}
				}
			);
		});
	}

	async insertSaleItems(sale_items, total_amount) {
		const date = new Date();
		try {
			// add a new sale
			const sale_id = await this.insertNewSale(date, total_amount);
			return new Promise((resolve, reject) => {
				// insert sale items
				sale_items.forEach((element) => {
					const { product_id, amount, quantity } = element;
					this.db.run(
						"INSERT INTO sale_items (sale_id, product_id, amount, quantity, date, source) VALUES (?, ?, ?, ?, ?, ?)",
						[sale_id, product_id, amount, quantity, date, inStore],
						function (err) {
							if (err) {
								reject(err);
							} else {
								resolve(this.lastID);
							}
						}
					);
					// Update the quantity of the product
					this.db.run(
						"UPDATE products SET quantity = quantity - ? WHERE id = ?",
						[quantity, product_id],
						function (err) {
							if (err) {
								console.log(err);
							}
						}
					);
				});
				resolve(sale_id);
			});
		} catch (err) {
			console.log(err);
			return;
		}
	}

	getSalesForPosting(timestamp) {
		return new Promise((resolve, reject) => {
			this.db.all(
				"SELECT * FROM sales WHERE date > ?",
				[timestamp],
				(err, rows) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				}
			);
		});
	}
}
module.exports = DbService;
