import {createGlobalState} from '@vueuse/core'
// store.js
import {ref} from 'vue'

export const useGlobalState = createGlobalState(
    () => {
        const isLetterMapShown = ref(true)
        const gameDifficulty = ref(0) // 0 = default, 1 = medium, 2 = hard, 3 = nightmare

        return {isLetterMapShown, gameDifficulty}
    }
)
