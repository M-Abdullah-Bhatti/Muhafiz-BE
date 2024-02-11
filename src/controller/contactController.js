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

    res
      .status(201)
      .json({ data: result, status: true, message: "Account is Created" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = {
  createContact,
};
