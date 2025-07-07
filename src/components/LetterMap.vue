<script setup lang="ts">
import {ref, watch} from "vue";
import type {Tile} from "@/Tile.ts";

const abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const tiles = ref<Tile[]>(createTiles())

const props = defineProps<{
  guessedTiles: Tile[];
  solutionWord: string
}>()

function createTiles(): Tile[] {
  const _tiles: Tile[] = []
  abc.forEach(letter => {
    _tiles.push({
      content: letter,
      backgroundColor: ''
    })
  })
  return _tiles
}

watch(() => props.guessedTiles, (newVal: Tile[]) => {
  if (newVal.length === 0) {
    tiles.value = createTiles()
    return;
  }

  for (let i = 0; i < newVal.length; i++) {
    for (let j = 0; j < tiles.value.length; j++) {
      if (newVal[i].content?.toLowerCase() === tiles.value[j].content?.toLowerCase()) {
        tiles.value[j].backgroundColor = newVal[i].backgroundColor;
        console.log(tiles.value[j].content)
        break
      }
    }
  }
}, {immediate: true, deep: true})

</script>

<template>
  <div class="row">
    <div class="tile"
         v-for="tile in tiles"
         :key="tile.content"
         :style="`background-color: ${tile.backgroundColor}`">

      {{ tile.content }}
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