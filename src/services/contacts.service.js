const knex = require("../database/knex");
const Paginator = require("./paginator");
const { unlink } = require("node:fs");

/**
 * @import { z } from 'zod';
 * @import {
 * contactSchema,
 * partialContactSchema,
 * } from ' ./schemas/contact.schemas';
 * @typedef {z.infer<typeof contactSchema>} Contact
 * @typedef {z.infer<typeof partialContactSchema>} PartialContact
 */

function contactRepository() {
  return knex("contacts");
}

/**
 *
 * @param {PartialContact} payload
 * @returns {PartialContact}
 */

function readContactData(payload) {
  return {
    ...(payload.name && { name: payload.name }),
    ...(payload.email && { email: payload.email }),
    ...(payload.address && { address: payload.address }),
    ...(payload.phone && { phone: payload.phone }),
    ...(payload.favorite !== undefined && { favorite: payload.favorite }),
    ...(payload.avatar && { avatar: payload.avatar }),
  };
}

/**
 *
 * @param {Object} payload
 * @returns {Promise<Contact>}
 */
async function createContact(payload) {
  const contactData = readContactData(payload);
  const [inserted] = await contactRepository()
    .insert(contactData)
    .returning("*");
  return inserted;
}

async function getManyContacts(query) {
  const { name, favorite, page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);

  const results = await contactRepository()
    .where((builder) => {
      if (name) {
        builder.where("name", "like", `%${name}%`);
      }
      if (favorite !== undefined && favorite === "true") {
        builder.where("favorite", true);
      }
    })
    .select(
      knex.raw("COUNT(id) OVER() AS record_count"),
      "id",
      "name",
      "email",
      "address",
      "phone",
      "favorite",
      "avatar"
    )
    .orderBy("id", "asc")
    .limit(paginator.limit)
    .offset(paginator.offset);

  const totalRecords = results[0]?.record_count ?? 0;

  const contacts = results.map((result) => {
    result.record_count = undefined;
    return result;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    contacts,
  };
}

async function getContactById(id) {
  return contactRepository().where("id", id).select("*").first();
}

/**
 * @param {Number} contactId
 * @param {PartialContact} updateData;
 */
async function updateContact(id, updateData) {
  const updatedContact = await contactRepository()
    .where("id", id)
    .select("*")
    .first();

  if (!updatedContact) {
    return null;
  }

  const contactData = readContactData(updateData);

  if (Object.keys(contactData).length > 0) {
    await contactRepository().where("id", id).update(contactData);
  }

  if (
    contactData.avatar &&
    updatedContact.avatar &&
    contactData.avatar !== updatedContact.avatar &&
    updatedContact.avatar.startsWith("/public/uploads")
  ) {
    unlink(`.${updatedContact.avatar}`, () => {});
  }

  return { ...updatedContact, ...contactData };
}

async function deleteContact(id) {
  const deletedContact = await contactRepository()
    .where("id", id)
    .select("avatar")
    .first();

  if (!deletedContact) {
    return null;
  }

  await contactRepository().where("id", id).del();

  if (
    deletedContact.avatar &&
    deletedContact.avatar.startsWith("/public/uploads")
  ) {
    unlink(`.${deletedContact.avatar}`, () => {});
  }

  return deletedContact;
}

module.exports = {
  createContact,
  getManyContacts,
  getContactById,
  updateContact,
  deleteContact,
};
