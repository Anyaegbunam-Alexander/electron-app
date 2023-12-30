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

	parseOutgoingData() {
		var outgoingData = {};
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
