const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const port = 4000;
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.q43xx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
	//*Services Collection
	const servicesCollection = client.db("popularAgency").collection("services");

	//POST
	app.post("/addService", (req, res) => {
		const service = req.body;
		servicesCollection.insertOne(service).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	//GET
	app.get("/services", (req, res) => {
		servicesCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	//*Feedback Collection
	const feedbackCollection = client.db("popularAgency").collection("feedback");

	//POST
	app.post("/addFeedback", (req, res) => {
		const feedback = req.body;
		feedbackCollection.insertOne(feedback).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	//GET
	app.get("/feedback", (req, res) => {
		feedbackCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	//*Orders Collection
	const ordersCollection = client.db("popularAgency").collection("orders");

	//POST
	app.post("/addOrder", (req, res) => {
		const order = req.body;
		ordersCollection.insertOne(order).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});

	//GET
	app.get("/orders", (req, res) => {
		ordersCollection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	//GET
	app.get("/specificOrder", (req, res) => {
		ordersCollection.find({ email: req.query.email }).toArray((err, documents) => {
			res.send(documents);
		});
	});

	//DELETE
	app.delete("/delete/:id", (req, res) => {
		ordersCollection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
			res.send(result.deletedCount > 0);
		});
	});
});

app.listen(process.env.PORT || port);
