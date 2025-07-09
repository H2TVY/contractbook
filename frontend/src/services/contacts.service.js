import { DEFAULT_AVATAR } from '@/constants';

/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns Promise<Response>
 */
async function efetch(url, options = {}) {
  let result = {};
  let json = {};

  try {
    result = await fetch(url, options);
    json = await result.json();
  } catch (error) {
    throw new Error(error.message);
  }

  if (!result.ok || json.status !== 'success') {
    throw new Error(json.message);
  }

  return json.data;
}

function makeContactsService() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  const baseUrl = `${API_BASE_URL}/api/v1/contacts`;

  function processContactAvatar(contact) {
    let avatarUrl = DEFAULT_AVATAR;
    
    if (contact.avatar) {
      if (contact.avatar.startsWith('http')) {
        avatarUrl = contact.avatar;
      } else {
        avatarUrl = `${API_BASE_URL}${contact.avatar}`;
      }
    }

    return {
      ...contact,
      avatar: avatarUrl,
    };
  }

  async function fetchContacts(page, limit = 10) {
    let url = `${baseUrl}?page=${page}&limit=${limit}`;
    const data = await efetch(url);
    data.contacts = data.contacts.map(processContactAvatar);
    return data;
  }

  async function fetchContact(id) {
    const { contact } = await efetch(`${baseUrl}/${id}`);
    return processContactAvatar(contact);
  }

  async function createContact(contact) {
    const data = await efetch(baseUrl, {
      method: 'POST',
      body: contact,
    });
    
    if (data.contact) {
      return processContactAvatar(data.contact);
    }
    
    return data;
  }

  async function deleteAllContacts() {
    return fetch(baseUrl, {
      method: 'DELETE',
    });
  }

  async function updateContact(id, contact) {
    const result = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      body: contact,
    });
    
    if (result.ok) {
      const json = await result.json();
      if (json.status === 'success' && json.data.contact) {
        return processContactAvatar(json.data.contact);
      }
    }
    
    return result;
  }

  async function deleteContact(id) {
    return fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  return {
    fetchContacts,
    fetchContact,
    createContact,
    updateContact,
    deleteContact,
    deleteAllContacts,
  };
}

export default makeContactsService();