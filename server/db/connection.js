const { Sequelize } = require("sequelize");
const path = require("path");
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: path.resolve(__dirname, "store.db"),
	logging: false
});


module.exports.sequelize = sequelize