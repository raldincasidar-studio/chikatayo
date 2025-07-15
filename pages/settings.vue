<template>
    <div>
        
        <h2 class="mb-5"><v-icon class="mr-1" size="30" color="primary">mdi-cog</v-icon> Settings</h2>

        <v-tabs v-model="tab" align-tabs="center">
            <v-tab value="userInfo">Change User Info</v-tab>
            <v-tab value="dataDeletion">Request Data Deletion</v-tab>
        </v-tabs>

        <v-window v-model="tab">
            <v-window-item value="userInfo">
                <v-form @submit.prevent="updateUser">
                    <v-row class="mt-4">
                        <v-col cols="12" md="6">
                            <v-text-field v-model="user.firstName" label="First Name" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="user.middleName" label="Middle Name" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="user.lastName" label="Last Name" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="user.email" label="Email" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="user.contact" label="Contact" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="newPassword" label="New Password" type="password" outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <v-btn color="primary" type="submit" :loading="loading">Update</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-window-item>

            <v-window-item value="dataDeletion">
                <v-row class="mt-4">
                    <v-col cols="12" class="text-center">
                        <h3 class="mb-3">Request Data Deletion</h3>
                        <p style="font-size: 1.2rem;">alam naming mahalaga ang lahat ng data mo. Anytime ay pwede mong idelete ito sa aming server. Pindutin lamang ang button at ipadala ang email sa <a href="mailto:raldincasidar@gmail.com">raldincasidar@gmail.com</a> para irequest ang pagdelete ng iyong data dito sa application na ito.</p>
                    </v-col>
                    <v-col cols="12" class="text-center mt-10">
                        <v-btn color="primary" type="submit" prepend-icon="mdi-inbox">Send us Email</v-btn>
                    </v-col>
                </v-row>
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useMyFetch from '~/composables/useMyFetch';

definePageMeta({
    layout: "dash"
});

const tab = ref('userInfo');
const user = ref({});
const deletionEmail = ref('');

const { myFetch, error, loading } = useMyFetch();

async function fetchUserInformation() {
    const res = await myFetch("/user");
    if (res && !error.value) {
        user.value = res.user;
    } else if (error.value) {
        alert(`Error fetching user: ${error.value}`);
    }
}

async function updateUser() {
    const res = await myFetch("/user", {
        method: 'PUT',
        body: JSON.stringify(user.value)
    });

    if (res && !error.value) {
        alert('User information updated successfully!');
    } else if (error.value) {
        alert(`Error updating user: ${error.value}`);
    }
}

onMounted(() => {
    fetchUserInformation();
});
</script>