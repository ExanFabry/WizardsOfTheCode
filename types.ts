export interface RootObject {
    cards: Card[];
}

export interface Card {
    name:          string;
    manaCost:      string;
    cmc:           number;
    colors:        Color[];
    colorIdentity: Color[];
    type:          string;
    types:         Type[];
    subtypes?:     string[];
    rarity:        Rarity;
    set:           Set;
    setName:       SetName;
    text:          string;
    artist:        string;
    number:        string;
    power?:        string;
    toughness?:    string;
    layout:        Layout;
    multiverseid?: string;
    imageUrl?:     string;
    variations?:   string[];
    foreignNames?: ForeignName[];
    printings:     string[];
    originalText?: string;
    originalType?: string;
    legalities:    LegalityElement[];
    id:            string;
    flavor?:       string;
    rulings?:      Ruling[];
    supertypes?:   string[];
}

export enum Color {
    U = "U",
    W = "W",
}

export interface ForeignName {
    name:         string;
    text:         string;
    type:         string;
    flavor:       null | string;
    imageUrl:     string;
    language:     Language;
    multiverseid: number;
}

export enum Language {
    ChineseSimplified = "Chinese Simplified",
    French = "French",
    German = "German",
    Italian = "Italian",
    Japanese = "Japanese",
    PortugueseBrazil = "Portuguese (Brazil)",
    Russian = "Russian",
    Spanish = "Spanish",
}

export enum Layout {
    Normal = "normal",
}

export interface LegalityElement {
    format:   Format;
    legality: LegalityEnum;
}

export enum Format {
    Alchemy = "Alchemy",
    Commander = "Commander",
    Duel = "Duel",
    Explorer = "Explorer",
    Gladiator = "Gladiator",
    Historic = "Historic",
    Historicbrawl = "Historicbrawl",
    Legacy = "Legacy",
    Modern = "Modern",
    Oathbreaker = "Oathbreaker",
    Pauper = "Pauper",
    Paupercommander = "Paupercommander",
    Penny = "Penny",
    Pioneer = "Pioneer",
    Predh = "Predh",
    Premodern = "Premodern",
    Vintage = "Vintage",
}

export enum LegalityEnum {
    Legal = "Legal",
    Restricted = "Restricted",
}

export enum Rarity {
    Common = "Common",
    Rare = "Rare",
    Uncommon = "Uncommon",
}

export interface Ruling {
    date: Date;
    text: string;
}

export enum Set {
    The10E = "10E",
}

export enum SetName {
    TenthEdition = "Tenth Edition",
}

export enum Type {
    Creature = "Creature",
    Enchantment = "Enchantment",
    Instant = "Instant",
    Sorcery = "Sorcery",
}
