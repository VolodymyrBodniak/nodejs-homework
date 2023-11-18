const fs = require("node:fs/promises");
const path = require("node:path");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    } else {
      throw error;
    }
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === contactId) || null;
  } catch (error) {
    console.log("getContactById error ->", error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);

    if (index !== -1) {
      const [removedContact] = contacts.splice(index, 1);
      await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
      return removedContact;
    }
    return null;
  } catch (error) {
    console.log("removeContact error ->", error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = { id: Date.now(), name, email, phone };
    const contacts = await listContacts();
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.log("addContact error ->", error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
