import readline from 'readline-sync';

//Declaratie van arrays
let deck : String[] = [];
let drawPile : String[] = [];
let discardPile : String[] = [];

//Voegt kaarten toe (hardcoded: later met een databank.)
for(let i : number = 0; i < 4; i++){
    deck.push("Glorious Citadel");
    deck.push("Radiant Meadow");
    deck.push("Seraphic Sanctuary");
    deck.push("Divine Bastion");
    deck.push("Peaceful Prairie");
    deck.push("Luminous Glade");
    deck.push("Tranquil Valley");
    deck.push("Ethereal Plateau");
    deck.push("Blessed Expanse");
    deck.push("Sacred Promenade");
}
for(let i : number = 0; i < 20; i++){
    deck.push("Plains");
}

//Resets piles
function MakePilesEmpty() : void{
    drawPile.splice(0, drawPile.length);
    discardPile.splice(0, discardPile.length);
}

//Voeg toe aan drawpile
function AddToDrawPileOrDiscardPile(cardArray : string[]) : void{
    let randomNumber : number = Math.floor(Math.random() * cardArray.length);
    drawPile.push(cardArray[randomNumber]);
}

export {}