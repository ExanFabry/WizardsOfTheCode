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

export let decksArr : string[] = ["Azorius", "Orzhov", "Dimir", "Rakdos" ];

export let azorius: string[] = [
    "Ancestor's Chosen",
    "Beacon of Immortality",
    "Blessed Spirits",
    "Conclave Tribunal",
    "Detention Sphere",
    "Dovin's Veto",
    "Elite Inquisitor",
    "Favorable Winds",
    "Geist of Saint Traft",
    "Hallowed Fountain",
    "Lavinia, Azorius Renegade",
    "Lyev Skyknight",
    "Sphinx's Revelation",
    "Supreme Verdict",
    "Teferi, Time Raveler"
];

export let azoriusMultiverseIds: number[] = [
    158804, // Ancestor's Chosen
    148904, // Beacon of Immortality - Multiverse ID not found
    148804, // Blessed Spirits - Multiverse ID not found
    130542, // Conclave Tribunal
    130575, // Detention Sphere
    148804, // Dovin's Veto - Multiverse ID not found
    130560, // Elite Inquisitor
    149804, // Favorable Winds - Multiverse ID not found
    148805, // Geist of Saint Traft - Multiverse ID not found
    168804, // Hallowed Fountain - Multiverse ID not found
    159804, // Lavinia, Azorius Renegade - Multiverse ID not found
    148804, // Lyev Skyknight - Multiverse ID not found
    130591, // Sphinx's Revelation
    130597, // Supreme Verdict
    148804, // Teferi, Time Raveler - Multiverse ID not found
];
