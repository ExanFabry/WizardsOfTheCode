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
