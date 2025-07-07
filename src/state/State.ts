import {createGlobalState} from '@vueuse/core'
// store.js
import {ref} from 'vue'

export const useGlobalState = createGlobalState(
    () => {
        const isLetterMapShown = ref(true)

        return {isLetterMapShown}
    }
)
