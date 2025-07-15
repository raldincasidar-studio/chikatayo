<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>ChikaTayo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
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
  { title: "Users", to: "/users", icon: "mdi-account-multiple" },
];

function toggleDrawer() {
  drawer.value = !drawer.value;
}
</script>

<style scoped>
/* .v-navigation-drawer {
  display: none !important;
} */
</style>
