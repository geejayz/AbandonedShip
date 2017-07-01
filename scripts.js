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
    'run', 'throw', 'tie', 'wait', 'wave', 'eat', 'drink',
    'n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se', 'u', 'd'
];

let moves = [
    'north','south','east','west',
    'northwest','northeast','southwest','southeast',
    'up','down', 'in', 'out', 'n', 's', 'e', 'w', 
    'nw', 'ne', 'sw', 'se', 'u', 'd'
];

//Create an array of items available within the game
let itemsAvailable = ['fuse', 'powercell', 'passcard'];

//Create a player inventory
let backpack = [];

//Create location variables
let playerLocation = "";
let currentLocation = "";

//Create an object containing all of our location data
let places = {
    
    "forwardobservation" : {
        "alias" : "the forward observation room",
        "description" : "You are in the forward observation room. From here you can see the direction the ship is heading. It appears to be approaching a large star rather quickly.",
        "items" : [],
        "exits" : { "south" : "controldesk" 
        }
    },
    
    "engineeringpanel" : {
        "alias" : "an engineering panel",
        "description" : "You are beside an engineering panel. You can see a small flashing dot on the display that appears to be moving towards a large circular object.",
        "items" : [],
        "exits" : { "south" : "controlrack",
                    "east" : "controldesk"
        }
    },
    
    "controldesk" : {
        "alias" : "a control desk",
        "description" : "You are standing over a small control desk. There are several levers, switches and dials and a very large button in the centre with the word 'Autopilot' written on it.",
        "items" : [],
        "exits" : { "north" : "forwardobservation",
                    "south" : "doorway",
                    "east" : "commspanel",
                    "west" : "engineeringpanel"
        }
    },
    
    "commspanel" : {
        "alias" : "a communication panel",
        "description" : "You are standing next to a communications panel.",
        "items" : [],
        "exits" : { "south" : "storagelocker",
                     "west" : "controldesk"
        }
    },
    
    "controlrack" : {
        "alias" : "a control rack",
        "description" : "You are beside a control rack with lots of exposed circuit boards and cabling.",
        "items" : [],
        "exits" : { "north" : "engineeringpanel",
                    "east" : "doorway"
        }
    },
    
    "doorway" : {
        "alias" : "a doorway",
        "description" : "You are in the entrance to the main control room of the ship.",
        "items" : [],
        "exits" : { "north" : "controldesk",
                    "south" : "corridor1",
                    "east" : "storagelocker",
                    "west" : "controlrack"
        }
    },
    
    "storagelocker" : {
        "alias" : "a storage locker",
        "description" : "You are standing beside a storage locker.",
        "items" : [],
        "locked" : true,
        "open"  : function() { if(this.locked) { console.log ('locked'); }
                               output.innerHTML += "It's locked. There is a slot for a passcard to be inserted. <br/>";
                  },
        "use"   : function() {
                                if(item === "passcard") {
                                    console.log('Unlocked');
                                    this.locked = false;
                                }
        },
        "exits" : { "north" : "commspanel",
                    "west" : "doorway"
        }
    },
    
    "corridor1" : {
        "alias" : "a corridor",
        "description" : "You are in a well lit corridor.",
        "items" : [],
        "exits" : { "north" : "doorway",
                    "south" : "corridor2"
        }
    },
    
    "corridor2" : {
        "alias" : "a corridor",
        "description" : "You are in a well lit corridor.",
        "items" : [],
        "exits" : { "north" : "corridor1",
                    "south" : "hub1"
        }
    },
    
    "hub1" : {
        "alias" : "a hub",
        "description" : "You are at a hub in the centre of the ship.",
        "items" : [],
        "exits" : { "north" : "corridor2",
                    //"south" : "corridor3",
                    "east" : "passageway3",
                    "west" : "passageway1"
        }
    },
    
    "passageway1" : {
        "alias" : "a wide green passageway",
        "description" : "You are in a wide green passageway. Curved windows here let you see the forward and rear lights on the ship. Other than that, it is pitch black outside.",
        "items" : [],
        "exits" : { "east" : "hub1",
                    "west" : "passageway2"
        }
    },
    
    "passageway2" : {
        "alias" : "a wide green passageway",
        "description" : "You are in a wide green passageway.",
        "items" : [],
        "exits" : { "east" : "passageway1",
                    "west" : "portaccess"
        }
    },
    
    "passageway3" : {
        "alias" : "a wide green passageway",
        "description" : "You are in a wide green passageway. Curved windows here let you see the forward and rear lights on the ship. Other than that, it is pitch black outside.",
        "items" : [],
        "exits" : { "east" : "passageway4",
                    "west" : "hub1"
        }
    },
    
    "passageway4" : {
        "alias" : "a wide green passageway",
        "description" : "You are in a wide green passageway.",
        "items" : [],
        "exits" : { "east" : "starboardaccess",
                    "west" : "passageway3"
        }
    },
    
    "portaccess" : {
        "alias" : "an access corridor",
        "description" : "You are in an access corridor.",
        "items" : [],
        "exits" : { "north" : "medicallab",
                    "south" : "portengine",
                    "east"  : "passageway1"
        }
    },
    
    "medicallab" : {
        "alias" : "the medical lab",
        "description" : "You are in the ship's medical lab. It is modern looking and brighly lit.",
        "items" : ['passcard'],
        "exits" : { "south" : "portaccess"
        }
    },
    
    "portengine" : {
        "alias" : "the port engine room",
        "description" : "You are in an engine room. You can see a large powerful looking engine.",
        "items" : [],
        "exits" : { "north" : "portaccess"
        }
    },
    
    "starboardaccess" : {
        "alias" : "an access corridor",
        "description" : "You are in an access corridor.",
        "items" : [],
        "exits" : { "north" : "brig",
                    "south" : "starboardengine",
                    "west"  : "passageway4"
        }
    },
    
    "brig" : {
        "alias" : "the ship's brig",
        "description" : "You are in the ship's brig. There are two empty cells but no occupants, thankfully!",
        "items" : ['fuse'],
        "exits" : { "south" : "starboardaccess"
        }
    },
    
    "starboardengine" : {
        "alias" : "the starboard engine room",
        "description" : "You are in an engine room. You can see a large powerful looking engine.",
        "items" : [],
        "exits" : { "north" : "starboardaccess"
        }
    }
};


// START GAME HERE
start();




// FUNCTIONS
// 
//Run this function at the start of the game or on restart to reset
function start() {
    //Clear Input Field
    input.value ="";

    //Show Start Message
    output.innerHTML = "Welcome to Abandoned Ship.<br/> Stranded on a spaceship \n\
                        far from spacedock and seemingly, with all the crew missing, you must \n\
                        figure out a way to get yourself home again.</br>\n\
                        Type 'look' to start your adventure.</br>";

    //Set Focus on Input Field
    input.focus();
    
    //Set player start location
    playerLocation = "forwardobservation";
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
    handleInput();
    resolveAction();
    render();
    
    if(action === "look") {
        look();
    }
    
    if(action === "take") {
        take();
    }
    
    if(action === "drop") {
        drop();
    }
    
    if(action === "inventory" || action === "inv") {
        inventory();
    }
    
    //Clear input field again
    input.value ="";
}

function validateInput() {
    //Check that our input is not empty
    if(input.value !== "") {
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
                        //As action is found stop looping
                         var breakLoop = true;
                }
                if(breakLoop) { break; }
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
        
        //Convert abbreviated commands to their full version
        switch(action) {
            case "n": 
                action = "north";
                break;
                
            case "s":
                action = "south";
                break;
            
            case "e":
                action = "east";
                break;
                
            case "w":
                action = "west";
                break;
             
           case "nw":
                action = "northwest";
                break;
            
            case "ne":
                action = "northeast";
                break;
            
            case "sw":
                action = "southwest";
                break;
            
            case "se":
                action = "southeast";
                break;
            
            case "u":
                action = "up";
                break;
            
            case "d":
                action = "down";
                break;
        } 
    
        //If no action or item found in input
        if (action === "" && item === "") {
            output.innerHTML += "What? <br/>";
        }

        //If action not understood but item is valid
         if (action === "" && item !== "") {
            output.innerHTML += "Do what to a " + item + "? <br/>";
        }
    }
    else {
        output.innerHTML = "Please enter a text command into the input field \n\
                            below and press the action button or return key.";
    }
    
    console.log(action + ' ' + item);
    
}


function handleInput() {
    if(action !== "") {
        
        //Check if action is available in this location
        if(places[playerLocation][action]) {
            console.log("Action is available.");
            places[playerLocation][action]();
        }
        else {
            console.log("That action is not available here.");
        }
    }
    else {
        console.log("No input was received for handling.");
    }
}

//This function will update the output area after an action is performed
function render() {
    //Display the description of players location if they moved
    if (currentLocation !== playerLocation) {
        look();
    }
}


function look() {
    //Display the description of the player location
    output.innerHTML = places[playerLocation].description + '<br/>';

    //Display the available exits
    if(places[playerLocation].exits) {
        let availableExits = "";
        for (let exit in places[playerLocation].exits) {
            let destination = places[playerLocation].exits[exit];
            availableExits += exit + " to " + places[destination]["alias"] + ", ";
        }
        output.innerHTML += "Exits are " + availableExits + "<br/>";
    }
    
    //Display what items can be seen in the player location
    if (places[playerLocation].items) {
        if (places[playerLocation].items.length !== 0) {
            output.innerHTML += "You can see " + places[playerLocation].items.join(', ') + '<br/>';
        }
    }
    
    //Reset
    action = "";
    item = "";
}

function resolveAction() {
    //Determine if command is a move command
    //Iterate through all the items in the moves array and compare with our action
    if (moves.indexOf(action) !== -1) {
        //It is a move command. Verify if it is an available exit
        let availableExits = [];
        for (let exit in places[playerLocation].exits ) {
            availableExits.push(exit);
        }
        if(availableExits.indexOf(action) !== -1) {
            //set playerLocation to equal the new destination
            console.log(action);
            playerLocation = places[playerLocation].exits[action];
            console.log(playerLocation);
        }
        else {
            output.innerHTML += "That way is blocked.<br/>";
        }  
    }
    
}


function open() {
    if(places[playerLocation].open) {
        
    }
    else {
        //Not available here
    }
}

function take(){
    if(item !== "") {
        //valid item was mentioned in player input
        let foundInInventory = false;
        let foundInRoom = false;

        //First, check if item is already in our existing inventory		
        if(backpack.length !==0) {
            for (let i=0; i < backpack.length; i++) {
                if(item === backpack[i]) {
                    output.innerHTML += "You already have the " + item + ".<br/>";
                    foundInInventory = true;
                    item="";
                    break;
                }
            }
        }

        //Next, if not in the inventory, check the current location
        if(places[playerLocation]['items'].length !== 0 && !foundInInventory) {
            for (let i=0; i < places[playerLocation]['items'].length; i++) {
                if (item === places[playerLocation]['items'][i]) {
                    //item found
                    console.log('item found now checking for space to take');

                    if(backpack.length >=6) {
                        console.log('greater than 6');
                        output.innerHTML = "Your hands are full.";
                        foundInRoom = true;
                    }
                    else {						
                        console.log('item found and can be taken');
                        output.innerHTML = "You take the " + item +".<br/>";

                        //add to inventory
                        backpack.push(places[playerLocation]['items'][i]);

                        //remove item from location
                        places[playerLocation]['items'].splice(i,1);

                        foundInRoom = true;
                    }
                }
            }
        }


        //Finally, if not in inventory or room then report item not found
        if(!foundInRoom && !foundInInventory) {
                console.log('item not found');
                output.innerHTML += "You can't see " + item +".<br/>";
                item="";
        }	

    }
    else {
            //valid item not mentioned in player input
            output.innerHTML += "There is no such item here.<br/>";
            //notUnderstood ();
    }	
}


function drop() {
    if (item !== "") {
        if (backpack.length !== 0) {
            //Check if item is available in the inventory
            for (let i=0; i < backpack.length; i++) {
                if (item === backpack[i]) {
                    //item found
                    output.innerHTML += "You drop the " + item +".<br/>";

                    //add to location
                    places[playerLocation]['items'].push(backpack[i]);

                    //remove item from inventory
                    backpack.splice(i,1);

                }
                else {
                    output.innerHTML += "You haven't got a " + item + ".<br/>";
                    item="";
                }
            }
        }
        else {
            output.innerHTML += "You haven't got a " + item + ".<br/>";
            item="";
        }
    }
    else {
        //valid item not mentioned in player input
        output.innerHTML += "You have no such item.<br/>";
        //notUnderstood ();
    }	
}

function inventory(){
	//Display the player's inventory contents
	if(backpack.length !== 0) {
		let listOfItems = [];
		for(let i=0; i < backpack.length; i++) {
			listOfItems.push(backpack[i][0]);
		}
		output.innerHTML += 'You have ' + listOfItems.join(', ') +'.<br/>';
	
	}
	else {
		output.innerHTML += "You have nothing.<br/>";
	}
}