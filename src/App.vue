<script setup lang="ts">
import {computed, nextTick, onMounted, ref, useTemplateRef} from "vue";
import WordInput from "@/WordInput.vue";
import {BButton, BModal, BToastOrchestrator} from "bootstrap-vue-next";

import {solutionWords} from "@/SolutionWords";
import LetterMap from "@/LetterMap.vue";
import type {Tile} from "@/Tile.ts";

// ***************** REFS ******************

const numRows = ref<number>(6)
const solutionWord = ref<string>('')
const solutionWordDisplay = ref<string>('')
const isGameOver = ref<boolean>(false);
const isDisabledRow = ref<boolean[]>([])
const isGameInitialised = ref<boolean>(false)
const isLetterMapShown = ref<boolean>(false)
const guessedTiles = ref<Tile[]>([])

const wordInputRef = useTemplateRef('wordInputRef')

// ***************** COMPUTED ******************

const buttonMessage = computed(() => {
  return isLetterMapShown.value ? 'Hide' : 'Show';
})

// ***************** FUNCTIONS ******************

function initialiseDisabledRow(): void {
  isDisabledRow.value = []

  for (let i = 0; i < numRows.value; i++) {
    isDisabledRow.value.push(true)
  }
  isDisabledRow.value[0] = false;
}


function startNewGame(): void {
  solutionWord.value = solutionWords[Math.floor(Math.random() * solutionWords.length)]
  isGameOver.value = false;
  guessedTiles.value = []

  initialiseDisabledRow()

  nextTick(() => {
    // @ts-ignore
    wordInputRef.value[0].focus()
  })

  console.log(solutionWord.value)

  isGameInitialised.value = true
}

function gameWon(): void {
  // @ts-ignore
  window.confetti({
    particleCount: 100,
    spread: 70,
    origin: {y: 0.6},
  });
}

function keepTrying(rowIndex: number, tiles: Tile[]): void {
  if (rowIndex < numRows.value - 1) {
    isDisabledRow.value[rowIndex + 1] = false;

    guessedTiles.value.push(...tiles);

    nextTick(() => {
      // @ts-ignore
      wordInputRef.value[rowIndex + 1].focus()
    })
    return;
  }

  isGameOver.value = true;
  solutionWordDisplay.value = solutionWord.value;
}

function handleLetterMapShown(): void {
  isLetterMapShown.value = !isLetterMapShown.value;
}

// ***************** HOOKS ******************

onMounted(() => {
  startNewGame();
})

</script>

<template>
  <BToastOrchestrator/>
  <section v-if="isGameInitialised" class="app-wrapper">
    <div class="game-wrapper">
      <div class="div-wrapper">
        <h2 class="text">Word Guesser</h2>
      </div>
      <div class="board">
        <WordInput v-for="i in numRows"
                   :key="i"
                   ref="wordInputRef"
                   :solution-word="solutionWord"
                   :disabled="isDisabledRow[i-1]"
                   @success="gameWon"
                   @error="keepTrying(i-1, $event)"
        />
      </div>
      <div class="div-wrapper">
        <BModal v-model="isGameOver"
                cancel-class="hidden"
                centered
                no-header
                no-footer>
          <div>
            <h2 class="lost-game-text">YOU LOST!</h2>
          </div>
          <div class="mt-3">
            <h5 class="lost-game-text">The word was <span class="fw-bold">{{ solutionWordDisplay.toUpperCase() }}</span>
            </h5>
          </div>
          <div class="text-center mt-4">
            <BButton @click="startNewGame" class="bg-success">Start new game</BButton>
          </div>
        </BModal>
        <div class="btn-wrapper">
          <button class="btn btn-restart" @click="startNewGame">Get a new word</button>
          <button class="btn btn-help" @click="handleLetterMapShown">{{ buttonMessage }} letter map</button>
        </div>
      </div>
      <LetterMap v-if="isLetterMapShown"
                 :guessed-tiles="guessedTiles"
                 :solution-word="solutionWord"
                 id="letter-map"/>
    </div>
  </section>
</template>

<style scoped>
* {
  font-family: 'Nunito', sans-serif;
  box-sizing: border-box;
}

.text {
  text-align: center;
}

.lost-game-text {
  text-align: center;
}

.app-wrapper {
  background-color: #f0f2f5;
  min-height: 100vh;
  overflow: hidden;
}

.div-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.board {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 30px;
}

.btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.btn {
  margin-top: 10px;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  color: white;
  border: none;
}

.btn-restart {
  background-color: #4CAF50;
  transition: background-color 0.3s ease, transform 0.1s ease, box-shadow 0.3s ease;
}

.btn-help {
  background-color: #488c9e;
  transition: background-color 0.3s ease, transform 0.1s ease, box-shadow 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.btn-restart:hover {
  background-color: #45a049;
}

.btn-help:hover {
  background-color: #3f8495;
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.btn-restart:active {
  background-color: #50bf56 !important;
}

.btn-help:active {
  background-color: #499db1 !important;
}

#letter-map {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px
}
</style>
