<template>
  <v-container
    class="px-4 my-26 h-100 d-flex align-center justify-center flex-column"
  >
    <div class="login-form w-100">
      <v-row class="mb-4">
        <v-col cols="12" class="text-center">
            <v-icon size="100" color="primary">mdi-account</v-icon>
          <h1 class="text-h4 font-weight-bold">Chika Tayo</h1>
          <p class="text-subtitle-1">
            Your personal voice diary and AI Therapy
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" class="mx-auto">
          <v-form @submit.prevent="signup">
            <v-row>
                <v-col cols="12">
                    <p class="text-red text-center">Lahat po ay required*</p>
                </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" >
                <v-text-field
                  :loading="loading"
                  v-model="firstName"
                  type="text"
                  label="First Name"
                  outlined
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" >
                <v-text-field
                  :loading="loading"
                  v-model="middleName"
                  type="text"
                  label="Middle Name"
                  outlined
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" >
                <v-text-field
                  :loading="loading"
                  v-model="lastName"
                  type="text"
                  label="Last Name"
                  outlined
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              :loading="loading"
              v-model="contact"
              type="text"
              label="Contact Information"
              outlined
              required
            ></v-text-field>
            <v-text-field
              :loading="loading"
              v-model="email"
              type="email"
              label="Email"
              outlined
              required
            ></v-text-field>
            <v-text-field
              :loading="loading"
              v-model="password"
              type="password"
              label="Password"
              outlined
              required
            ></v-text-field>
            
            <div class="d-flex flex-column">
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                class="my-3"
                >Sign Up</v-btn
              >
              <v-btn
                type="submit"
                color="grey"
                to="/"
                block
                size="large"
                variant="text"
                class="mt-0"
                >Login</v-btn
              >
            </div>
            <p class="text-center mt-4 text-grey">
              Need help? <a href="#" class="text-decoration-none">Contact us</a>
            </p>
          </v-form>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>

import { Body } from '#components'
import useMyFetch from '~/composables/useMyFetch'


const firstName = ref('')
const middleName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const username = ref('')

const { myFetch, error, loading } = useMyFetch();

const router = useRouter();

async function signup() {
  

  const res = await myFetch('/users', {
    method: 'POST',
    body: JSON.stringify({
      firstName: firstName.value,
      middleName: middleName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    })
  })

  if (error.value) {
    alert(`Error: ${error.value}`)
  }

  alert(res.message);

  if (res.token) {
    document.cookie = `token=${res.token}; Path=/; Max-Age=31536000;`
  }

  router.push('/dashboard')
}
</script>

