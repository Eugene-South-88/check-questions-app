<template>
  <ul class="questions-list">
    <li class="question-item"
        :class="`bg-${item.status}`"
        @click="isOpenText = !isOpenText">
      <strong class="question-text">{{ item.title }} </strong>
      <button v-if="activeQuestionIndex !== item.id" class="delete-btn"
              @click.stop="$emit('removeQuestion', item.id)">
        <svg class="delete-icon" viewBox="0 0 24 24">
          <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
      <div v-if="isOpenText" class="answer-container">
        <pre class="formatted-text">{{ item.text }}</pre>
        <div class="btn-block_question">
          <button class="btn-green" @click="$emit('toggleStatus',item.id, 'finish')">Знает</button>
          <button class="btn-red" @click="$emit('toggleStatus',item.id, 'repeat')">Не знает</button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
import {ref} from "vue";

const activeQuestionIndex = ref()

const isOpenText = ref(false)


defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(
    [
      'toggleStatus',
      'removeQuestion',
    ]
)

</script>
