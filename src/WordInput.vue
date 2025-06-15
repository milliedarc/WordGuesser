<script setup lang="ts">
import {ref, useTemplateRef, watch} from "vue";
import {allowedGuesses} from "@/AllowedGuesses";
import {useToastController} from "bootstrap-vue-next";

interface Tile {
  style?: string | undefined;
  content?: string | undefined;
  backgroundColor?: string | undefined;
}

// ***************** REFS ******************

const row = ref<Tile[]>([])
const isEnabledInput = ref(true)

const inputs = useTemplateRef<HTMLInputElement[]>('inputs')

// ***************** CONSTS ******************

const {create} = useToastController()

// ***************** PROPS *****************

const props = defineProps<{
  word: string
  disabled: boolean
}>()

// ***************** EMITS *****************

const emit = defineEmits(['success', 'error'])


// ************ FUNCTIONS ***************

function goToNextTile(index: number) {
  const nextIndex = index + 1;

  if (!inputs.value || index > props.word.length) return;

  if (nextIndex < inputs.value.length) {
    inputs.value[nextIndex]?.focus()
  }
}

function goToPreviousTile(index: number) {
  const prevIndex = index - 1;

  if (!inputs.value || index < 0) return;

  if (prevIndex >= 0) {
    inputs.value[prevIndex]?.focus()
  }
}

function handleInput(index: number) {
  if (row.value[index].content) {
    row.value[index].content = row.value[index].content.toUpperCase();
    goToNextTile(index);
  }
}

function handleKeydown(index: number, event: KeyboardEvent) {
  const target = event.target as HTMLInputElement;

  if (event.key === 'Backspace' && !target.value) {
    goToPreviousTile(index);
  }
}

function buildTempWord(): string {
  let tempWord = ''

  row.value.forEach(tile => {
    if (tile.content && tile.content.length > 0) {
      tempWord += tile.content;
    }
  })
  return tempWord.toLowerCase();
}

function handleEnter(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement;

  if (!target.value) return;

  if (event.key !== 'Enter') return;

  const tempWord = buildTempWord();
  

  if (tempWord.length !== props.word.length) return;

  if (props.word !== tempWord && !allowedGuesses.includes(tempWord.toLowerCase())) {
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

  handleWin(tempWord);
}

function changeTileColours(tempWord: string): void {
  for (let i = 0; i < props.word.length; i++) {
    if (props.word[i] === tempWord[i]) {
      row.value[i].backgroundColor = ' #a0dea0'
    } else if (props.word.includes(tempWord[i])) {
      row.value[i].backgroundColor = ' #ffff80';
    }
  }
}

function handleWin(tempWord: string) {
  isEnabledInput.value = false;

  changeTileColours(tempWord);

  if (props.word === tempWord) {
    emit('success');
  } else {
    emit('error');
  }
}

function reset(): void {
  row.value = [];
  for (let i = 0; i < props.word.length; i++) {
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

watch(() => props.word, () => {
  reset()
}, {immediate: true})


</script>

<template>

  <div class="grid">
    <div class="tile">

      <input
          v-for="i in props.word.length"
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
    </div>
  </div>

</template>

<style scoped>

.tile {
  display: flex;
  align-items: center;
  flex-direction: row;

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

</style>
