const contactModel = require("../models/contacts");

const createContact = async (req, res) => {
  try {
    // Add user to the contact's body if not already included
    req.body.user = req.user; // assuming req.user contains the user's identifier

    const existingContact = await contactModel.findOne({
      phoneNumber: req.body.phoneNumber,
      user: req.body.user, // Ensure we're checking within the context of the logged-in user
    });

    if (existingContact) {
      return res.status(400).json({ message: "Contact already exists" });
    }

    const result = await contactModel.create(req.body);

    return res
      .status(201)
      .json({ data: result, status: true, message: "New contact added!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllMyContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const contactsPerPage = parseInt(req.query.contactsPerPage) || 5;

    // Count only contacts that belong to the logged-in user
    const totalContacts = await contactModel.countDocuments({ user: req.user });

    if ((page - 1) * contactsPerPage >= totalContacts) {
      return res.status(200).json({
        status: false,
        message: "No more records",
      });
    }

    const allContacts = await contactModel
      .find({ user: req.user }) // Ensure we're fetching contacts for the logged-in user
      .skip((page - 1) * contactsPerPage)
      .limit(contactsPerPage);

    if (allContacts.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No Record Found",
      });
    }

    let data = {
      currentPage: page,
      contactsPerPage: contactsPerPage,
      totalContacts: totalContacts,
      contacts: allContacts,
    };

    return res.status(200).json({
      status: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getSingleContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    console.log("contactId-->");
    console.log(contactId);

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid contact ID",
      });
    }

    const foundContact = await contactModel.findById(contactId);

    if (!foundContact) {
      return res.status(404).json({
        status: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: foundContact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createContact,
  getAllMyContacts,
  getSingleContact,
};
