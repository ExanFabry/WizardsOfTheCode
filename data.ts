import { RootObject, Card } from "./types";

export let cards : Card[] =[];

let getData = async() => {
    try {
        let response = await fetch('https://api.magicthegathering.io/v1/cards');

        if (response.status === 404) throw new Error ('not found')
        if (response.status === 500) throw new Error ('internal server error')

        let data : any = await response.json();
        cards = data.cards;
    }
    catch (e) {
        console.log(e)
    }
}

getData()