<script setup lang="ts">
import {onMounted, ref} from "vue";
import {solutionWords, allowedGuesses} from './WordList';
import WordInput from "@/WordInput.vue";

const currentWord = ref('')
const wordInputFocus = ref<boolean[]>([false, false, false, false, false, false])
const isGameOver = ref(false);

function startNewGame() {
  currentWord.value = solutionWords[Math.floor(Math.random() * solutionWords.length)]
  wordInputFocus.value = [false, false, false, false, false, false]
  isGameOver.value = false;

  console.log(currentWord.value)
}

function isValidWord(word: string): boolean {
  return allowedGuesses.includes(word.toLowerCase()) || solutionWords.includes(word.toLowerCase());
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
  if (rowIndex < 6) {
    wordInputFocus.value[rowIndex + 1] = true
    return;
  }
  isGameOver.value = true;
}

onMounted(() => {
  startNewGame();
})

</script>

<template>


  <section class="app-wrapper">
    <div class="game-wrapper">
      <div class="div-wrapper">
        <h2 class="text">Word Guesser</h2>
      </div>

      <div class="board">
        <WordInput v-for="i in 6"
                   :key="i"
                   :word="currentWord"
                   :set-focus="wordInputFocus[i]"
                   @success="gameWon"
                   @error="keepTrying(i)"
        />
      </div>
      <div v-if="isGameOver"
           class="div-wrapper">
        You lost!
      </div>
      <div class="div-wrapper">
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

.app-wrapper {
  background-color: #f0f2f5;
  min-height: 100vh;
}

.div-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.board {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.restartBtn {
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
