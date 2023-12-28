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
	const result = await db.getNames();
	let homeContent = await ejs.renderFile(getViewPath("home.ejs"), {
		names: result,
	});
	response.render("base", {
		body: homeContent,
		success: request.flash("success"),
	});
});

app.get("/about", async (request, response) => {
	let aboutContent = await ejs.renderFile(getViewPath("about.ejs"));
	response.render("base", { body: aboutContent });
});

app.get("/form", async (request, response) => {
	const db = dbService.getDbServiceInstance();
	let formContent = await ejs.renderFile(getViewPath("form.ejs"));
	response.render("base", { body: formContent });
});

app.post("/submit-form", (request, response) => {
	const db = dbService.getDbServiceInstance();
	const { name, about } = request.body;
	const result = db.insertNewName(name, about);
	request.flash("success", "Form submitted successfully!");
	response.redirect("/home");
});

app.get("/user/:id", async (request, response) => {
	const db = dbService.getDbServiceInstance();
	const { id } = request.params;
	const result = await db.getOneNameById(id);
	let userContent = await ejs.renderFile(getViewPath("user.ejs"), {
		user: result[0],
	});
	response.render("base", {
		body: userContent,
		success: request.flash("success"),
	});
});

app.listen(3459, () => {
	console.log("app is running");
});

exports.expressApp = app;
