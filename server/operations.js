/*!--------------------------------------------------------
 * Copyright (C) Alexander Anyaegbunam. All rights reserved.
 *--------------------------------------------------------*/

const {
	Product,
	Sale,
	SaleItem,
	Info,
	infoId,
	inApp,
} = require("./db/models.js");
const { Op } = require("sequelize");
const URL = "http://127.0.0.1:8000";

class Operation {
	constructor(info) {
		this.info = info;
	}

	static async create() {
		const info = await Info.findByPk(infoId);
		return new Operation(info);
	}

	async parseIncomingStockData(stock) {
		console.log("stock:", JSON.stringify(stock));
		try {
			for (let element of stock) {
				var { price, quantity, product, created, modified } = element;
				let productFromDB = await Product.findOne({
					where: {
						server_id: product.id,
					},
				});

				if (!productFromDB) {
					productFromDB = await Product.findOne({
						where: {
							code: product.code,
						},
					});
				}

				if (productFromDB) {
					productFromDB.set({
						price: price,
						quantity: quantity,
						updatedAt: new Date(modified),
						server_id: product.id,
						is_verified: true,
					});
				} else {
					productFromDB = Product.build({
						code: product.code,
						name: product.name,
						price: price,
						quantity: quantity,
						source: inApp,
						server_id: product.id,
						is_verified: true,
						createdAt: new Date(created),
						updatedAt: new Date(modified),
					});
				}

				await productFromDB.save();
			}
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	async parseIncomingSalesData(sales) {
		console.log("sales:", JSON.stringify(sales));
		try {
			for (let saleElement of sales) {
				var { sale_items, total_amount, created } = saleElement;
				const sale = await Sale.create({
					total_amount: total_amount,
					createdAt: new Date(created),
					source: inApp,
				});
				for (let saleItemElement of sale_items) {
					const productFromDB = await Product.findOne({
						where: {
							server_id: saleItemElement.stock.product.id,
						},
					});

					await SaleItem.create({
						sale_id: sale.id,
						product_id: productFromDB.id,
						amount: saleItemElement.amount,
						quantity: saleItemElement.quantity,
						source: inApp,
						createdAt: new Date(created),
					});
				}
			}
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	async parseOutgoingSalesData() {
		if (!this.info) {
			return null;
		}

		const include = [
			{
				model: SaleItem,
				include: [Product],
			},
		];

		let where = {};
		if (this.info.last_post) {
			where = {
				createdAt: {
					[Op.gt]: this.info.last_post,
				},
			};
		}

		const sales = await Sale.findAll({ where, include });
		return sales;
	}

	async parseOutgoingProductsData() {
		if (!this.info) {
			return null;
		}

		let where = {};
		if (this.info.last_post) {
			where = {
				updatedAt: {
					[Op.gt]: this.info.last_post,
				},
			};
		}

		const products = await Product.findAll({ where });
		return products;
	}

	async makeHttpRequest(url, method, body, allow_null_info = false) {
		if (!this.info && !allow_null_info) {
			return null;
		}

		let access_key;
		if (this.info) {
			access_key = this.info.access_key;
		} else {
			access_key = undefined;
		}

		try {
			const response = await fetch(url, {
				headers: {
					"Content-type": "application/json",
					Authorization: `AccessKey ${access_key}`,
				},
				method: method,
				body: body ? JSON.stringify(body, null, 4) : undefined,
			});

			if (!response.ok) {
				const errorMessage = await response.json();
				throw new Error(
					`HTTP error! status: ${response.status}, message: ${JSON.stringify(
						errorMessage
					)}`
				);
			}

			return await response.json();
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	async makeGetRequest() {
		const url = `${URL}/applications/send-data/`;

		const data = await this.makeHttpRequest(url, "GET");

		if (data) {
			console.log(data)
			const { stock, sales, access_key } = data;

			this.info.access_key = access_key;
			this.info.last_get = new Date();
			await this.info.save();

			await this.parseIncomingStockData(stock);
			await this.parseIncomingSalesData(sales);

			console.log("Get Success!!!");
			// console.log(JSON.stringify(data, null, 2));
			return true;
		}

		return false;
	}

	async makePostRequest() {
		const sales = await this.parseOutgoingSalesData();
		const products = await this.parseOutgoingProductsData();

		if (!sales || !products) {
			return false;
		}

		const url = `${URL}/applications/receive-data/`;

		const body = {
			sales: sales,
			stock: products,
		};

		const data = await this.makeHttpRequest(url, "POST", body);

		if (data) {
			const { access_key } = data;
			this.info.access_key = access_key;
			this.info.last_post = new Date();
			await this.info.save();

			console.log("POST Success!!!");
			return true;
		}

		return false;
	}

	async requestRegistration(data) {
		const { email, password } = data;

		try {
			const url = `${URL}/applications/register/`;
			const body = {
				email: email,
				password: password,
			};

			const data = await this.makeHttpRequest(url, "POST", body, true);

			if (data) {
				if (!this.info) {
					this.info = Info.build({
						id: infoId,
						store_id: data.app_id,
						access_key: data.access_key,
						is_registered: true,
					});
				} else {
					this.info.set({
						store_id: data.app_id,
						access_key: data.access_key,
						is_registered: true,
					});
				}
				await this.info.save();
				return true;
			}
		} catch (err) {
			console.log(err);
		}

		return false;
	}
}

module.exports = { Operation };
