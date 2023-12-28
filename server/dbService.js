const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "people.db");
let instance = null;

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

	static getDbServiceInstance() {
		return instance ? instance : new DbService();
	}

	getNames() {
		return new Promise((resolve, reject) => {
			this.db.all("SELECT * FROM NAMES", (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}
	insertNewName(name, about) {
		return new Promise((resolve, reject) => {
			this.db.run(
				"INSERT INTO names (name, about) VALUES (?, ?);",
				[name, about],
				function (err) {
					if (err) {
						reject(err);
					} else {
						resolve({
							id: this.lastID,
							name: name,
							about: about,
						});
					}
				}
			);
		});
	}
	getOneNameById(id) {
        id = parseInt(id, 10);
		return new Promise((resolve, reject) => {
			this.db.all("SELECT * FROM names WHERE id = ? ", [id], function (err, rows) {
				if ((err)) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}
}
module.exports = DbService;
