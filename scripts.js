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
        "alias" : "a control room",
        "description" : "You are in a corridor.",
        "items" : ["a powercell", "a fuse", "some cable"],
        "exits" : { "east" : "bridge",
                    "west" : "engine"
                  }
        },
    
    "bridge" : {
        "alias" : "the bridge",
        "description" : "You are on the ship's bridge.",
        "items" : ["a brick", "mortar", "a plant pot"],
        "exits" : { "west" : "controlroom"
                  }
    },
    
    "engine" : {
        "alias" : "an engine room"
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
    playerLocation = "controlroom";
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
    
    validateInput();
    render();
    
    if(action === "look") {
        look();
    }
    
    //Clear input field again
    input.value ="";
}

function validateInput() {
    //Get the player's input and convert it to lowercase
    playersInput = input.value;
    playersInput = playersInput.toLowerCase();
    
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

//This function will update the output area after an action is performed
function render() {
    //Display the description of players location if they moved
    if (currentLocation !== playerLocation) {
        output.innerHTML = places[currentLocation].description + '<br/>';
    
        //Display what items can be seen in the current location
        if (places[currentLocation].items.length !== 0) {
            output.innerHTML += "You can see " + places[currentLocation].items.join(', ') + '<br/>';
        }
    }
}


function look() {
    //Display the description of the player location
    output.innerHTML = places[playerLocation].description + '<br/>';

    //Display the available exits
    if(places[playerLocation].exits) {
        let availableExits = "";
        for (let locn in places[playerLocation].exits) {
            let destination = places[playerLocation].exits[locn];
            availableExits += locn + " to " + places[destination]["alias"] + ", ";
        }
        output.innerHTML += "Exits are " + availableExits + "<br/>";
    }
    
    //Display what items can be seen in the player location
    if (places[playerLocation].items.length !== 0) {
        output.innerHTML += "You can see " + places[playerLocation].items.join(', ') + '<br/>';
    }
}