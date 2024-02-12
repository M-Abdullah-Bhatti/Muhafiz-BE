const contactModel = require("../models/contacts");

const createContact = async (req, res) => {
  try {
    const existingContact = await contactModel.findOne({
      phoneNumber: req.body.phoneNumber,
    });

    if (existingContact) {
      return res.status(400).json({ message: "Contact already exist" });
    }

    const result = await contactModel.create(req.body);

    return res
      .status(201)
      .json({ data: result, status: true, message: "Account is Created" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const getAllContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const contactsPerPage = parseInt(req.query.contactsPerPage) || 5;

    const totalContacts = await contactModel.countDocuments();

    if ((page - 1) * contactsPerPage >= totalContacts) {
      return res.status(200).json({
        status: false,
        message: "No more records",
      });
    }

    const allContacts = await contactModel
      .find()
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
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getSingleContact,
};
