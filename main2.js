Vue.component('questions', {
    template: `
  
  <div id="questions">

    <table class="table table-striped table-bordered">
    <tbody>
        <question
            v-for="(question, index) in questions"
            :key="index"
            v-on:answer="handleAnswer"
            :question-id="index + 1"
            :question="question"
            :showingResults="showingResults"
        />
        </tbody>
    </table>
    
    <button @click='showResultButton()'>Show results</button>
    
  </div>

`,
    data() {
        return {
            questions: [],
            showingResults: true
        }
    },
    created() {
        fetch('questions.json')
            .then(res => res.json())
            .then(res => {
                this.questions = _.shuffle(res.questions);
            })
    },
    computed:
        {
            amountOfQuestions: function(){
                return this.questions.length;
            },
        },
    methods: {
        handleAnswer(e) {
            console.log(e.correct);
        },
        showResultButton() {
            this.showingResults = true;
        }
    }

});

Vue.component('question', {
    template: `
<tr>
<td>
    Question {{ questionId }}
</td>
<td>

    <p>{{ question.text }}</p>
    
    <p v-if="question.snippet">
        <code>{{ question.snippet }}</code>
    </p>
    
    <div v-if="question.type === 'mc'" class="form-group">
        <div v-for="(mcanswer,index) in shuffledMcQuestions" class="form-check">
            <input class="form-input" type="radio" :id="'answer'+index" v-model="answer" :value="mcanswer" @change="submitAnswer"> <label :for="'answer'+index">{{mcanswer}}</label><br/>
        </div>
    </div>
    
    <ul v-if="question.type === 'tf'" class="list-group">
        <div class="form-check"><input type="radio" :id="'t' + questionId" v-model="answer" value="t" @change="submitAnswer"> <label :for="'t' + questionId">True</label></div>
        <div class="form-check"><input type="radio" :id="'f' + questionId" v-model="answer" value="f" @change="submitAnswer"> <label :for="'f' + questionId">False</label></div>
    </ul>
    
    <p v-if="question.type === 'input'">
        <input type="input" v-model="answer" @change="submitAnswer"> 
    </p>
    
 </td>
    
    
    <td v-if="showingResults" v-bind:class="[answerIsCorrect ? '' : '']">
        <p><strong>Answer</strong></p>
        <p>{{ question.answer }}</p>
 </td>
    

</tr>
`,
    data() {
        return {
            answer: ''
        }
    },
    methods: {
        submitAnswer: function () {
            this.$emit('answer', {
                correct: this.answerIsCorrect
            });
        }
    },
    computed: {
        answerIsCorrect: function () {
            return this.answer === this.question.answer
        },
        shuffledMcQuestions:  function () {
            return _.shuffle(this.question.wrong.concat(this.question.answer))
        }
    },
    props: ['question', 'questionId', 'showingResults']
});

const app = new Vue({
    el: '#root',
    data() {
        return {}

    }
})