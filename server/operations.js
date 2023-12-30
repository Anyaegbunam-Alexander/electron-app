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
		var outgoingData = {};
		const db = dbService.getDbServiceInstance();
		const info = await db.getInfo();
		let timestamp;
		if (info) {
			timestamp = info[0].last_post;
		} else {
			timestamp = new Date();
		}
		const sales = await db.getSalesForPosting(timestamp);
		console.log(timestamp);
		console.log(sales);
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
