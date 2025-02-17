import axios from "axios";

export const getQuestions = async () => {
	const { data } = await axios.get('https://chek-list-questions-default-rtdb.firebaseio.com/questions.json');

	return Object.keys(data).map(key => {
		return {
			id: key,
			...data[key]
		}
	});
}

export const patchQuestions = (id, status) => {
	return axios.patch(`https://chek-list-questions-default-rtdb.firebaseio.com/questions/${id}.json`, {
		status: status
	});
};

export const createQuestion = (question) => {
	return axios.post('https://chek-list-questions-default-rtdb.firebaseio.com/questions.json', question)
};
