import express from "express";

//Declaratie van arrays
let deck : string[] = [];
let drawPile : string[] = [];
let discardPile : string[] = ["https://c1.scryfall.com/file/scryfall-cards/large/front/0/2/023d333b-14f2-40ad-bb76-8b9e38040f89.jpg?1562730596", "https://c1.scryfall.com/file/scryfall-cards/large/front/0/2/023d333b-14f2-40ad-bb76-8b9e38040f89.jpg?1562730596"];  

//Links
let plains : string = "https://c1.scryfall.com/file/scryfall-cards/large/front/0/2/023d333b-14f2-40ad-bb76-8b9e38040f89.jpg?1562730596";
let gloriousEnforcer : string = "https://cards.scryfall.io/large/front/d/e/de1365aa-e814-471b-8c9e-cf4c5011bcc3.jpg?1626093563";
let radiantDestiny : string = "https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_700/MTc0NDYxMDYyMzQyNTE4NDA2/best-subtype-supports-mtg.jpg";
let purity : string = "https://images.saymedia-content.com/.image/t_share/MTc0NDYxMTE2MDI4ODg4NDI0/best-incarnations-mtg.jpg";
let divineVisitation : string = "https://i.pinimg.com/originals/f7/ed/ab/f7edabca95f66a01aa9eb5a8ba31cd10.jpg";
let paradoxEngine : string = "https://images.saymedia-content.com/.image/t_share/MTc0NDYwODc3NjU4MjAzNDk2/best-mtg-legendary-artifacts.jpg";
let dawnCharm : string = "https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_700/MTc0NDYxMTkwMzg2MDM0MDI0/best-fog-spells-mtg.jpg";
let semblanceAnvil : string = "https://i.pinimg.com/736x/54/8d/8c/548d8c2c0518b449f7fdcf6e8a50868d.jpg";
let etherealArmor : string = "https://cards.scryfall.io/large/front/d/4/d4cc231e-7b86-4b64-a1d6-75aea64b85a0.jpg?1675536322";
let jeweledLotus : string = "https://i.etsystatic.com/21187825/r/il/629e44/2642151542/il_1588xN.2642151542_mdun.jpg";
let chromaticLantern : string = "https://images.saymedia-content.com/.image/t_share/MTc0NDIxMjg2NjQ5MzQxMjg4/ten-artifacts-for-any-magic-the-gathering-deck.jpg";

//Voegt kaarten toe (hardcoded: later met een databank.)
for(let i : number = 0; i < 4; i++){
    deck.push(gloriousEnforcer);
    deck.push(radiantDestiny);
    deck.push(purity);
    deck.push(divineVisitation);
    deck.push(paradoxEngine);
    deck.push(dawnCharm);
    deck.push(semblanceAnvil);
    deck.push(etherealArmor);
    deck.push(jeweledLotus);
    deck.push(chromaticLantern);
}
for(let i : number = 0; i < 20; i++){
    deck.push(plains);
}

//Resets piles
function MakePilesEmpty() : void{
    for(let i = 0; i < drawPile.length; i++){
        deck.push(drawPile[i]);
    }
    for(let i = 0; i < discardPile.length; i++){
        deck.push(discardPile[i]);
    }
    drawPile.splice(0, drawPile.length);
    discardPile.splice(0, discardPile.length);
    for(let i = 0; i < deck.length; i++){
        console.log(deck[i]);
    }
}

//Voeg toe aan drawpile
function AddToDrawPile() : void{
    console.log("hallo");
    let randomNumber : number = Math.floor(Math.random() * deck.length);
    drawPile.push(deck[randomNumber]);
    deck.splice(randomNumber, 1);
    for(let i = 0; i < drawPile.length; i++){
        console.log(drawPile[i]);
    }
}

//Voeg toe aan drawpile
function AddToDiscardPileRandom() : void{
    let randomNumber : number = Math.floor(Math.random() * drawPile.length);
    discardPile.push(drawPile[randomNumber]);
    deck.splice(randomNumber, 1);
    for(let i = 0; i < discardPile.length; i++){
        console.log(discardPile[i]);
    }
}

//Voeg toe aan drawpile
function AddToDiscardPile(image : number) : void{
    discardPile.push(drawPile[image]);
    drawPile.splice(image, 1);
}

function CountingSpecificCard(arrayOfCards : string[]) : { [key: string]: number }{
    let counts : { [key: string]: number } = {};
    for(let i : number = 0; i < arrayOfCards.length; i++){
        if(counts.hasOwnProperty(arrayOfCards[i])){
            counts[arrayOfCards[i]]++;
        }
        else{
            counts[arrayOfCards[i]] = 1;
        }
    }
    return counts;
}

export function drawTestRouter() {
    const router = express.Router();
    let cardCounts = CountingSpecificCard(discardPile);

    router.get("/", (req, res) => {
        cardCounts = CountingSpecificCard(discardPile);
        res.render("drawTest", {
            title: "Draw Test",
            cardImage: drawPile,
            discardPile: discardPile,
            cardImageDiscard: Object.keys(cardCounts),
            numberOfCards: Object.values(cardCounts),
        })
    });

    router.get("/draw", (req, res) => {
        AddToDrawPile();
        cardCounts = CountingSpecificCard(discardPile);
        res.render("drawTest", {
            title: "Draw Test",
            cardImage: drawPile,
            discardPile: discardPile,
            cardImageDiscard: Object.keys(cardCounts),
            numberOfCards: Object.values(cardCounts)
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

    router.get("/selectedDeck", (req, res) => {
        cardCounts = CountingSpecificCard(discardPile);
        MakePilesEmpty(); 
        res.render("drawTest", { 
            title: "Draw Test",
            cardImage: drawPile,
            cardImageDiscard: discardPile
        })
    });
    
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
    
    return router;
}