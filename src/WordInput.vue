<script setup lang="ts">
import {ref, useTemplateRef, watch} from "vue";

const row = ref<Tile[]>([])
const isEnabledInput = ref(true)

const inputs = useTemplateRef<HTMLInputElement[]>('inputs')

const props = defineProps<{
  word: string
}>()

const emit = defineEmits(['success', 'error'])

interface Tile {
  style?: string | undefined;
  content?: string | undefined;
  backgroundColor?: string | undefined;
}

/// ************ FUNCTIONS *************** //

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

function handleEnter(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement;

  if (!target.value) return;

  if (event.key !== 'Enter') return;

  let tempWord = ''

  row.value.forEach(tile => {
    if (tile.content && tile.content.length > 0) {
      tempWord += tile.content;
    }
  })

  if (tempWord.length !== props.word.length) return;

  handleWin(tempWord);
}

function handleWin(tempWord: string) {
  isEnabledInput.value = false;

  tempWord = tempWord.toLowerCase();

  for (let i = 0; i < props.word.length; i++) {
    if (props.word[i] === tempWord[i]) {
      row.value[i].backgroundColor = 'green'
    } else if (props.word.includes(tempWord[i])) {
      row.value[i].backgroundColor = 'yellow';
    }
  }
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
          :disabled="!isEnabledInput"
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
}

</style>
