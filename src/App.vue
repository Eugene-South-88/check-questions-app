<script setup>
import axios from "axios";
import {computed, onMounted, ref} from "vue";
import { createQuestion, getQuestions, patchQuestions } from "@/api/questions.js";
import QuestionItem from "@/components/QuestionItem.vue";

const defaultQuestion = Object.freeze({
  title: '',
  text: '',
  category: '',
  status: 'active'
});
const chips = [
  {name: 'All', value: null, label: 'all'},
  {name: 'CSS', value: 'css', label: 'CSS'},
  {name: 'JS', value: 'js', label: 'JavaScript'},
  {name: 'Vue', value: 'vue', label: 'Vue'},
  {name: 'Other', value: 'other', label: 'Other'},
];

const questions = ref([])
const draftQuestion = ref({...defaultQuestion})
const openQuestionForm = ref(false)
const activeChip = ref(null)

const loadQuestions = async () => {
  questions.value = await getQuestions();
}

const toggleQuestionStatus = (id, status) => {
  patchQuestions(id, status).then(() => {
    loadQuestions();
  });
}

const addQuestion = () => {
  createQuestion(draftQuestion.value).then(() => {
    draftQuestion.value = {...defaultQuestion};
    loadQuestions();
  })
};

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

const isEnabledBtn = computed(() => (
    draftQuestion.value.title.length > 3
    && draftQuestion.value.text.length > 3
    && draftQuestion.value.category !== ''
))

const filteredQuestions = computed(() => activeChip.value
    ? questions.value.filter(e => e.category === activeChip.value)
    : questions.value
)
onMounted(() => {
  loadQuestions()
})
</script>

<template>
  <div class="app-container" v-if="!openQuestionForm">

    <h1 class="app-title">Список вопросов</h1>
    <div class="chip-container">
      <div
          class="chip"
          v-for="chip in chips"
          @click="activeChip = chip.value"
      >{{ chip.name }}
      </div>
    </div>
    <question-item
        v-for="question in filteredQuestions"
        :key="question.id"
        :item="question"
        @toggle-status="toggleQuestionStatus"
        @removeQuestion="deleteQuestion"
    />
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
            v-for="option in chips"
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
