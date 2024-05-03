function ErrorDecks(){
    let selectedDeck = document.getElementById("deckSelect");
    if(selectedDeck.value === "chooseADeck"){
        event.preventDefault();
        selectedDeck.style.color = "red";
        selectedDeck.style.borderColor = "red";
    }
    else{
        selectedDeck.style.color = "white";
        selectedDeck.style.borderColor = "white";
    }
}

document.getElementById("draw").addEventListener("click", ErrorDecks, false);
document.getElementById("reset").addEventListener("click", ErrorDecks, false);