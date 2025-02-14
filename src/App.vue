<script setup>
import axios from "axios";

import {computed, onMounted, ref} from "vue";

const defaultQuestion = Object.freeze({
  title: '',
  text: '',
  status: 'active'
})

const questions = ref([])
const draftQuestion = ref({...defaultQuestion})
const toggleAddQuestion = ref(false)
const activeQuestionIndex = ref(1)

const toggleAnswer = (id) => {
  if (activeQuestionIndex.value === id) {
    activeQuestionIndex.value = null
  } else {
    activeQuestionIndex.value = id
  }
}

const toggleQuestionStatus = async (id, status) => {
  await axios.patch(`https://chek-list-questions-default-rtdb.firebaseio.com/questions/${id}.json`, {
    status: status
  })
  const questionIndex = questions.value.findIndex(e => e.id === id)
  questions.value[questionIndex].status = status
}

const loadQuestions = async () => {
  const {data} = await axios.get('https://chek-list-questions-default-rtdb.firebaseio.com/questions.json');

  questions.value = Object.keys(data).map(key => {
    return {
      id: key,
      ...data[key]
    }
  })
}

const addQuestion = async () => {
  await axios.post('https://chek-list-questions-default-rtdb.firebaseio.com/questions.json', draftQuestion.value);

  draftQuestion.value = {...defaultQuestion}

  await loadQuestions()
};

const disabledAddButton = computed(() => draftQuestion.value.title.length < 3 || draftQuestion.value.text.length < 3);
const returnButtonText = computed(() => toggleAddQuestion
    ? 'Назад к списку вопросов'
    : 'Добавить вопрос');

onMounted(() => {
  loadQuestions()
})
</script>

<template>

  <div class="app-container" v-if="!toggleAddQuestion">
    <h1 class="app-title">Список вопросов</h1>

    <div class="chip-container">
      <div class="chip">CSS</div>

      <div class="chip">JavaScript</div>

      <div class="chip">Vue</div>

      <div class="chip">Общие</div>
    </div>
    <ul class="questions-list">
      <li class="question-item"
          :class="`bg-${item.status}`"
          v-for="item in questions"
          :key="item.id"
          @click="toggleAnswer(item.id)"
      >
        <strong class="question-text">{{ item.title }}</strong>

        <div v-if="activeQuestionIndex === item.id" class="">
          <pre class="formatted-text">{{ item.text }}</pre>

          <div class="btn-block_question">
            <button class="btn-green" @click="toggleQuestionStatus(item.id, 'finish')">Знает</button>

            <button class="btn-red" @click="toggleQuestionStatus(item.id, 'repeat')">Не знает</button>
          </div>
        </div>
      </li>
    </ul>

    <button class="button" @click="toggleAddQuestion = !toggleAddQuestion">Добавить вопрос</button>
  </div>

  <div class="app-container" v-if="toggleAddQuestion">
    <div class="input-container">
      <input v-model="draftQuestion.title" type="text" class="custom-input" placeholder="Введите вопрос">

      <textarea v-model="draftQuestion.text" type="text" class="custom-input" placeholder="Введите ответ на вопрос"/>

      <div class="btn-block_question">
        <button class="button" @click="addQuestion" :disabled="disabledAddButton">
          Добавить вопрос
        </button>

        <button class="button" @click="toggleAddQuestion = !toggleAddQuestion">
          {{ returnButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.formatted-text {
  white-space: pre-line; /* Сохраняет переносы строк и пробелы */
  word-wrap: break-word; /* Разбивает длинные слова, если они не помещаются */
  overflow-wrap: break-word; /* То же, что и word-wrap для современных браузеров */
  max-width: 100%; /* Ограничивает ширину контейнера */
}
</style>
