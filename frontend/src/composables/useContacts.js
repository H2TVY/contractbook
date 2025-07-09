import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';
import contactsService from '@/services/contacts.service';

// Query Keys
export const CONTACTS_QUERY_KEY = 'contacts';
export const CONTACT_QUERY_KEY = 'contact';

// Get contacts with pagination
export function useContacts(page, limit = 10) {
  return useQuery({
    queryKey: [CONTACTS_QUERY_KEY, page, limit],
    queryFn: ({ queryKey }) => {
      const [, currentPage, currentLimit] = queryKey;
      return contactsService.fetchContacts(currentPage, currentLimit);
    },
    keepPreviousData: true,
  });
}

// Get single contact
export function useContact(id) {
  return useQuery({
    queryKey: [CONTACT_QUERY_KEY, id],
    queryFn: () => contactsService.fetchContact(id),
    enabled: computed(() => !!id),
  });
}

// Create contact mutation
export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactsService.createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_QUERY_KEY] });
    },
  });
}

// Update contact mutation
export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, contact }) => contactsService.updateContact(id, contact),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CONTACT_QUERY_KEY, variables.id] });
    },
  });
}

// Delete contact mutation
export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactsService.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_QUERY_KEY] });
    },
  });
}

// Delete all contacts mutation
export function useDeleteAllContacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactsService.deleteAllContacts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CONTACT_QUERY_KEY] });
    },
  });
}
