"use strict";

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

//Create a variable to store the output to the screen
let outputMessage = "";

//Create an array of allowed commands
let allowedCommands = [
    'north','south','east','west',
    'northwest','northeast','southwest','southeast',
    'up','down','take', 'get', 'drop','examine','look', 'use', 'blow',
    'break','inventory', 'inv', 'in', 'out', 'help',
    'attack', 'open', 'close', 'empty', 'fill', 'give', 'knock', 'light', 
    'listen', 'mend', 'repair', 'fix', 'yes', 'no', 'plant', 'play', 'press', 'pull', 
    'run', 'throw', 'tie', 'wait', 'wave', 'eat', 'drink', 'cut',
    'n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se', 'u', 'd'
];

//Create an array of move commands
let moves = [
    'north','south','east','west',
    'northwest','northeast','southwest','southeast',
    'up','down', 'in', 'out', 'n', 's', 'e', 'w', 
    'nw', 'ne', 'sw', 'se', 'u', 'd'
];

//Create an array of items available within the game
let itemsAvailable = ['fuse', 'powercell', 'passcard', 'helmet'];

//Create a player inventory 
let backpack = {items: {}};
console.log(backpack);
console.log(backpack.items);

//Create location variables
let playerLocation = "";
let currentLocation = "";

//Create an object containing all of our location data
let places = {
    
    "forwardobservation" : {
        "alias" : "the forward observation room",
        "description" : "You are in the forward observation room. From here you can see the direction the ship is heading. It appears to be approaching a large star rather quickly.",
        "items" : { "passcard" : {
                                    "alias" : "a passcard",
                                    "description" : "It's like a credit card with the name Ian Smith printed on it.",
                                    "movable" : true
                                }
        },
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

//Run this function at the start of the game or on restart to reset
function start() {
    //Clear Input Field
    input.value ="";

    //Show Start Message
    output.innerHTML = "Stranded on a spaceship \n\
                        far from spacedock and seemingly, with all the crew missing, you must \n\
                        figure out a way to get yourself home again.</br>\n\
                        Welcome to Abandoned Ship.<br/>\n\
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
    
    validateInput();        //This function will determine our action and item
    resolveAction();
    render();
    reset();
    
    
    
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
    
    //Display the output message
    output.innerHTML = outputMessage;
    
}

function reset() {
    //At the end of every turn, reset the variables
    
    outputMessage = "";
    
    action = "";
    item = "";
    
    //Clear input field again
    input.value ="";
}


function look() {
    //Display the description of the player location
    outputMessage += places[playerLocation].description + '<br/>';
    
    //Display the available exits
    if(places[playerLocation].exits) {
        let availableExits = "";
        for (let exit in places[playerLocation].exits) {
            let destination = places[playerLocation].exits[exit];
            availableExits += exit + " to " + places[destination]["alias"] + ", ";
        }
        outputMessage += "Exits are " + availableExits + "<br/>";
    }
    
    //Display what items can be seen in the player location
    if (Object.keys(places[playerLocation].items).length > 0) {
        let availableItems = "";
        for (let key in places[playerLocation]["items"]) {
            availableItems += places[playerLocation]["items"][key].alias + ", "; 
        }
        
        outputMessage += "You can see " + availableItems + '<br/>';
    }
   
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
            playerLocation = places[playerLocation].exits[action];
            console.log(playerLocation);
        }
        else {
            outputMessage += "That way is blocked.<br/>";
        }  
    }
    
    if(action === "look") {
        look();
    }
    
    if(action === "take" || action === "get") {
        take();
    }
    
    if(action === "drop") {
        drop();
    }
    
    if(action === "inventory" || action === "inv") {
        inventory();
    }
    
    if(action === "examine" || action === "check") {
        examine();
    }
}


function examine() {
    //Check if a known item was selected
    if (item !== "") {
        //valid item was mentioned in player input
        let foundInInventory = false;
        let foundInRoom = false;
        
        //First, check if item is already in our existing inventory
        if (Object.keys(backpack.items).length > 0) {
            //Loop through each item in backpack and see if it matches the item we wish to examine
            for (var key in backpack.items) {
                if(item === key) {
                    outputMessage += backpack.items[key].description;
                    foundInInventory = true;
                    break;
                }
            }
        }
        //Next, if not in the inventory, check the current location
        if (Object.keys(places[playerLocation].items).length > 0 && !foundInInventory) {
            let availableItems = "";
            for (let key in places[playerLocation]["items"]) {
                if(item === key) {
                    outputMessage += backpack.items[key].description;
                    foundInRoom = true;
                    break;
                }
            }
        }
        //Finally, if not in inventory or room then report item not found
        if(!foundInRoom && !foundInInventory) {
                outputMessage += "You can't see " + item +".<br/>";
                item="";
        }
    }
    else {
        //valid item not mentioned in player input
        outputMessage += "There is no such item here.<br/>";
    }
}


function take()  {
    //Check if a known item was selected
    if (item !== "") {
        //valid item was mentioned in player input
        let foundInInventory = false;
        let foundInRoom = false;
        
        //First, check if item is already in our existing inventory
        if (Object.keys(backpack.items).length > 0) {
            //Loop through each item in backpack and see if it matches the item we wish to take
            for (var key in backpack.items) {
                console.log(key);
                if(item === key) {
                    outputMessage += "You already have " + item + ".<br/>";
                    foundInInventory = true;
                    break;
                }
            }
        }
        
        //Next, if not in the inventory, check the current location
        if (Object.keys(places[playerLocation].items).length > 0 && !foundInInventory) {
            let availableItems = "";
            for (let key in places[playerLocation]["items"]) {
                if(item === key) {
                    //Item found now check if there is room in inventory
                    if (Object.keys(backpack.items).length > 6) {
                        outputMessage += "Your hands are full.";
                        foundInRoom = true;
                    }
                    else {
                        //item found and can be taken
                        let currentItem = places[playerLocation]["items"][key]["alias"];
                        
                        //Update message
                        outputMessage += "You take " + currentItem + ".<br/>";
                        
                        //Add item to inventory
                        backpack["items"][key] = places[playerLocation]["items"][key];

                        //Remove item from location
                        delete places[playerLocation]["items"][key];

                        foundInRoom = true;
                    }
                }
            }
        }
        
        //Finally, if not in inventory or room then report item not found
        if(!foundInRoom && !foundInInventory) {
                outputMessage += "You can't see " + item +".<br/>";
                item="";
        }
        
    }
    else {
        //valid item not mentioned in player input
        outputMessage += "There is no such item here.<br/>";
    }	
}


function drop() {
    if (item !== "") {
        if (Object.keys(backpack.items).length > 0) {
            //Check if item is available in the inventory
            for (let key in backpack["items"]) {
                if (item === key) {
                    //item found
                    outputMessage += "You drop the " + item +".<br/>";

                    //add to location
                    places[playerLocation]['items'][key] = backpack["items"][key];

                    //remove item from inventory
                    delete backpack["items"][key];

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
    }	
}

function inventory(){
	//Display the player's inventory 
        if (Object.keys(backpack.items).length > 0) {
            let availableItems = "";
            for (let key in backpack["items"]) {
                availableItems += backpack["items"][key].alias + ", "; 

                outputMessage += 'You have ' + availableItems + '.<br/>';
            }
	}
	else {
            outputMessage += "You have nothing.<br/>";
	}
}