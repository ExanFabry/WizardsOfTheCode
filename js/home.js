const buttonSearchCard = document.getElementById("IndexMainSearchCard");
const inputSearchCard = document.getElementById("cards");

function SearchCard(){
    fetch("https://api.magicthegathering.io/v1/cards")
    .then(function(response){
        return response.json();
    })
    .then(function(response){
        for(let i = 0; i < response.cards.length; i++){
            console.log(response.cards[i].name);
        }
    });
}

buttonSearchCard.addEventListener("click", SearchCard, false);