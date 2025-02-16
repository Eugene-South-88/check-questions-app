<script setup>
import axios from "axios";

import {computed, onMounted, ref} from "vue";
import QuestionItem from "@/components/QuestionItem.vue";

const defaultQuestion = Object.freeze({
  title: '',
  text: '',
  category: '',
  status: 'active'
});
const categories = [
  {value: 'css', label: 'CSS'},
  {value: 'js', label: 'JavaScript'},
  {value: 'vue', label: 'Vue'},
  {value: 'other', label: 'Other'},
];

const questions = ref([]);
const draftQuestion = ref({...defaultQuestion});
const isQuestionFormActive = ref(false);
const activeChip = ref(null);

const loadQuestions = async () => {
  const {data} = await axios.get('https://chek-list-questions-default-rtdb.firebaseio.com/questions.json')
  questions.value = Object.keys(data).map(key => {
    return {
      id: key,
      ...data[key]
    }
  })
}

const setChipValue = (value) => {
  activeChip.value = value;
}

const toggleQuestionStatus = async (id, status) => {
  await axios.patch(`https://chek-list-questions-default-rtdb.firebaseio.com/questions/${id}.json`, {
    status: status
  })
  await loadQuestions()
}

const addQuestion = async () => {
  await axios.post('https://chek-list-questions-default-rtdb.firebaseio.com/questions.json', draftQuestion.value)

  draftQuestion.value = {...defaultQuestion}

  await loadQuestions()
}

const deleteQuestion = async (id) => {
  console.log(id)
  const confirmDelete = prompt('Введите пароль для удаления:');
  if (confirmDelete === '2003') {
    await axios.delete(`https://chek-list-questions-default-rtdb.firebaseio.com/questions/${id}.json`)
  } else {
    alert('Обойдешься')
  }
  await loadQuestions()
}

const filteredQuestions = computed(() => activeChip.value
    ? questions.value.filter((question) => question.category === activeChip.value)
    : questions.value);

const isEnabledBtn = computed(() => (
    draftQuestion.value.title.length > 3 &&
    draftQuestion.value.text.length > 3 &&
    draftQuestion.value.category !== ''
))

const activeChipTitle = computed(() => categories.find((category) => category.value === activeChip.value)?.label);

onMounted(() => {
  loadQuestions()
})
</script>

<template>

  <div class="app-container" v-if="!isQuestionFormActive">

    <h1 class="app-title">Список вопросов</h1>
    <div class="chip-container">
      <div class="chip" @click="setChipValue(null)">
        Все
      </div>
      <div class="chip" v-for="(chip, idx) in categories" :key="idx" @click="setChipValue(chip.value)">
        {{ chip.label }}
      </div>
    </div>

    <div v-if="filteredQuestions.length !== 0">
      <ul class="questions-list">
        <QuestionItem
            v-for="question in filteredQuestions"
            :key="question.id"
            :item="question"
        />
      </ul>
    </div>
    <div v-else>
      Вопросов по {{ activeChipTitle }} нет.
    </div>

    <button class="button" @click="isQuestionFormActive = true">Добавить вопрос</button>
  </div>

  <div class="app-container" v-if="isQuestionFormActive">
    <div class="input-container">
      <input v-model="draftQuestion.title" type="text" class="custom-input" placeholder="Введите вопрос">
      <textarea v-model="draftQuestion.text"
                type="text"
                class="custom-input"
                placeholder="Введите ответ на вопрос"
      ></textarea>

      <div class="option-list">
        <div
            v-for="option in categories"
            :key="option.value"
            class="option-card"
            :class="{ active: draftQuestion.category === option.value }"
            @click="draftQuestion.category = option.value"
        >
          {{ option.label }}
        </div>
      </div>

      <div class="btn-block_question">
        <button class="button" @click="isQuestionFormActive = !isQuestionFormActive">
          Назад к списку вопросов
        </button>
        <button class="button" @click="addQuestion" :disabled="!isEnabledBtn">Добавить вопрос</button>
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
  margin: 1em 0;
}
</style>
