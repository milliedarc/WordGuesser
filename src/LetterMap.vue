<script setup lang="ts">
import {ref} from "vue";

const abc = ref<string[]>(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);

const props = defineProps<{
  guessedWordArray: string[];
}>()

</script>

<template>
  <div class="row">
    <div class="tile"
         v-for="letter in abc"
         :key="letter">
      {{ letter }}
    </div>
  </div>
</template>

<style scoped>

.row {
  margin: auto auto;
  max-width: 550px;
}

.tile {
  width: 50px;
  height: 50px;
  text-align: center;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 2px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
}

</style>