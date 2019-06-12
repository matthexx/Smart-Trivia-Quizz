const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion ={};
let acceptingAnswers = true;
let score = 0;
let QuestionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=15&category=23&difficulty=medium&type=multiple")
.then(res =>{
    return res.json();
})
.then( loadedQuestions => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map(loadedQuestion =>{
        const formattedQuestion = {
            question: loadedQuestion.question
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) +  1;
        answerChoices.splice(
            formattedQuestion.answer -1,
            0,
            loadedQuestion.correct_answer
        );

        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index+1)] = choice;
        })

        return formattedQuestion;
    });
   
    startGame();
})

.catch(err => {
    console.error(err);
});


const  CORRECT_BONUS = 10;
const MAX_QUESTIONS = 15;

startGame = () => {
    QuestionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () =>{

    if(availableQuestions.length === 0 || QuestionCounter > MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("/end.html");  
    };
    QuestionCounter ++;
    //2nd line shows how to use backtick to concatenate variables and strings
    // QuestionCounterText.innerText = (QuestionCounter + "/" + MAX_QUESTIONS);
    progressText.innerText = `Question  ${QuestionCounter} / ${MAX_QUESTIONS}`;
 
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice =>{
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });
    
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
    
};

choices.forEach(choice =>{
    choice.addEventListener("click", e =>{
        if(!acceptingAnswers) return;

        //update the progressBar
        progressBarFull.style.width = `${(QuestionCounter / MAX_QUESTIONS) * 100}%`;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : "incorrect";

        if(classToApply == "correct")
            incrementScore(CORRECT_BONUS);
        console.log(classToApply);
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();

        }, 1000);

           
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};


 

