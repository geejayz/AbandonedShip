"use strict";

console.info ("Script Started");

//Create a reference to each of our user interface elements
let output = document.querySelector('#output');
let input = document.querySelector('#input');
let displayImg = document.querySelector('#displayImg');
let button = document.querySelector('#button');

//Style the button hover state
button.style.cursor = "pointer";

//Add event listeners to the button & window
button.addEventListener("click", clickHandler, false);
window.addEventListener("keydown", keydownHandler, false);

//Create variables used in parsing the user input
let playersInput = "";
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
let itemsAvailable = ['fuse', 'powercell', 'passcard'];

//Create location variables
let playerLocation = "";
let currentLocation = "";

//Create an object containing all of our location data
let places = {
    "controlroom" : {
        "description" : "You are in a corridor. Exits are east to the ships's bridge and west to the engine room.",
        "items" : "powercell",
        "exits" : { "east" : "bridge",
                    "west" : "engine"
                  }
        },
    
    "bridge" : {
        "description" : "You are on the ship's bridge.",
        "items" : "brick",
        "exits" : { "west" : "controlroom"
                  }
    }
};


// START GAME HERE
start();











//Add functions below

//Run this function at the start of the game or on restart to reset
function start() {
    //Clear Input Field
    input.value ="";

    //Show Start Message
    output.innerHTML = 'Welcome to Abandoned Ship.<br/>';

    //Set Focus on Input Field
    input.focus();
    
    //Set player start location
    playerLocation = "bridge";
}

function keydownHandler(event) {
    //If user hits the return key it will trigger the clickhandler function
    if(event.keyCode === 13) {
            clickHandler();
    }
}

//This triggers when the 'action' button is clicked
function clickHandler() {
    //Store current location for movement check later
    currentLocation = playerLocation;

    //Get the player's input and convert it to lowercase
    playersInput = input.value;
    playersInput = playersInput.toLowerCase();
    
    output.innerHTML = places[currentLocation]["description"];
    
    validateInput();
    
    //Clear input field again
    input.value ="";
}

function validateInput() {
    //take the string entered and make an array at each individual word
    let inputArray = playersInput.split(" ");
    
   //iterate through all of the words and remove any common words such as the, off, of, for etc
    let commonWords = ['the','of','off','for','and','this','a'];
    
    for (let i = 0; i <inputArray.length; i++) {
		//next set up a loop to check all words in the commonWords array
		for (let j = 0; j < commonWords.length; j++) {
			//compare both words and remove it from the input array if it matches
			if (inputArray[i] === commonWords[j]) {
				inputArray.splice(i,1);
			}
		}
    }
    
    //At this point we have a cleaned up input array with common words removed.
    //We now need to check the input array to find an action word
    
    //set up a loop to iterate through all words in the input array
        for (let i = 0; i < inputArray.length; i++) {
            //next set up a loop to check all words in the allowed commands array
            for (let j = 0; j < allowedCommands.length; j++) {
                //compare both words and set the action if it matched
                if (inputArray[i] === allowedCommands[j]) {
                        action = allowedCommands[j];
                }
            }
            
            //set up a loop to check all words in the items available array
            for (let k=0; k < itemsAvailable.length; k++) {
                //break down item name into single words
                let itemPartial = itemsAvailable[k].split(" ");
                for (let m=0; m < itemPartial.length; m++) {
                        if(inputArray[i] === itemPartial[m]) {
                                item = itemsAvailable[k];
                        }
                }
            }   
        }
        
}


