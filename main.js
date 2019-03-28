Vue.component('questions', {
    template: `
  
  <div>
  <div v-if="showingResults" class="jumbotron jumbotron-fluid results">
        <div class="container">
            <h1 class="display-4">Results</h1>
            <p class="lead">You got {{ amountOfQuestionsCorrect.length }} out of {{ amountOfQuestions }} correct!</p>
        </div>
    </div>
      
    <div class="container questions">
        <question
            v-for="(question, index) in questions"
            :key="index"
            :question-id="index + 1"
            :question="question"
            :showingResults="showingResults"
        />
    </div>
    
    <div class="container">
      <div class="row">
        <div class="col-12 text-center button">
          <button class="btn btn-lg btn--show-result" @click='showResultButton()' v-if="!showingResults">Show results</button>
        </div>
      </div>
    </div>    
  </div>

`,
    data() {
        return {
            questions: [],
            showingResults: false
        }
    },
    created() {
        fetch('questions.json')
            .then(res => res.json())
            .then(res => {

                res.questions.map(function (v) {
                    v.correct = false
                })

                this.questions = _.shuffle(res.questions);
            })
    },
    computed:
        {
            amountOfQuestions: function(){
                return this.questions.length;
            },
            amountOfQuestionsCorrect(){
                return this.questions.filter(this.isCorrect);
            }
        },
    methods: {
        showResultButton() {
            this.showingResults = true;
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        },
        isCorrect(questions) {
            return questions.correct;
        },
    }

});

Vue.component('question', {
    template: `
<div class="row question" v-bind:class="[questionId % 2 == 0 ? 'odd' : 'even']"> 
    <div class="col-12 col-md-2 no">
        Question {{ questionId }}
    </div>
    <div class="col-12 col-md-10">
    
        <div>
            
            <p :inner-html.prop="question.text | formatCode" />
            
            <p v-if="question.snippet">
                <code>{{ question.snippet }}</code>
            </p>
            
        </div>
        
        <div v-if="!showingResults">
            <div v-if="question.type === 'mc'" class="form-group">
                <div v-for="(mcanswer,index) in shuffledMcQuestions" class="form-check">
                    <input class="form-input" type="radio" :id="String(questionId) + String(index)" v-model="answer" :value="mcanswer" @change="submitAnswer"> <label :for="String(questionId) + String(index)" :inner-html.prop="mcanswer | formatCode"></label><br/>
                </div>
            </div>
            
            <ul v-if="question.type === 'tf'" class="list-group">
                <div class="form-check"><input type="radio" :id="'t' + questionId" v-model="answer" value="t" @change="submitAnswer"> <label :for="'t' + questionId">True</label></div>
                <div class="form-check"><input type="radio" :id="'f' + questionId" v-model="answer" value="f" @change="submitAnswer"> <label :for="'f' + questionId">False</label></div>
            </ul>
            
            <p v-if="question.type === 'input'">
                <input type="input" v-model="answer" @change="submitAnswer"> 
            </p>
        </div>
        
    <div v-if="showingResults" class="col-12">
    
        <div class="alert" v-bind:class="[answerIsCorrect ? 'alert-success' : 'alert-danger']" role="alert">
          <h4 class="alert-heading" v-if="answerIsCorrect">Well done!</h4>
          <h4 class="alert-heading" v-else>Oops..</h4>
          <p class="mb-0">You answered: <strong>{{ answer }}</strong></p>
          <p class="mb-0">The answer is: <strong>{{ question.answer }}</strong></p>
          <div v-if="question.explanation">
          <hr>
          <p>{{ question.explanation }}</p>
          </div>
        </div>
    </div>
        
        
    
    </div>
    

    
</div>
`,
    data() {
        return {
            answer: ''
        }
    },
    methods: {
        submitAnswer: function () {
            this.question.correct = this.answerIsCorrect
        }
    },
    filters: {
        formatCode: function(text) {
            return text.replace(/`(.*?)`/g, "<code>\$1</code>");
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