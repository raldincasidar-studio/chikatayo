<template>
  <v-container
    class="px-4 my-26 h-100 d-flex align-center justify-center flex-column"
  >
    <div class="login-form w-100">
      <v-row class="mb-4">
        <v-col cols="12" class="text-center">
            <v-icon size="100" class="mb-4" color="primary">mdi-account</v-icon>
          <h1 class="text-h4 font-weight-bold">Chika Tayo</h1>
          <p class="text-subtitle-1">
            Ang iyong personal na voice diary at AI therapy app
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" class="mx-auto">
          <v-form @submit.prevent="login">
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
              <v-btn
                :loading="loading"
                type="submit"
                color="primary"
                block
                size="large"
                class="my-3"
                >Login</v-btn
              >
            <div class="d-flex justify-space-between">
              <a href="#" class="text-decoration-none">Nalimutan ang password</a>
              <v-btn to="/signup" class="text-decoration-none" variant="text" color="primary">Mag-Sign Up</v-btn>
            </div>
            <p class="text-center mt-4 text-grey">
              Need help? <a href="#" class="text-decoration-none">I-message kami</a>
            </p>
          </v-form>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>


const email = ref('');
const password = ref('');

const router = useRouter();

const { myFetch, error, loading } = useMyFetch();
async function login() {
  
  const response = await myFetch('/login', {
    method: 'POST',
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  });

  if (error.value) {
    console.log(error);
    alert(`Error: ${error.value}`);
  }

  if (response.token) {
    document.cookie = `token=${response.token}; Path=/; Max-Age=31536000;`;
    router.push('/dashboard');
  }
}
</script>
