let selectedDeck = document.getElementById("deckSelect");

function ErrorDecks(){
    event.preventDefault();
    console.log(selectedDeck.value);
    if(selectedDeck.value === "chooseADeck"){
        selectedDeck.style.color = "red";
        selectedDeck.style.borderColor = "red";
    }
    else{
        selectedDeck.style.color = "white";
        selectedDeck.style.borderColor = "white";
    }
}

document.getElementById("draw").addEventListener("click", ErrorDecks);
document.getElementById("reset").addEventListener("click", ErrorDecks);