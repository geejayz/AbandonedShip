"use strict";

console.info ("Script Started");

//Create a reference to each of our user interface elements
let output = document.querySelector('#output');
let input = document.querySelector('#input');
let displayImg = document.querySelector('#displayImg');
let button = document.querySelector('#button');

//Style the button hover state
button.style.cursor = "pointer";

//Create variables used in parsing the user input
let action = "";
let item = "";

//Create an array of allowed commands
let allowedCommands = [
    'north','south','east','west',
    'northwest','northeast','southwest','southeast',
    'up','down','take','drop','examine','look', 'use', 'blow',
    'break','inventory', 'inv', 'in', 'out', 'help',
    'attack', 'open', 'close', 'empty', 'fill', 'give', 'knock', 'light', 
    'listen', 'mend', 'repair', 'fix', 'yes', 'no', 'plant', 'play', 'press', 'pull', 
    'run', 'throw', 'tie', 'wait', 'wave', 'eat', 'drink'
];

//Create an array of items available within the game
let items = ['fuse', 'powercell', 'passcard'];



//Add event listeners to the button & window
button.addEventListener("click", clickHandler, false);
window.addEventListener("keydown", keydownHandler, false);




//Run this function at the start of the game or on restart to reset
function start() {
    //Clear Input Field
    input.value ="";

    //Show Start Message
    output.innerHTML = 'Welcome to Abandoned Ship.<br/>';

    //Set Focus on Input Field
    input.focus();
}








//Add functions below
function clickHandler() {
    
}

function keydownHandler() {
    
}

var places = {
    
};