<template>
  <li class="question-item"
      :class="`bg-${item.status}`"
      @click="isQuestionOpen = !isQuestionOpen"
  >
    <strong class="question-text">{{ item.title }} </strong>

    <template v-if="isQuestionOpen">
      <button class="delete-btn" @click.stop="emit('removeQuestion', item.id)">
        <svg class="delete-icon" viewBox="0 0 24 24">
          <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>

      <div class="answer-container">
        <pre class="formatted-text">{{ item.text }}</pre>

        <div class="btn-block_question">
          <button class="btn-green" @click="emit('finishQuestion', item.id)">
            Знает
          </button>

          <button class="btn-red" @click="emit('repeatQuestion', item.id)">
            Не знает
          </button>
        </div>
      </div>
    </template>
  </li>
</template>

<script setup>
import {ref} from "vue";

defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(
    [
      'finishQuestion',
      'repeatQuestion',
      'removeQuestion',
    ]
);

const isQuestionOpen = ref(false);
</script>
