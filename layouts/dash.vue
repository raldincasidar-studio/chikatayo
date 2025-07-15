<template>
  <v-app>
    <v-app-bar app>
      <v-btn icon @click="$router.back()" v-if="$route.path !== '/dashboard'">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn icon @click="toggleDrawer" v-else>
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title>ChikaTayo</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary location="left">
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in navigations"
          :key="item.title"
          :to="item.to"
          :title="item.title"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" />
          </template>
        </v-list-item>
        <v-list-item @click="logout">
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(false);

const navigations = [
  { title: "Dashboard", to: "/dashboard", icon: "mdi-view-dashboard" },
  { title: "Settings", to: "/settings", icon: "mdi-cog" },
];

function toggleDrawer() {
  drawer.value = !drawer.value;
}

function logout() {
  document.cookie = "token=; Path=/; Max-Age=0;";
  window.location.href = "/";
}
</script>

<style scoped>
/* .v-navigation-drawer {
  display: none !important;
} */
</style>
