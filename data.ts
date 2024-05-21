import { RootObject, Card } from "./types";

export let cards : Card[] =[];

let getData = async () => {
    try {
        let currentPage = 1;

        let uniqueCardNames = new Set<string>();

        // Fetch data until we receive an empty response
        while (true) {
            let response = await fetch(`https://api.magicthegathering.io/v1/cards?page=${currentPage}&pageSize=100`);

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
            }

            let data: any = await response.json();

            // If no cards are returned, break the loop
            if (data.cards.length === 0) {
                break;
            }

            data.cards.forEach((card: Card) => {
                if (!uniqueCardNames.has(card.name)) {
                    cards.push(card);
                    uniqueCardNames.add(card.name);
                }
            });
            currentPage++;
        }
    } catch (e) {
        console.error(e);
    }
};

getData();
