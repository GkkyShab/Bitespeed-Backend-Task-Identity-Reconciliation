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
app.post('/identify', async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    // Find contacts matching the email or phone number
    const contact = await Contact.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (!contact) {
      // If no contact exists, create a new primary contact
      const newContact = new Contact({
        phoneNumber,
        email,
        linkPrecedence: 'primary'
      });
      await newContact.save();

      // Return the newly created contact as primary with empty secondary contact ids
      return res.status(200).json({
        contact: {
          primaryContactId: newContact.id,
          emails: [email],
          phoneNumbers: [phoneNumber],
          secondaryContactIds: []
        }
      });
    }

    // Consolidate contacts
    const primaryContactId = contact.linkedId || contact.id;

    // Fetch all contacts linked to the primary contact
    const contacts = await Contact.find({
      $or: [
        { linkedId: primaryContactId },
        { id: primaryContactId }
      ]
    });

    const emails = new Set();
    const phoneNumbers = new Set();
    const secondaryContactIds = [];

    contacts.forEach(row => {
      if (row.linkPrecedence === 'primary') {
        emails.add(row.email);
        phoneNumbers.add(row.phoneNumber);
      } else {
        emails.add(row.email);
        phoneNumbers.add(row.phoneNumber);
        secondaryContactIds.push(row.id);
      }
    });

    // Add the email and phone number from the request if they are unique
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
        secondaryContactIds
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
