const dbService = require("./dbService");

class Operation {
	constructor(data) {
		this.data = data;
		this.url = "";
	}

	parseIncomingData() {
		var parsedData = {};
		return parsedData;
	}

	async parseOutgoingData() {
		var outgoingData = [];
		var salesData = [];
		const db = dbService.getDbServiceInstance();
		const info = await db.getInfo();
		let timestamp;
		
		if (info) {
			timestamp = info[0].last_post;
		} else {
			timestamp = new Date();
		}
		
		const sales = await db.getSalesForPosting(timestamp);
		const products = await db.getProductsForPosting(timestamp);

		for (let element of sales) {
			let sale_items = await db.getSaleItemsBySaleId(element.id);
			salesData.push({
				sale: element,
				sale_items: sale_items,
			});
		}

		outgoingData.push({
			sales: salesData,
			products: products,
		});

		console.log(JSON.stringify(outgoingData, null, 2));
		return outgoingData;
	}

	makeRequest() {
		return;
	}

	async requestRegistration() {
		const { email, password } = this.data;
		const db = dbService.getDbServiceInstance();
		await db.setAppId("wertyrewr");
		const success = db.setAccessKey("aaaaaaaaaaa");
		return success;
	}
}

module.exports = { Operation };
