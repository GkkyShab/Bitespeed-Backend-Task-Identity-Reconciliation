import express from "express";
import bodyParser from "body-parser";
import Contact from "./models/contact.models.js";
import dotenv from "dotenv";
import db from "./db/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

// Middleware
app.use(bodyParser.json());

// Identify endpoint
app.post("/identify", async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    // Find or create the contact
    let contact = await Contact.findOne({ $or: [{ phoneNumber }, { email }] });

    if (!contact) {
      // If no contact exists, create a new primary contact
      contact = new Contact(req.body);
      await contact.save();
    }

    // Consolidate contacts
    const primaryContactId = contact ? (contact.linkedId || contact.id) : null;

    const contacts = await Contact.find({ linkedId: primaryContactId });

    const emails = new Set(); // Use a Set to store unique emails
    const phoneNumbers = new Set(); // Use a Set to store unique phone numbers
    const secondaryContactIds = [];

    contacts.forEach((row) => {
      if (row.linkPrecedence === "primary") {
        emails.add(row.email);
        phoneNumbers.add(row.phoneNumber);
      } else {
        emails.add(row.email);
        phoneNumbers.add(row.phoneNumber);
        secondaryContactIds.push(row.id);
      }
    });

    if (email && !emails.has(email)) {
      emails.add(email);
    }
    if (phoneNumber && !phoneNumbers.has(phoneNumber)) {
      phoneNumbers.add(phoneNumber);
    }

    res.status(200).json({
      contact: {
        primaryContactId,
        emails: [...emails],
        phoneNumbers: [...phoneNumbers],
        secondaryContactIds,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
