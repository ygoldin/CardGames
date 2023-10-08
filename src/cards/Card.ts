export enum CardSuit {
    Hearts,
    Diamonds,
    Spades,
    Clubs,
}

export enum CardColor {
    Red,
    Black,
}

export class Card {
    private color: CardColor;
    private suit: CardSuit;
    private value: number;

    constructor(suit: CardSuit, value: number) {
        if (value <= 0 || value >= 14) {
            throw new Error(
                `Value must be between 1 and 13, received ${value}`
            );
        }
        this.color =
            suit === CardSuit.Hearts || suit === CardSuit.Diamonds
                ? CardColor.Red
                : CardColor.Black;
        this.suit = suit;
        this.value = value;
    }

    public getColor = (): CardColor => this.color;

    public getSuit = (): CardSuit => this.suit;

    public getValue = (): number => this.value;

    public toString = (): string => {
        const suitString = this.getSuitStringRepresentation();
        if (!suitString) {
            throw new Error('Undefined suit');
        }
        if (this.value === 1) {
            return 'Ace' + suitString;
        } else if (this.value >= 2 && this.value <= 10) {
            return this.value.toString() + suitString;
        } else if (this.value === 11) {
            return 'Jack' + suitString;
        } else if (this.value === 12) {
            return 'Queen' + suitString;
        } else {
            return 'King' + suitString;
        }
    };

    private getSuitStringRepresentation = (): string | undefined => {
        switch (this.suit) {
            case CardSuit.Clubs:
                return '♣';
            case CardSuit.Diamonds:
                return '♦';
            case CardSuit.Hearts:
                return '♥';
            case CardSuit.Spades:
                return '♠';
            default:
                return undefined;
        }
    };
}
