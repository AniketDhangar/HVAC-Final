import { Contact } from "../models/ContactSchema.js";


const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ messsage: "contact added", success: true, contact });
  } catch (error) {
    res.status(500).json({ message: "contact not added", success: false });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ message: "All contacts", success: true, contacts });
  } catch (error) {
    res.status(500).json({ message: "No contacts found", success: false });
  }
};
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.body._id);
    res
      .status(200)
      .json({ message: "Contact deleted", success: true, contact });
  } catch (error) {
    res.status(500).json({ message: "Contact not deleted", success: false });
  }
};

const updateContact = async (req, res) => {
  try {
    const { _id } = req.body;
    const user = await Contact.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.status(200).json({ message: 'User updated', success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'User not updated', success: false });
  }
};

export { createContact, getContacts, deleteContact, updateContact };
