<script setup lang="ts">

import {BButton, BFormCheckbox, BModal, BTab, BTabs} from "bootstrap-vue-next";
import {ref} from "vue";
import {useGlobalState} from "@/state/State.ts";

const model = defineModel<boolean>();

const globalState = useGlobalState();

const isLetterMapShown = ref(globalState.isLetterMapShown.value);

function saveChanges(): void {
  globalState.isLetterMapShown.value = isLetterMapShown.value;
}

</script>

<template>
  <BModal v-model="model"
          title="Game settings and modes"
          title-class="fs-4"
          @ok="saveChanges"
          ok-title="Save changes"
          ok-only>

    <BTabs content-class="mt-3 fs-6"
           justified
           active-nav-item-class="fw-bold"
           tab-class="fs-5">

      <BTab
          title="Settings"
          active
          title-item-class="fs-5">

        <div id="difficulty">
          <div class="modal-subtitle">
            Difficulty
          </div>

          <div class="modal-options">

            <div>
              <BButton variant="outline-secondary">Easy</BButton>
            </div>
            <div>
              <BButton variant="outline-secondary">Medium</BButton>
            </div>
            <div>
              <BButton variant="outline-secondary">Hard</BButton>
            </div>
            <div>
              <BButton variant="outline-secondary">Nightmare</BButton>
            </div>
          </div>
        </div>

        <div id="letter-map">

          <BFormCheckbox v-model="isLetterMapShown"
                         class="modal-subtitle"
                         switch>
            Show letter map
          </BFormCheckbox>

        </div>

      </BTab>

      <BTab title="Modes"
            title-item-class="fs-5">
        <div>
          <div class="mode-description">Modes are best for playing against others and later compare results!</div>
          <BFormCheckbox
              switch
              class="modal-subtitle">
            Daily Mode
          </BFormCheckbox>
          <div class="mode-description">Enable daily mode to guess the word of the day.</div>

          <BFormCheckbox
              switch
              class="modal-subtitle">
            Party Mode
          </BFormCheckbox>
          <div class="mode-description">Enable party mode to get a timed challenge with increasing difficulty.</div>
        </div>
      </BTab>

    </BTabs>

  </BModal>

</template>

<style scoped>

.modal-subtitle {
  font-weight: bold;
  letter-spacing: 0.05rem;
}

.modal-options {
  font-size: 1.1rem;
  display: flex;
  gap: 2rem;
  margin: 20px 10px;
}

.mode-description {
  font-size: 1.1rem;
  padding: 10px;
}
</style>