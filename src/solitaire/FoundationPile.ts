import { Card, CardSuit, getSuitString } from "../cards";

export class FoundationPile {
    private cards: Card[];
    private suit: CardSuit;

    constructor(suit: CardSuit) {
        this.cards = [];
        this.suit = suit;
    }

    public addCard = (card: Card) => {
        if (card.getSuit() !== this.suit) {
            throw new Error(`Only ${getSuitString(this.suit)} cards allowed`);
        }
        this.cards.push(card);
    };

    public removeCard = (): Card => {
        if (this.cards.length === 0) {
            throw new Error(`No cards to remove`);
        }

        return this.cards.pop();
    }
}