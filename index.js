const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://moveAidUser:moveAidUser123@moveaidcluster.ejtjr.mongodb.net/move?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const servicesCollection = client.db("move").collection("services");
  const reviewsCollection = client.db("move").collection("reviews");
  const bookingsCollection = client.db("move").collection("bookings");
  const usersCollection = client.db("move").collection("users");
  // perform actions on the collection object

  //servicesCollection
  // post new services
  app.post("/addNewServices", (req, res) => {
    const newService = req.body;
    servicesCollection
      .insertOne(newService)
      .then((result) => res.send(result.insertedCount > 0));
  });

  // fetch all services from database
  app.get("/services", (req, res) => {
    servicesCollection
      .find({})
      .toArray((err, documents) => res.send(documents));
  });

  // fetch specific service from database
  app.get("/services/:serviceId", (req, res) => {
    servicesCollection
      .find({ _id: ObjectId(req.params.serviceId) })
      .toArray((err, documents) => res.send(documents[0]));
  });

  // update specific service in database using id
  app.patch("/updateService/:serviceId", (req, res) => {
    servicesCollection
      .updateOne(
        { _id: ObjectId(req.params.serviceId) },
        {
          $set: {
            serviceName: req.body.serviceName,
            image: req.body.image,
            description: req.body.description,
            serviceCharge: req.body.serviceCharge,
            updateTime: req.body.updateTime,
          },
        }
      )
      .then((result) => console.log(result));
  });

  // delete specific service from database using id
  app.delete("/deleteService/:serviceId", (req, res) => {
    servicesCollection
      .deleteOne({ _id: ObjectId(req.params.serviceId) })
      .then((result) => res.send(result.deletedCount > 0));
  });

  //reviewsCollection
  // post new review
  app.post("/addNewReview", (req, res) => {
    const newReview = req.body;
    reviewsCollection
      .insertOne(newReview)
      .then((result) => res.send(result.insertedCount > 0));
  });

  // fetch all reviews from database
  app.get("/reviews", (req, res) => {
    reviewsCollection.find({}).toArray((err, documents) => res.send(documents));
  });

  // bookingsCollection
  // post new bookings
  app.post("/addNewBooking", (req, res) => {
    const newBooking = req.body;

    bookingsCollection
      .insertOne(req.body)
      .then((result) => res.send(result.insertedCount > 0));
  });

  // fetch all bookings from database
  app.get("/bookings", (req, res) => {
    bookingsCollection
      .find({})
      .toArray((err, documents) => res.send(documents));
  });

  // update specific booking in database using id
  app.patch("/updateBookings/:bookingId", (req, res) => {
    bookingsCollection
      .updateOne(
        { _id: ObjectId(req.params.bookingId) },
        {
          $set: {
            status: req.body.status,
          },
        }
      )
      .then((result) => console.log(result));
  });

  // usersCollection
  // post new user
  app.post("/addNewUser", (req, res) => {
    const newUser = req.body;
    usersCollection.find({ email: newUser.email }).toArray((err, users) => {
      if (users.length === 0) {
        usersCollection
          .insertOne(newUser)
          .then((result) => res.send(result.insertedCount > 0));
      }
    });
  });

  // check admin
  app.post("/isAdmin", (req, res) => {
    usersCollection
      .find({ email: req.body.email })
      .toArray((err, adminUsers) => {
        res.send(adminUsers[0]);
      });
  });

  // post new admin user
  app.post("/addNewAdminUser", (req, res) => {
    const newAdminUser = req.body;
    usersCollection
      .insertOne(newAdminUser)
      .then((result) => res.send(result.insertedCount > 0));
  });

  console.log("DB connected");
});

app.get("/", (req, res) => {
  res.send("moveAid Server");
});

app.listen(PORT, () => {
  console.log(`moveAid Server listening at http://localhost:${PORT}`);
});
