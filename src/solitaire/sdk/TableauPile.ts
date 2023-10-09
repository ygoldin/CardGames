import { Card } from '../../cards';

export class TableauPile {
    private cards: Card[];
    private numVisible: number;

    constructor(cards: Card[]) {
        if (cards.length === 0) {
            throw new Error('Tableau piles need to start with at least one card');
        }
        this.cards = cards;
        this.numVisible = 1;
    }

    public canAddCards = (cards: Card[]): boolean => {
        if (cards.length === 0) {
            return false;
        }

        if (this.numVisible >= 1) {
            // Check that this stack can go ontop of the existing pile
            const finalVisibleCard = this.cards[this.cards.length - 1];
            const firstNewCard = cards[0];
            if (!this.canBeStacked(finalVisibleCard, firstNewCard)) {
                return false;
            }
        } else {
            // Top card must be king
            const topCard = cards[0];
            if (topCard.getValue() !== 13) {
                return false;
            }
        }

        // Check that the stack is valid
        for (let i = 0; i < cards.length - 1; i++) {
            const topCard = cards[i];
            const bottomCard = cards[i + 1];
            if (!this.canBeStacked(topCard, bottomCard)) {
                return false;
            }
        }

        return true;
    };

    public addCards = (cards: Card[]) => {
        if (!this.canAddCards(cards)) {
            throw new Error('Cannot add these cards');
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
    };

    private canBeStacked = (topCard: Card, bottomCard: Card): boolean => {
        return (
            topCard.getValue() === bottomCard.getValue() + 1 &&
            topCard.getColor() !== bottomCard.getColor()
        );
    };

    public getNumCards = () => this.cards.length;

    public getNumVisibleCards = () => this.numVisible;

    public getCards = () => this.cards as Readonly<Card[]>;
}
