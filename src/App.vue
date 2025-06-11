<script setup lang="ts">
import {ref} from "vue";

const board = ref<Tile[]>()

interface Tile {
  style?: string;
  letter?: string;
}

</script>

<template>
  <section id="app-wrapper">
    <div id="game-wrapper">
      <div id="text-wrapper">
        <h2>Word Guesser</h2>
      </div>
      <div id="board">
        <div id="grid">
          <div class="tile"
               v-for="i in 30"
               :key="i">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
* {
  font-family: 'Nunito', sans-serif;
  box-sizing: border-box;
}

#app-wrapper {
  background-color: #f0f2f5;
  min-height: 100vh;
}

#text-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 10px;
}

#board {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;

}

#grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 0.5rem;
  overflow: hidden;
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 500px;
}

.tile {
  font-weight: bold;
  font-size: 2rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  aspect-ratio: 1 / 1;
}
</style>
