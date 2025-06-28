<script setup lang="ts">
import {ref, useTemplateRef, watch} from "vue";
import {allowedGuesses} from "@/AllowedGuesses";
import {useToastController} from "bootstrap-vue-next";
import type {Tile} from "@/Tile.ts";

// ***************** REFS ******************

const row = ref<Tile[]>([])
const isEnabledInput = ref<boolean>(true)
const isSubmitMessageShown = ref<boolean>(false)

const inputs = useTemplateRef<HTMLInputElement[]>('inputs')

// ***************** CONSTS ******************

const {create} = useToastController()

// ***************** PROPS *****************

const props = defineProps<{
  solutionWord: string
  disabled: boolean
}>()

// ***************** EMITS *****************

const emit = defineEmits(['success', 'error'])

// ************ FUNCTIONS ***************

function goToNextTile(index: number): void {
  const nextIndex = index + 1;

  if (!inputs.value || index > props.solutionWord.length) return;

  if (nextIndex < inputs.value.length) {
    inputs.value[nextIndex]?.focus()
  }
  if (nextIndex === inputs.value.length) {
    isSubmitMessageShown.value = true
  } else {
    isSubmitMessageShown.value = false
  }
}

function goToPreviousTile(index: number): void {
  const prevIndex = index - 1;

  if (!inputs.value || index < 0) return;

  if (prevIndex >= 0) {
    inputs.value[prevIndex]?.focus()
  }
}

function handleInput(index: number): void {
  if (row.value[index].content) {
    row.value[index].content = row.value[index].content.toUpperCase();
    goToNextTile(index);
  }
}

function handleKeydown(index: number, event: KeyboardEvent): void {
  const target = event.target as HTMLInputElement;

  if (event.key === 'Backspace') {
    if (!target.value) {
      goToPreviousTile(index);
    }
    isSubmitMessageShown.value = false
  }
}

function buildGuessedWord(): string {
  let guessedWord = ''

  row.value.forEach(tile => {
    if (tile.content && tile.content.length > 0) {
      guessedWord += tile.content;
    }
  })
  return guessedWord.toLowerCase();
}

function handleEnter(event: KeyboardEvent): void {
  const target = event.target as HTMLInputElement;

  if (!target.value) return;

  if (event.key !== 'Enter') return;

  const guessedWord = buildGuessedWord();

  if (guessedWord.length !== props.solutionWord.length) return;

  if (props.solutionWord !== guessedWord && !allowedGuesses.includes(guessedWord.toLowerCase())) {
    create({
      body: 'Not in word list!',
      textVariant: 'danger',
      noProgress: true,
      noHoverPause: true,
      solid: true,
      modelValue: 3000
    });
    return;
  }
  isSubmitMessageShown.value = false;
  handleWin(guessedWord);
}

function changeTileColours(guessedWord: string): void {
  for (let i = 0; i < props.solutionWord.length; i++) {
    if (props.solutionWord[i] === guessedWord[i]) {
      row.value[i].backgroundColor = ' #a0dea0'
    } else if (props.solutionWord.includes(guessedWord[i])) {
      row.value[i].backgroundColor = ' #ffff80';
    } else {
      row.value[i].backgroundColor = ' #a8a8a8';
    }
  }
}

function handleWin(guessedWord: string): void {
  isEnabledInput.value = false;

  changeTileColours(guessedWord);

  if (props.solutionWord === guessedWord) {
    emit('success');
  } else {
    emit('error', row.value);
  }
}

function reset(): void {
  row.value = [];
  for (let i = 0; i < props.solutionWord.length; i++) {
    row.value.push({})
  }
  isEnabledInput.value = true;
}

function focus(): void {
  if (inputs && inputs.value) {
    inputs.value[0]?.focus()
  }
}

defineExpose({
  focus
})

/// ************ WATCHERS *************** //

watch(() => props.solutionWord, () => {
  reset()
}, {immediate: true})


</script>

<template>

  <div class="grid">
    <div class="tile">

      <input
          v-for="i in props.solutionWord.length"
          :key="i"
          ref="inputs"
          v-model="row[i-1].content"
          type="text" maxlength="1"
          @input="handleInput(i-1)"
          @keydown="handleKeydown(i-1, $event)"
          @keyup.enter="handleEnter($event)"
          :disabled="!isEnabledInput || props.disabled"
          :style="`background-color: ${row[i-1].backgroundColor}`"
      />
      <Transition name="fade">
        <div v-if="isSubmitMessageShown" class="position-absolute" style="right: -170px">
          Press Enter to submit
        </div>
      </Transition>
    </div>

  </div>

</template>

<style scoped>

.tile {
  display: flex;
  align-items: center;
  flex-direction: row;
  position: relative;
}

input {
  width: 100px;
  height: 100px;
  font-size: 78px;
  text-align: center;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 2px solid black;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
