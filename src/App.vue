<script setup>
import axios from "axios";
import {onMounted, reactive, ref} from "vue";

const questions = ref([])
const titleQuestion = ref('')
const textQuestion = ref('')
const toggleAddQuestion = ref(false)
const activeQuestionIndex = ref(1)

const toggleAnswer = (id) =>{
  if (activeQuestionIndex.value === id){
    activeQuestionIndex.value = null
  }else{
    activeQuestionIndex.value = id
  }
}


const loadQuestions = async () => {
  const {data} = await axios.get('https://chek-list-questions-default-rtdb.firebaseio.com/questions.json')
  questions.value = Object.keys(data).map(key => {
    return {
      id: key,
      ...data[key]
    }
  })
}

const addQuestion = async () => {
  const question = ref({
    title: titleQuestion.value,
    text: textQuestion.value,
    status: 'active'
  })
  await axios.post('https://chek-list-questions-default-rtdb.firebaseio.com/questions.json', question.value)

  questions.value.push(question.value)
  titleQuestion.value = ''
  textQuestion.value = ''
}


onMounted(() => {
  loadQuestions()
})
</script>

<template>
  <div class="app-container" v-if="!toggleAddQuestion">
    <h1 class="app-title">Список вопросов</h1>
    <ul class="questions-list">

      <li class="question-item bg-1"
          v-for="item in questions"
          :key="item.id"
          @click="toggleAnswer(item.id)"
      >
        <strong class="question-text">{{ item.title}}</strong>
        <div class="">
          <p v-if="activeQuestionIndex === item.id">{{ item.text}}</p>
        </div>
      </li>

    </ul>
    <button class="button" @click="toggleAddQuestion = !toggleAddQuestion">Добавить вопрос</button>
  </div>

  <div class="app-container" v-if="toggleAddQuestion">
    <div class="input-container">
      <input v-model="titleQuestion" type="text" class="custom-input" placeholder="Введите вопрос">
      <input v-model="textQuestion" type="text" class="custom-input" placeholder="Введите ответ на вопрос">
      <div class="btn-block_question">
        <button class="button" @click="addQuestion" :disabled="!activeBtn">Добавить вопрос</button>
        <button class="button" @click="toggleAddQuestion = !toggleAddQuestion">{{ toggleAddQuestion === false? 'Добавить вопрос' : 'Назад к списку вопросов' }}</button>
      </div>
    </div>
  </div>
</template>

