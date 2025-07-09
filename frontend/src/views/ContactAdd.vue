<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ContactForm from '@/components/ContactForm.vue'
import { useCreateContact } from '@/composables/useContacts'

const router = useRouter()
const message = ref('')

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const contact = ref({
    name: '',
    email: '',
    address: '',
    phone: '',
    favorite: 0,
    avatar: `${API_BASE_URL}/public/images/blank-profile-picture.png`,
})

// Use mutation for creating contact
const createMutation = useCreateContact()

async function onCreateContact(contactData) {
    try {
        await createMutation.mutateAsync(contactData)
        alert('Liên hệ được tạo thành công.')
        router.push({ name: 'contactbook' })
    } catch (error) {
        console.log(error)
        message.value = 'Lỗi khi tạo liên hệ: ' + error.message
    }
}
</script>

<template>
    <div class="page">
        <h4>Thêm Liên hệ</h4>

        <!-- Show loading state -->
        <div v-if="createMutation.isLoading" class="alert alert-info">
            <i class="fas fa-spinner fa-spin"></i> Đang tạo liên hệ...
        </div>

        <ContactForm :contact="contact" @submit:contact="onCreateContact" :disabled="createMutation.isLoading" />

        <!-- Show error message -->
        <div v-if="message" class="alert alert-danger">
            {{ message }}
        </div>
    </div>
</template>