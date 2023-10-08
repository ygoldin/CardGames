import { Card } from './Card';
import { CardSuit } from './CardSuit';

export class Deck {
    private cards: Card[];

    constructor(addAllCards: boolean) {
        this.cards = [];
        if (addAllCards) {
            for (let value = 1; value <= 13; value++) {
                for (const suit of [
                    CardSuit.Clubs,
                    CardSuit.Diamonds,
                    CardSuit.Hearts,
                    CardSuit.Spades,
                ]) {
                    this.cards.push(new Card(suit, value));
                }
            }
        }
    }

    public shuffle = (): void => {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    };

    public toString = (): string[] => {
        const result: string[] = [];
        for (const card of this.cards) {
            result.push(card.toString());
        }

        return result;
    };

    public getNextCard = (): Card => {
        if (this.cards.length === 0) {
            throw new Error('No cards left');
        }

        return this.cards.pop();
    };

    public addCards = (cards: Card[]): void => {
        for (const card of cards) {
            this.cards.push(card);
        }
    };
}
