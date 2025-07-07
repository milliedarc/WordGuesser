<script setup lang="ts">
import {
  BButton,
  BNavbar,
  BNavbarBrand,
  BNavbarNav,
} from "bootstrap-vue-next";

import {ref} from "vue";
import GameSettings from "@/components/GameSettings.vue";

const modal = ref(false);

</script>

<template>

  <BNavbar variant="dark-subtle">

    <BNavbarBrand href="#">
      <span class="fw-bold fs-3"
            style="letter-spacing: 0.1rem">
        WORD GUESSER
      </span>
    </BNavbarBrand>

    <!-- Right aligned nav items -->
    <BNavbarNav class="ms-auto mb-2 mb-lg-0">
      <div class="d-flex gap-3">

        <BButton
            @click="modal = !modal"
            class="link-btn fs-5"
            variant="link"
            underline-opacity="0">
          Game settings
        </BButton>

        <GameSettings v-model="modal"/>

        <BButton
            class="link-btn fs-5"
            variant="link"
            underline-opacity="0">
          Sign out
        </BButton>

      </div>
    </BNavbarNav>

  </BNavbar>

</template>

<style scoped>

.link-btn {
  color: black;
}

.link-btn:hover {
  color: whitesmoke;
  background-color: black;
}

.link-btn:active {
  color: black;
  background-color: transparent;
}

</style>
<style scoped>

</style>