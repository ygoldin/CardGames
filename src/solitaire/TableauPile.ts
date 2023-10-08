import { Card } from "../cards";

export class TableauPile {
    private cards: Card[];
    private numVisible: number;

    constructor(cards: Card[]) {
        this.cards = cards;
        this.numVisible = 1;
    }

    public addCards = (cards: Card[]) => {
        if (cards.length === 0) {
            throw new Error('Cannot add 0 cards');
        }

        if (this.numVisible >= 1) {
            // Check that this stack can go ontop of the existing pile
            const finalVisibleCard = this.cards[this.cards.length - 1];
            const firstNewCard = cards[0];
            if (!this.canBeStacked(finalVisibleCard, firstNewCard)) {
                throw new Error('Cannot stack new cards onto this pile');
            }
        } else {
            // Top card must be king
            const topCard = cards[0];
            if (topCard.getValue() !== 13) {
                throw new Error('Only kings can be stacked onto empty tableau piles');
            }
        }

        // Check that the stack is valid
        for (let i = 0; i < cards.length - 1; i++) {
            const topCard = cards[i];
            const bottomCard = cards[i+1];
            if (!this.canBeStacked(topCard, bottomCard)) {
                throw new Error('Given stack is invalid');
            }
        }

        for (const card of cards) {
            this.cards.push(card);
        }
        this.numVisible += cards.length;
    };

    public removeNCards = (n: number): Card[] => {
        if (this.numVisible < n) {
            throw new Error(`Cannot remove more than ${this.numVisible} cards`);
        }

        const removedCards: Card[] = [];
        for (let i = 0; i < n; i++) {
            removedCards.push(this.cards.pop());
        }

        this.numVisible -= n;
        if (this.numVisible === 0 && this.cards.length > 0) {
            // Flip over one card
            this.numVisible = 1;
        }

        // Reverse them so that the first card in the array is the one with the highest value
        return removedCards.reverse();
    }

    private canBeStacked(topCard: Card, bottomCard: Card): boolean {
        return topCard.getValue() === bottomCard.getValue() + 1 && topCard.getColor() !== bottomCard.getColor();
    }
}