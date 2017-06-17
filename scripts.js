"use strict";

console.info ("Script Started");
var output = document.querySelector('#output');
var input = document.querySelector('#input');
var displayImg = document.querySelector('#displayImg');

var button = document.querySelector('#button');
button.style.cursor = "pointer";
button.addEventListener("click", clickHandler, false);
window.addEventListener("keydown", keydownHandler, false);

//Clear Input Field
input.value ="";

//Show Start Message
output.innerHTML = 'Welcome to Abandoned Ship.<br/>';

//Set Focus on Input Field
input.focus();

function clickHandler() {
    
}

function keydownHandler() {
    
}