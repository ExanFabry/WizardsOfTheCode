import { ObjectId } from "mongodb";

export interface RootObject {
    cards: Card[];
}

export interface Card {
    _id?: ObjectId;
    name: string;
    type: string;
    rarity: string;
    multiverseid?: string;
}

export interface User {
    _id?: ObjectId;
    username: string;
    deck: UserDeck[];
    password?: string;
    role: "ADMIN" | "USER";
}

export interface UserDeck {
    title: string;
    cards: UserCard[];
}

export interface UserCard {
    name: string;
    multiverseid: number;
    numberOfCards: number;
}
