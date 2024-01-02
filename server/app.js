/*!--------------------------------------------------------
 * Copyright (C) Alexander Anyaegbunam. All rights reserved.
 *--------------------------------------------------------*/

const express = require("express");
const app = express();
const electron = require("electron");
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const Operation = require("./operations").Operation;
const { sequelize } = require("./db/connection.js");
const {
	Product,
	Sale,
	SaleItem,
	Info,
	inStore,
	infoId,
} = require("./db/models.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: "your secret key",
		resave: false,
		saveUninitialized: true,
	})
);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

function getViewPath(viewName) {
	return path.join(__dirname, "views", viewName);
}

app.get("/home", async (request, response) => {
	let homeContent = await ejs.renderFile(getViewPath("home.ejs"));
	response.render("base", {
		body: homeContent,
		success: request.flash("success"),
	});
});

app.get("/about", async (request, response) => {
	let appVersion = electron.app.getVersion();
	const info = await Info.findByPk(infoId);
	let aboutContent = await ejs.renderFile(getViewPath("about.ejs"), {
		info: info,
		appVersion: appVersion,
	});
	response.render("base", {
		body: aboutContent,
		success: request.flash("success"),
		warning: request.flash("warning"),
		danger: request.flash("danger"),
	});
});
app.post("/register", async (request, response) => {
	const { email, password } = request.body;
	try {
		const operation = await Operation.create();
		const success = await operation.requestRegistration({
			email: email,
			password: password,
		});

		if (success) {
			request.flash("success", "Registration Successful!");
		} else {
			request.flash("danger", "Registration Unsuccessful!");
		}
	} catch (error) {
		console.log(error);
		request.flash("danger", "Registration Unsuccessful!");
	}
	response.redirect("/about");
});

app.get("/products", async (request, response) => {
	const products = await Product.findAll();
	let productsContent = await ejs.renderFile(getViewPath("products.ejs"), {
		products: products,
	});
	response.render("base", {
		body: productsContent,
		success: request.flash("success"),
	});
});

app.post("/products", async (request, response) => {
	const { name, code, price, quantity } = request.body;
	const product = await Product.create({
		name: name,
		code: code,
		price: price,
		quantity: quantity,
		source: inStore,
	});
	request.flash("success", "Product added!");
	response.redirect(`/products/${product.id}`);
});

app.get("/products/add", async (request, response) => {
	let formContent = await ejs.renderFile(getViewPath("add_product.ejs"));
	response.render("base", { body: formContent });
});

app.get("/products/:id", async (request, response) => {
	const { id } = request.params;
	const product = await Product.findByPk(id);
	let productContent = await ejs.renderFile(getViewPath("one_product.ejs"), {
		product: product,
	});
	response.render("base", {
		body: productContent,
		success: request.flash("success"),
	});
});

app.get("/products/:id/edit", async (request, response) => {
	const { id } = request.params;
	const product = await Product.findByPk(id);
	let productContent = await ejs.renderFile(getViewPath("edit_product.ejs"), {
		product: product,
	});
	response.render("base", {
		body: productContent,
		success: request.flash("success"),
	});
});

app.post("/products/:id/update", async (request, response) => {
	const { id } = request.params;
	const { name, price, quantity } = request.body;
	const product = await Product.findByPk(id);
	product.set({
		name: name,
		price: price,
		quantity: quantity,
	});
	await product.save();
	request.flash("success", "Product updated!");
	response.redirect(`/products/${id}`);
});

app.post("/products/:id/code/", async (request, response) => {
	const { id } = request.params;
	const { code, server_id } = request.body;
	const product = await Product.findByPk(id);
	product.set({
		code: code,
		server_id: server_id,
	});
	await product.save();
	request.flash("success", "Product updated!");
	response.redirect(`/products/${id}`);
});

app.get("/sales", async (request, response) => {
	const sales = await Sale.findAll();
	let salesContent = await ejs.renderFile(getViewPath("sales.ejs"), {
		sales: sales,
	});
	response.render("base", {
		body: salesContent,
		success: request.flash("success"),
	});
});

app.post("/sales", async (request, response) => {
	const { product_id, amount, quantity } = request.body;
	let sales = [];
	let totalAmount = 0;
	if (Array.isArray(product_id)) {
		sales = product_id.map((id, index) => {
			const floatAmount = parseFloat(amount[index]);
			totalAmount += floatAmount;
			return {
				product_id: parseInt(id, 10),
				amount: floatAmount,
				quantity: parseInt(quantity[index], 10),
			};
		});
	} else {
		totalAmount = amount;
		sales.push({
			product_id: parseInt(product_id, 10),
			amount: parseFloat(amount),
			quantity: parseInt(quantity, 10),
		});
	}
	const sale = await Sale.create({
		total_amount: totalAmount,
		source: inStore,
	});

	for (let element of sales) {
		const { product_id, amount, quantity } = element;
		await SaleItem.create({
			sale_id: sale.id,
			product_id: product_id,
			quantity: quantity,
			amount: amount,
			source: inStore,
		});
	}
	request.flash("success", "Sale recorded!");
	response.redirect(`/sales/${sale.id}`);
});

app.get("/sales/add", async (request, response) => {
	const products = await Product.findAll();
	let addSaleContent = await ejs.renderFile(getViewPath("add_sale.ejs"), {
		products: products,
	});
	response.render("base", {
		body: addSaleContent,
		success: request.flash("success"),
	});
});

app.get("/sales/:id", async (request, response) => {
	const { id } = request.params;
	const sale = await Sale.findByPk(id, {
		include: [
			{
				model: SaleItem,
				include: [Product],
			},
		],
	});
	let productContent = await ejs.renderFile(getViewPath("one_sale.ejs"), {
		sale: sale,
	});
	response.render("base", {
		body: productContent,
		success: request.flash("success"),
	});
});

// sequelize.sync()
  //   .then(() => {
    //     console.log('Database & tables created!');
  //   });

let server = app.listen(3459, () => {
	console.log("app is running");
});



exports.expressServer = server;
exports.sequelize = sequelize;
