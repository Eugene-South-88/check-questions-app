<script setup>
import axios from "axios";
import {computed, onMounted, ref, shallowRef} from "vue";
import allQuestionList from "@/components/allQuestionList.vue";
import cssQuestionList from "@/components/cssQuestionList.vue";
import jsQuestionList from "@/components/jsQuestionList.vue";
import vueQuestionList from "@/components/vueQuestionList.vue";
import otherQuestionList from "@/components/otherQuestionList.vue";

const defaultQuestion = Object.freeze({
  title: '',
  text: '',
  category: '',
  status: 'active'
})

const questions = ref([])
const draftQuestion = ref({...defaultQuestion})
const category = [
  { value: 'css', label: 'CSS' },
  { value: 'js', label: 'JavaScript' },
  { value: 'vue', label: 'Vue' },
  { value: 'other', label: 'Other' },
]
const openQuestionForm = ref(false)
const activeChipQuestion = ref('allQuestionList')

const loadQuestions = async () => {
  const {data} = await axios.get('https://chek-list-questions-default-rtdb.firebaseio.com/questions.json')
  questions.value = Object.keys(data).map(key => {
    return {
      id: key,
      ...data[key]
    }
  })
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
  const confirmDelete = prompt('Введите пороль для удаления:');
  if (confirmDelete === '2003') {
    await axios.delete(`https://chek-list-questions-default-rtdb.firebaseio.com/questions/${id}.json`)
  } else {
    alert('Обойдешься')
  }
  await loadQuestions()
}

const isEnabledBtn = computed(() => (
    draftQuestion.value.title.length > 3 &&
    draftQuestion.value.text.length > 3 &&
    draftQuestion.value.category !== ''
))

onMounted(() => {
  loadQuestions()
})
</script>

<template>

  <div class="app-container" v-if="!openQuestionForm">

    <h1 class="app-title">Список вопросов</h1>
    <div class="chip-container">
      <div class="chip" @click="activeChipQuestion = 'allQuestionList'">Все вопросы</div>
      <div class="chip" @click="activeChipQuestion = 'cssQuestionList'">CSS</div>
      <div class="chip" @click="activeChipQuestion = 'jsQuestionList'">JavaScript</div>
      <div class="chip" @click="activeChipQuestion = 'vueQuestionList'">Vue</div>
      <div class="chip" @click="activeChipQuestion = 'otherQuestionList'">Общие</div>
    </div>
    <component
    :is="activeChipQuestion"
        :questions="questions"
        @finish-question="toggleQuestionStatus"
        @repeat-question="toggleQuestionStatus"
        @removeQuestion="deleteQuestion"
    >
    </component>
    <button class="button" @click="openQuestionForm = true">Добавить вопрос</button>
  </div>

  <div class="app-container" v-if="openQuestionForm">
    <div class="input-container">
      <input v-model="draftQuestion.title" type="text" class="custom-input" placeholder="Введите вопрос">
      <textarea v-model="draftQuestion.text"
                type="text"
                class="custom-input"
                placeholder="Введите ответ на вопрос"
      ></textarea>

      <div class="option-list">
        <div
            v-for="option in category"
            :key="option.value"
            class="option-card"
            :class="{ active: draftQuestion.category === option.value }"
            @click="draftQuestion.category = option.value"
        >
          {{ option.label }}
        </div>
      </div>

      <div class="btn-block_question">
        <button class="button" @click="openQuestionForm = !openQuestionForm">
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
