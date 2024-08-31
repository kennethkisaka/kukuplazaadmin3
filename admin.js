const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
const http = require('http');
const WebSocket = require('ws');

dotenv.config();

const app = express();
const PORT = 8090;
const hostname = "0.0.0.0";

app.use(bodyParser.json());
app.use(express.static('public'));

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    throw err;
  }
}
run();

const dbName = "kukuplaza";
const collectionName = "kukuplaza";

const database = client.db(dbName);
const collection = database.collection(collectionName);

// HTTP Routes

app.get('/transactions', async (req, res) => {
  const transactions = await collection.find({}).toArray();
  if (!transactions) {
    await collection.insertOne({
      "transaction_pin": 24212634716,
      "checkoutrequestid": "ws_CO_24082024173351619700128839",
      "customer": "kenneth kawwa",
      "productid": "Broiler-Chicken",
      "location": "Mombasa",
      "quantity": "2",
      "mpesa_number": "0700128839",
      "phone_number": "0700128839",
      "transactiondate": "20240824173335",
      "amount": "1000",
      "payment_status": "paid",
      "delivery_status": "false"
    });
  }
  res.json(transactions);
});

app.get('/statistics', async (req, res) => {
  try {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentDate = new Date();
    const currentMonthName = monthNames[currentDate.getMonth()].toLowerCase();
    const currentYear = currentDate.getFullYear();

    const findOneResult = await collection.findOne({ month: currentMonthName, year: currentYear });

    if (!findOneResult) {
      await collection.insertOne({
        year: currentYear,
        month: currentMonthName,
        total_sales: 0,
        hen_sold: 0,
        broilers: 0,
        kienyeji: 0,
        sales: []
      });
    }

    res.json(findOneResult);
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ error: 'Unable to fetch statistics' });
  }
});

app.post('/update-stock', async (req, res) => {
  const { action, type, quantity } = req.body;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentDate = new Date();
  const currentMonthName = monthNames[currentDate.getMonth()].toLowerCase();
  const currentYear = currentDate.getFullYear();

  const findOneResult = await collection.findOne({ month: currentMonthName, year: currentYear });

  if (!findOneResult) {
    await collection.insertOne({
      year: currentYear,
      month: currentMonthName,
      total_sales: 0,
      hen_sold: 0,
      broilers: 0,
      kienyeji: 0,
      sales: []
    });
  }

  if (findOneResult) {
    const updateOptions = { returnOriginal: false };
    if (type === 'broilers') {
      const updatedValue = action === 'increase'
        ? findOneResult.broilers + quantity
        : findOneResult.broilers - quantity;
      const updateDoc = { $set: { broilers: updatedValue } };

      await collection.findOneAndUpdate(
        { month: currentMonthName, year: currentYear },
        updateDoc,
        updateOptions
      );
    } else if (type === 'kienyeji') {
      const updatedValue = action === 'increase'
        ? findOneResult.kienyeji + quantity
        : findOneResult.kienyeji - quantity;
      const updateDoc = { $set: { kienyeji: updatedValue } };

      await collection.findOneAndUpdate(
        { month: currentMonthName, year: currentYear },
        updateDoc,
        updateOptions
      );
    }

    res.json({ message: 'Stock updated successfully' });
  }
});

// Create the HTTP server
const server = http.createServer(app);

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket server logic
wss.on('connection', (ws) => {
  console.log('New client connected');
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(PORT, hostname, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

