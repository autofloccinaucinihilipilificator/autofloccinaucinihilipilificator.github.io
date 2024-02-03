// This code is global variable hell and I hate it
// I really should rewrite the entire thing but like
// I don't want to :)

'use strict';


// Variables --------------------------------------------------------------- //

const setList = document.getElementById('set-list');
const setListRows = setList.querySelectorAll('tr');

const promptDisplay = document.getElementById('prompt-display');
const answerDisplay = document.getElementById('answer-display');

const inputBox = document.getElementById('input-box');
const responseForm = document.getElementById('response-form');
const responseInput = document.getElementById('response-input');

const showAnswer = document.getElementById('show-answer');

const setBuilder = document.getElementById('set-builder');
const newSetForm = document.getElementById('new-set-form');
const newSetTitleInput = document.getElementById('new-set-title-input');
const newSetDescriptionInput = document.getElementById('new-set-description-input');
const newSetDataInput = document.getElementById('new-set-data-input');
const saveNewSet = document.getElementById('save-new-set');
const exitSetBuilder = document.getElementById('exit-set-builder');

const newSet = document.getElementById('new-set');
const editSet = document.getElementById('new-set');

const sets = [];
let currentSet = [];
let selectedTerms = [];
let correctResponses = [];
let termIndex = -1;


// ------------------------------------------------------------------------- //

function range(min, max) {
    const array = [];
    for (let i = min; i < max; i++) {
        array.push(i);
    }
    return array
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randElement(array) {
    return array[randInt(0, array.length)];
}

function openSetBuilder() {
    setBuilder.style.visibility = 'visible';
}

function closeSetBuilder() {
    newSetForm.reset();
    setBuilder.style.visibility = 'hidden';
}

function nextPrompt(lastTermID, selectedTermIDArray) {
    let newTermIDArray = selectedTermIDArray;
    if (newTermIDArray.includes(lastTermID)) {
        newTermIDArray = newTermIDArray = newTermIDArray.toSpliced(termIndex, 1);
    }

    let nextTermID = randElement(newTermIDArray);

    let nextTerm = currentSet.data[nextTermID];

    promptDisplay.innerHTML = ("" + nextTerm.validTerms).replaceAll(",", ", ");
    answerDisplay.innerHTML = ("" + nextTerm.validDefs).replaceAll(",", ", ");

    return nextTermID;
}

function updateSetList() {
    for (let i = 0; i < sets.length; i++) {
        setListRows[i].innerHTML = `<button title="${sets[i].description}" onclick=loadSet(${i});>${sets[i].title}</button`
    }
}

function checkIfCorrect(response) {
    const isCorrect = (response) => correctResponses.includes(response);

    const responses = response.split(', ');

    return responses.every(isCorrect);
}

function loadSet(setIndex) {
    const previousSet = document.querySelector('.selected');

    currentSet = sets[setIndex];

    if (previousSet != null) {
        previousSet.classList.remove('selected');
    }

    setListRows[setIndex].classList.add('selected');

    selectedTerms = range(0, currentSet.data.length);
    termIndex = nextPrompt(-1, selectedTerms);
    correctResponses = currentSet.data[termIndex].validDefs;

    answerDisplay.style.visibility = 'hidden';
}


// ------------------------------------------------------------------------- //

// Open set builder
newSet.addEventListener('click', (e) => {
    openSetBuilder();
});

// Save new set
saveNewSet.addEventListener('click', (e) => {
    const rawTermArray = newSetDataInput.value.split('\n');
    const termDefArray = [];
    rawTermArray.forEach((item) => {
        termDefArray.push(item.split('; '));
    });

    const properTermArray = [];
    termDefArray.forEach((term) => {
        const singleStudyableArray = {
            "validTerms": term[0].split(', '),
            "validDefs": term[1].split(', ')
        };
        properTermArray.push(singleStudyableArray);
    });

    sets.push(
        {
            "type": "set",
            "title": newSetTitleInput.value,
            "description": newSetDescriptionInput.value,
            "data": properTermArray,
            "selected": [],
        }
    );
    newSetForm.reset();
    updateSetList();
    closeSetBuilder();
});

// Exit set builder
exitSetBuilder.addEventListener('click', (e) => {
    closeSetBuilder();
});

// Check if user response to prompt is correct, display animation, rotate term
responseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    responseForm.classList.remove('correct');
    responseForm.classList.remove('incorrect');

    const input = responseInput.value;

    // I have no idea why this works.
    // I thought it was because it makes the browser wait
    // when removing and readding the CSS animation
    // but just adding a timeout didn't work.
    // This will almost certainly break at some point but ehhh who cares :)
    void responseInput.offsetWidth;

    if (checkIfCorrect(input)) {
        responseForm.classList.add('correct');
        termIndex = nextPrompt(
            termIndex,
            selectedTerms
        );
        correctResponses = currentSet.data[termIndex].validDefs;
        responseForm.reset();
        answerDisplay.style.visibility = 'hidden';
    }
    else {
        responseForm.classList.add('incorrect');
    }
});

// Prevent set builder form submit on hitting enter key
newSetForm.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Show answer on button click
showAnswer.addEventListener('click', (e) => {
    answerDisplay.style.visibility = 'visible';
});

