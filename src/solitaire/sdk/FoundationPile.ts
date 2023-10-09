import { Card, CardSuit, getSuitString } from '../../cards';

export class FoundationPile {
    private cards: Card[];
    private suit: CardSuit;

    constructor(suit: CardSuit) {
        this.cards = [];
        this.suit = suit;
    }

    public canAddCard = (card: Card) => {
        if (card.getSuit() !== this.suit) {
            return false;
        }

        if (this.cards.length === 0) {
            // Can add ace to start the pile
            return card.getValue() === 1;
        } else {
            // Can only add next value card if the pile exists
            const curValue = this.cards[this.cards.length - 1].getValue();
            return card.getValue() === curValue + 1;
        }
    };

    public addCard = (card: Card) => {
        if (!this.canAddCard(card)) {
            const latestCard =
                this.cards.length === 0
                    ? undefined
                    : this.cards[this.cards.length - 1].toString();
            throw new Error(
                `Cannot add ${card.toString()} to ${getSuitString(
                    this.suit
                )} foundation with latest card ${latestCard}`
            );
        }
        this.cards.push(card);
    };

    public getTopCard = (): Card | undefined => {
        if (this.cards.length === 0) {
            return undefined;
        }

        return this.cards[this.cards.length - 1];
    };

    public removeCard = (): Card => {
        if (this.cards.length === 0) {
            throw new Error(`No cards to remove`);
        }

        return this.cards.pop();
    };
}
