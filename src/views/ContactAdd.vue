<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ContactForm from '@/components/ContactForm.vue';
import contactsService from '@/services/contacts.service';
import { DEFAULT_AVATAR } from '@/constants';

const router = useRouter();
const message = ref('');
const contact = ref({
    name: '',
    email: '',
    address: '',
    phone: '',
    favorite: 0,
    avatar: DEFAULT_AVATAR,
});

async function onCreateContact(contactData) {
    try {
        await contactsService.createContact(contactData);
        alert('Liên hệ được cập nhật thành công.');
        router.push({ name: 'contactbook' });
    } catch (error) {
        console.log(error);
    }
}
</script>

<template>
    <div class="page">
        <h4>Thêm Liên hệ</h4>
        <ContactForm :contact="contact" @submit:contact="onCreateContact" />
        <p>{{ message }}</p>
    </div>
</template>
