import express, { Express } from "express";
import { getUserDecks, cards, readCardsFromDeck, getUserDecksFullDeck, getUserDecksWithCards } from "../database";
import { Card, UserCard, UserDeck, User } from "../types";
const app : Express = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

//Declaratie van arrays
// let deck : UserDeck;
let drawPile : UserCard[] = [];
let discardPile : UserCard[] = [];
let result : UserDeck[] | undefined;
//Deck wordt geinitialiseerd in de html.
let deck: UserDeck = {
    title: 'Default Deck',
    cards: [],
    urlBackground: ""
  };
  
/*(async () => {
    try {
        result = await cards();
        //console.log(result);
    } catch (error) {
        console.error(error);
    }
})();
if(result && result?.length > 0){
    result.forEach((card: Card) => {
        deck.push(card);
    });
}*/

//Resets piles
function MakePilesEmpty() : void{
    for(let i = 0; i < drawPile.length; i++){
        deck.cards.push(drawPile[i]);
    }
    for(let i = 0; i < discardPile.length; i++){
        deck.cards.push(discardPile[i]);
    }
    drawPile.splice(0, drawPile.length);
    discardPile.splice(0, discardPile.length);
    /*for(let i = 0; i < deck.cards.length; i++){
        console.log(deck.cards[i]);
    }*/
}

//Voeg toe aan drawpile
function AddToDrawPile() : void{
    // console.log(deck);
    //Er wordt een random kaart gekozen uit deck.
    let randomNumber : number = Math.floor(Math.random() * deck.cards.length); //.cards?.length
    //Dat wordt toegevoegd aan drawpile.
    drawPile.push(deck.cards[randomNumber]);
    //De kaart wordt uit deck gehaald.
    deck.cards.splice(randomNumber, 1);
    // for(let i = 0; i < drawPile.length; i++){
    //     console.log(drawPile[i]);
    // }
}

//Voeg toe aan drawpile
function AddToDiscardPileRandom() : void{
    let randomNumber : number = Math.floor(Math.random() * drawPile.length);
    discardPile.push(drawPile[randomNumber]);
    deck.cards.splice(randomNumber, 1);
    for(let i = 0; i < discardPile.length; i++){
        console.log(discardPile[i]);
    }
}

//Voeg toe aan drawpile
function AddToDiscardPile(image : number) : void{
    discardPile.push(drawPile[image]);
    drawPile.splice(image, 1);
}

function CountingSpecificCard(arrayOfCards : UserCard[]) : { [key: string]: number }{
    //Declareert de variabele counts en ik steek er een lege waarde in.
    let counts : { [key: string]: number } = {};
    //De loop blijft zich herhalen afhankelijk van hoeveel waardes er zitten in arrayOfCards
    for(let i : number = 0; i < arrayOfCards.length; i++){
        //Als de kaart al in counts zit dan gaat de waarde omhoog.
        if(counts.hasOwnProperty(arrayOfCards[i].name)){
            counts[arrayOfCards[i].name]++;
        }
        //Anders is het totale aantal van de kaart 1.
        else{
            counts[arrayOfCards[i].name] = 1;
        }
    }
    return counts;
}

function drawPercentage(deck : UserDeck, card : UserCard) : number{
    let totalCards = 0;
    for(let i : number = 0; i < deck.cards.length; i++){
        if(deck.cards[i].name === card.name){
            totalCards++;
        }
    }
    return totalCards / 100 * deck.cards.length;
}

export function drawTestRouter() {
    const router = express.Router();
    let cardCounts = CountingSpecificCard(discardPile);
    
    router.get("/", async (req, res) => {
        let user : User | undefined = req.session.user;
        let result;
        cardCounts = CountingSpecificCard(discardPile);
        if(user !== undefined){
            result =  await getUserDecksFullDeck(user.username);
            const resultDecks = await getUserDecksFullDeck(user.username);
        }
        // result?.forEach(deck => {
        //     deck.cards.forEach(cards => {
        //         console.log(cards.multiverseid);
        //     });
        // });
        // console.log(resultDecks);
        // result?.forEach(deck => {
        //     console.log(deck);
        //   });
        //console.log(JSON.stringify(result));
        /*for(let i = 0; i < result?.length; i++){
            readCardsFromDeck(req.session.user.name, result[i]);
        }*/
        res.render("drawTest", {
            title: "Draw Test",
            cardImage: drawPile,
            discardPile: discardPile,
            cardImageDiscard: Object.keys(cardCounts),
            numberOfCards: Object.values(cardCounts),
            user: req.session.user?.username,
            decks: result
        })
    });

    router.get("/draw", async (req, res) => {
        console.log(deck);
        //Add to draw pile.
        AddToDrawPile();
        //In cardCounts zitten de kaarten en hoeveel ervan de kaarten in het deck zitten.
        cardCounts = CountingSpecificCard(discardPile);
        //Ik steek de user in de variabele user.
        let user : User | undefined = req.session.user;
        //Ik initialiseer de variabele result.
        let result;
        //Telt hoeveel van dezelfde kaarten in de discard pile zit.
        cardCounts = CountingSpecificCard(discardPile);
        //Als de user niet undefined is.
        if(user !== undefined){
            //Returnt de decks.
            result =  await getUserDecksFullDeck(user.username);
        }
        // //Voor elk deck.
        // result?.forEach(deck => {
        //     //Voor elke kaart.
        //     deck.cards.forEach(cards => {
        //         //Leest de multiverse id van de kaart uit.
        //         console.log(cards.multiverseid);
        //     });
        // });
        // //Leest de draw pile uit.
        // console.log(drawPile);
        res.render("drawTest", {
            //Title is Draw Test
            title: "Draw Test",
            cardImage: drawPile,
            discardPile: discardPile,
            user: req.session.user?.username,
            cardImageDiscard: Object.keys(cardCounts),
            numberOfCards: Object.values(cardCounts),
            decks: result,
            deck: deck
        })
    });

    router.get("/reset", (req, res) => {
        cardCounts = CountingSpecificCard(discardPile);
        MakePilesEmpty(); 
        res.render("drawTest", { 
            title: "Draw Test",
            cardImage: drawPile,
            cardImageDiscard: discardPile
        })
    });

    /*router.get("/selectedDeck", (req, res) => {
        cardCounts = CountingSpecificCard(discardPile);
        MakePilesEmpty(); 
        res.render("drawTest", { 
            title: "Draw Test",
            cardImage: drawPile,
            cardImageDiscard: discardPile
        })
    });*/
    
    router.get("/addToDiscardPile", (req, res) => {
        cardCounts = CountingSpecificCard(discardPile);
        let addToDiscard : number | undefined = Number(req.query.addToDiscard);
        AddToDiscardPile(addToDiscard);
        res.render("drawTest", {
            title: "Draw Test",
            cardImage: drawPile,
            discardPile: discardPile,
            cardImageDiscard: discardPile,
            addToDiscard: addToDiscard
        })
    });
    
    router.get("/selectedDeck", async (req, res) => {
        console.log(deck);
        // const selectedDeckTitle = req.query.selectedDeck as string;
        const selectedDeckTitle = req.query.deckSelect as string;
        //Ik steek de user in de variabele
        let user : User | undefined = req.session.user;
        //Ik initialiseer de variabele allDecks.
        let allDecks;
        //Als de de user niet undefined is.
        if(user !== undefined){
            //Haalt de decks op.
            allDecks = await getUserDecksFullDeck(user.username);
        }
        const selectedDeck = allDecks?.find(deck => deck.title === selectedDeckTitle);
        // console.log(req.query.selectedDeck);
        console.log(selectedDeckTitle);
        if (selectedDeck) {
          deck = selectedDeck;
          MakePilesEmpty(); // Optioneel, als je wilt dat de stapels worden geleegd bij het selecteren van een nieuw deck
          console.log(deck.cards);
        }
    
        cardCounts = CountingSpecificCard(discardPile);
        res.render("drawTest", {
          title: "Draw Test",
          cardImage: drawPile,
          discardPile: discardPile,
          cardImageDiscard: Object.keys(cardCounts),
          numberOfCards: Object.values(cardCounts),
          user: req.session.user?.username,
          decks: allDecks,
          deck: deck
        });
    });
    
    return router;
}