const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const dbService = require("./dbService");

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
	const db = dbService.getDbServiceInstance();
	let homeContent = await ejs.renderFile(getViewPath("home.ejs"));
	response.render("base", {
		body: homeContent,
		success: request.flash("success"),
	});
});

app.get("/about", async (request, response) => {
	let aboutContent = await ejs.renderFile(getViewPath("about.ejs"));
	response.render("base", { body: aboutContent });
});

app.get("/products", async (request, response) => {
	const db = dbService.getDbServiceInstance();
	const result = await db.getProducts();
	let productsContent = await ejs.renderFile(getViewPath("products.ejs"), {
		products: result,
	});
	response.render("base", {
		body: productsContent,
		success: request.flash("success"),
	});
});

app.post("/products", async (request, response) => {
	const { name, code, price, quantity } = request.body;
	const db = dbService.getDbServiceInstance();
	const id = await db.insertNewProduct(name, code, price, quantity);
	request.flash("success", "Product added!");
	response.redirect(`/products/${id}`);
});


app.get("/products/add", async (request, response) => {
	let formContent = await ejs.renderFile(getViewPath("add_product.ejs"));
	response.render("base", { body: formContent });
});

app.get("/products/:id", async (request, response) => {
	const db = dbService.getDbServiceInstance();
	const { id } = request.params;
	const result = await db.getOneProductById(id);
	let productContent = await ejs.renderFile(getViewPath("one_product.ejs"), {
		product: result[0],
	});
	response.render("base", {
		body: productContent,
		success: request.flash("success"),
	});
});

app.get("/products/:id/edit", async (request, response) => {
	const db = dbService.getDbServiceInstance();
	const { id } = request.params;
	const result = await db.getOneProductById(id);
	let productContent = await ejs.renderFile(getViewPath("edit_product.ejs"), {
		product: result[0],
	});
	response.render("base", {
		body: productContent,
		success: request.flash("success"),
	});
});

app.post("/products/:id/update", async (request, response) => {
	const { id } = request.params;
	const { name, price, quantity } = request.body;
	const db = dbService.getDbServiceInstance();
	await db.updateProductById(id, name, price, quantity);
	request.flash("success", "Product updated!");
	response.redirect(`/products/${id}/edit`);
});

app.get("/sales", async (request, response) => {
	const db = dbService.getDbServiceInstance();
	const sales = await db.getSales();
	let salesContent = await ejs.renderFile(getViewPath("sales.ejs"), {
		sales: sales,
	});
	response.render("base", {
		body: salesContent,
		success: request.flash("success"),
	});
});

app.get("/sales/:id", async (request, response) => {
	const db = dbService.getDbServiceInstance();
	const { id } = request.params;
	const sale = await db.getOneSaleById(id);
	const sale_items = await db.getSaleItemsBySaleId(id);
	let productContent = await ejs.renderFile(getViewPath("one_sale.ejs"), {
		sale: sale[0],
		sale_items: sale_items,
	});
	response.render("base", {
		body: productContent,
		success: request.flash("success"),
	});
});

app.listen(3459, () => {
	console.log("app is running");
});

exports.expressApp = app;
