<script setup lang="ts">
import {nextTick, onMounted, ref, useTemplateRef} from "vue";
import WordInput from "@/WordInput.vue";
import {BButton, BModal, BToastOrchestrator} from "bootstrap-vue-next";

import {solutionWords} from "@/SolutionWords";

// ***************** REFS ******************

const numRows = ref<number>(6)
const currentWord = ref('')
const currentWordDisplay = ref('')
const isGameOver = ref(false);
const isDisabledRow = ref<boolean[]>([])
const isGameInitialised = ref(false)

const wordInputRef = useTemplateRef('wordInputRef')

// ***************** FUNCTIONS ******************

function initialiseDisabledRow(): void {
  isDisabledRow.value = []

  for (let i = 0; i < numRows.value; i++) {
    isDisabledRow.value.push(true)
  }
  isDisabledRow.value[0] = false;
}


function startNewGame(): void {
  currentWord.value = solutionWords[Math.floor(Math.random() * solutionWords.length)]
  isGameOver.value = false;

  initialiseDisabledRow()

  nextTick(() => {
    // @ts-ignore
    wordInputRef.value[0].focus()
  })

  console.log(currentWord.value)

  isGameInitialised.value = true
}

function gameWon() {
  // @ts-ignore
  window.confetti({
    particleCount: 100,
    spread: 70,
    origin: {y: 0.6},
  });
}

function keepTrying(rowIndex: number) {
  console.log(rowIndex)
  if (rowIndex < numRows.value - 1) {
    isDisabledRow.value[rowIndex + 1] = false;

    nextTick(() => {
      // @ts-ignore
      wordInputRef.value[rowIndex + 1].focus()
    })
    return;
  }
  isGameOver.value = true;
  currentWordDisplay.value = currentWord.value;
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
                   :word="currentWord"
                   @success="gameWon"
                   @error="keepTrying(i-1)"
                   :disabled="isDisabledRow[i-1]"
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
            <h5 class="lost-game-text">The word was <span class="fw-bold">{{ currentWordDisplay.toUpperCase() }}</span>
            </h5>
          </div>
          <div class="text-center mt-4">
            <BButton @click="startNewGame" class="bg-success">Start new game</BButton>
          </div>
        </BModal>
        <button class="restartBtn" @click="startNewGame">Get a new word</button>
      </div>
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

.restartBtn {
  margin-top: 20px;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  transition: background-color 0.3s ease, transform 0.1s ease, box-shadow 0.3s ease;
}

.restartBtn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.restartBtn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
