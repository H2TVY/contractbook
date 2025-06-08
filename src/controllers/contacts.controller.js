const contactsService = require("../services/contacts.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

const DEFAULT_AVATAR = "/public/images/blank-profile-picture.png";

function getAvatarUrlPath(file) {
  return file ? `/public/uploads/${file.filename}` : DEFAULT_AVATAR;
}

async function createContact(req, res, next) {
  try {
    const contactData = {
      ...req.body,
      avatar: getAvatarUrlPath(req.file),
    };

    const contact = await contactsService.createContact(contactData);
    return res
      .status(201)
      .set({
        Location: `${req.baseUrl}/${contact.id}`,
      })
      .json(
        JSend.success({
          contact,
        })
      );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

function getContactsByFilter(req, res) {
  const filters = [];
  const { favorite, name } = req.query;
  if (favorite !== undefined) {
    filters.push(`favorite=${favorite}`);
  }
  if (name) {
    filters.push(`name=${name}`);
  }
  console.log(filters.join("&"));
  return res.json(
    JSend.success({
      contacts: [],
    })
  );
}
function getContact(req, res) {
  return res.json(JSend.success({ contact: {} }));
}
function updateContact(req, res) {
  return res.json(JSend.success({ contact: {} }));
}
function deleteContact(req, res) {
  return res.json(JSend.success());
}
function deleteAllContacts(req, res) {
  return res.json(JSend.success());
}

module.exports = {
  getContactsByFilter,
  deleteAllContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
