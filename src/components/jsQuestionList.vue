<template>
  <div v-if="filteredQuestion.length !==0">
    <h3>JavaScript</h3>
    <ul class="questions-list">
      <li class="question-item "
          :class="`bg-${item.status}`"
          v-for="item in filteredQuestion"
          :key="item.id"
          @click="toggleAnswer(item.id)"
      >
        <strong class="question-text">{{ item.title }} </strong>
        <button v-if="activeQuestionIndex !== item.id" class="delete-btn"
                @click.stop="$emit('removeQuestion', item.id)">
          <svg class="delete-icon" viewBox="0 0 24 24">
            <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        <div v-if="activeQuestionIndex === item.id" class="answer-container">
          <pre class="formatted-text">{{ item.text }}</pre>
          <div class="btn-block_question">
            <button class="btn-green" @click="$emit('finishQuestion',item.id, 'finish')">Знает</button>
            <button class="btn-red" @click="$emit('repeatQuestion',item.id, 'repeat')">Не знает</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div v-else>
    <h2>Вопросов по JavaScript нет.</h2>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";

const activeQuestionIndex = ref()

const toggleAnswer = (id) => {
  if (activeQuestionIndex.value === id) {
    activeQuestionIndex.value = null
  } else {
    activeQuestionIndex.value = id
  }
}

const props = defineProps({
  questions: {
    type: Array,
    required: true
  }
})

defineEmits(
    [
      'finishQuestion',
      'repeatQuestion',
      'removeQuestion',
      'openChip',
    ]
)

const filteredQuestion = computed(()=>{
  return props.questions.filter(e => e.category === 'js')
})

</script>
