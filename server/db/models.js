/*!--------------------------------------------------------
 * Copyright (C) Alexander Anyaegbunam. All rights reserved.
 *--------------------------------------------------------*/
const { DataTypes } = require("sequelize");
const { sequelize } = require("./connection.js");
const inStore = "In Store";
const inApp = "Ven3";
const infoId = 1;

const Product = sequelize.define("Product", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	code: DataTypes.INTEGER,
	name: DataTypes.STRING,
	price: DataTypes.FLOAT,
	quantity: DataTypes.INTEGER,
	source: DataTypes.STRING,
	server_id: {
		type: DataTypes.STRING,
		unique: true,
	},
	is_verified: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});

const Sale = sequelize.define(
	"Sale",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		total_amount: DataTypes.FLOAT,
		source: DataTypes.STRING,
	},
	{
		updatedAt: false,
	}
);

const SaleItem = sequelize.define(
	"SaleItem",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		sale_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Sale,
				key: "id",
			},
			onDelete: "CASCADE",
		},
		product_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Product,
				key: "id",
			},
		},
		amount: DataTypes.FLOAT,
		quantity: DataTypes.INTEGER,
		source: DataTypes.STRING,
	},
	{
		updatedAt: false,
	}
);

const Info = sequelize.define(
	"Info",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		store_id: DataTypes.STRING,
		access_key: DataTypes.STRING,
		last_get: DataTypes.DATE,
		last_post: DataTypes.DATE,
		is_registered: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		timestamps: false,
	}
);

Product.hasMany(SaleItem, { foreignKey: "product_id" });
SaleItem.belongsTo(Product, { foreignKey: "product_id" });
Sale.hasMany(SaleItem, { foreignKey: "sale_id" });
SaleItem.belongsTo(Sale, { foreignKey: "sale_id" });

module.exports = { Product, Sale, SaleItem, Info, infoId, inApp, inStore };
