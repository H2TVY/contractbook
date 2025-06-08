const knex = require("../database/knex");

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

module.exports = {
  createContact,
};
