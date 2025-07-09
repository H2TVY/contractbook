<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ContactForm from '@/components/ContactForm.vue'
import { useContact, useUpdateContact, useDeleteContact } from '@/composables/useContacts'

const props = defineProps({
    contactId: { type: String, required: true },
})

const router = useRouter()
const route = useRoute()
const message = ref('')

// Use queries and mutations
const { data: contact, isLoading, error } = useContact(props.contactId)
const updateMutation = useUpdateContact()
const deleteMutation = useDeleteContact()

// Handle contact not found
if (error.value) {
    router.push({
        name: 'notfound',
        params: { pathMatch: route.path.split('/').slice(1) },
        query: route.query,
        hash: route.hash,
    })
}

async function onUpdateContact(contactData) {
    try {
        await updateMutation.mutateAsync({
            id: contactData.get('id'),
            contact: contactData
        })
        message.value = 'Liên hệ được cập nhật thành công.'
    } catch (error) {
        console.log(error)
        message.value = 'Lỗi khi cập nhật liên hệ: ' + error.message
    }
}

async function onDeleteContact(id) {
    if (confirm('Bạn muốn xóa Liên hệ này?')) {
        try {
            await deleteMutation.mutateAsync(id)
            router.push({ name: 'contactbook' })
        } catch (error) {
            console.log(error)
            message.value = 'Lỗi khi xóa liên hệ: ' + error.message
        }
    }
}
</script>

<template>
    <div class="page">
        <h4>Hiệu chỉnh Liên hệ</h4>

        <!-- Loading state -->
        <div v-if="isLoading" class="text-center">
            <i class="fas fa-spinner fa-spin"></i> Đang tải...
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="alert alert-danger">
            Lỗi khi tải thông tin liên hệ: {{ error.message }}
        </div>

        <!-- Contact form -->
        <div v-else-if="contact">
            <!-- Show loading state for mutations -->
            <div v-if="updateMutation.isLoading || deleteMutation.isLoading" class="alert alert-info">
                <i class="fas fa-spinner fa-spin"></i>
                {{ updateMutation.isLoading ? 'Đang cập nhật...' : 'Đang xóa...' }}
            </div>

            <ContactForm :contact="contact" @submit:contact="onUpdateContact" @delete:contact="onDeleteContact"
                :disabled="updateMutation.isLoading || deleteMutation.isLoading" />

            <!-- Show success/error message -->
            <div v-if="message" :class="message.includes('thành công') ? 'alert alert-success' : 'alert alert-danger'">
                {{ message }}
            </div>
        </div>
    </div>
</template>
 