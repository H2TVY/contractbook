<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ContactCard from '@/components/ContactCard.vue'
import InputSearch from '@/components/InputSearch.vue'
import ContactList from '@/components/ContactList.vue'
import MainPagination from '@/components/MainPagination.vue'
import { useContacts, useDeleteAllContacts } from '@/composables/useContacts'

const router = useRouter()
const route = useRoute()

// Current page gets its value from the query string (?page=1)
const currentPage = computed(() => {
  const page = Number(route.query?.page)
  if (Number.isNaN(page) || page < 1) return 1
  return page
})

const selectedIndex = ref(-1)
const searchText = ref('')

// Use Vue Query to fetch contacts
const { data: contactsData, isLoading, error, refetch } = useContacts(currentPage)

// Use mutation for deleting all contacts
const deleteAllMutation = useDeleteAllContacts()

const contacts = computed(() => {
  if (!contactsData.value) return []

  return [...contactsData.value.contacts].sort(
    (current, next) => current.name.localeCompare(next.name)
  )
})

const totalPages = computed(() => {
  return contactsData.value?.metadata?.lastPage ?? 1
})

// Map each contact to a string for searching
const searchableContacts = computed(() =>
  contacts.value.map((contact) => {
    const { name, email, address, phone } = contact
    return [name, email, address, phone].join('')
  })
)

// Contacts filtered by searchText
const filteredContacts = computed(() => {
  if (!searchText.value) return contacts.value
  return contacts.value.filter((contact, index) =>
    searchableContacts.value[index].includes(searchText.value)
  )
})

const selectedContact = computed(() => {
  if (selectedIndex.value < 0) return null
  return filteredContacts.value[selectedIndex.value]
})

// Handle delete all contacts event
async function onDeleteContacts() {
  if (confirm('Bạn muốn xóa tất cả Liên hệ?')) {
    try {
      await deleteAllMutation.mutateAsync()
      selectedIndex.value = -1
      changeCurrentPage(1)
      alert('Đã xóa tất cả liên hệ thành công.')
    } catch (error) {
      console.log(error)
      alert('Lỗi khi xóa liên hệ.')
    }
  }
}

function goToAddContact() {
  router.push({ name: 'contact.add' })
}

function changeCurrentPage(page) {
  router.push({ name: 'contactbook', query: { page } })
}

function handleRefresh() {
  refetch()
}

// Whenever searchText changes, reset selectedIndex
watch(searchText, () => (selectedIndex.value = -1))
</script>

<template>
  <div class="page row mb-5">
    <div class="mt-3 col-md-6">
      <h4>
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>
      <div class="my-3">
        <InputSearch v-model="searchText" />
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center">
        <i class="fas fa-spinner fa-spin"></i> Đang tải...
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="alert alert-danger">
        Lỗi khi tải danh sách liên hệ: {{ error.message }}
      </div>

      <!-- Contacts list -->
      <ContactList v-else-if="filteredContacts.length > 0" :contacts="filteredContacts"
        v-model:selected-index="selectedIndex" />

      <!-- Empty state -->
      <p v-else>
        Không có liên hệ nào.
      </p>

      <div class="mt-3 d-flex flex-wrap justify-content-round align-items-center">
        <MainPagination :total-pages="totalPages" :current-page="currentPage"
          @update:current-page="changeCurrentPage" />
        <div class="w-100"></div>
        <button class="btn btn-sm btn-primary" @click="handleRefresh" :disabled="isLoading">
          <i class="fas fa-redo"></i> Làm mới
        </button>
        <button class="btn btn-sm btn-success" @click="goToAddContact">
          <i class="fas fa-plus"></i> Thêm mới
        </button>
        <button class="btn btn-sm btn-danger" @click="onDeleteContacts" :disabled="deleteAllMutation.isLoading">
          <i class="fas fa-trash"></i>
          {{ deleteAllMutation.isLoading ? 'Đang xóa...' : 'Xóa tất cả' }}
        </button>
      </div>
    </div>

    <div class="mt-3 col-md-6">
      <div v-if="selectedContact">
        <h4>
          Chi tiết Liên hệ
          <i class="fas fa-address-card"></i>
        </h4>
        <ContactCard :contact="selectedContact" />
        <router-link :to="{
          name: 'contact.edit',
          params: { id: selectedContact.id },
        }">
          <span class="mt-2 badge text-bg-warning">
            <i class="fas fa-edit"> </i> Hiệu chỉnh
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>