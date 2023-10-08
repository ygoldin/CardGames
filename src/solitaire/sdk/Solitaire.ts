import { Card, CardSuit, Deck } from '../../cards';
import { FoundationPile } from './FoundationPile';
import { TableauPile } from './TableauPile';

export class Solitaire {
    private foundations: FoundationPile[]; // 4 piles at the top
    private tableau: TableauPile[]; // 7 piles in the middle
    private stock: Card[]; // Draw pile
    private waste: Card[]; // Drawn cards

    public static TABLEAU_SIZE = 7;
    public static FOUNDATION_ORDER = [
        CardSuit.Hearts,
        CardSuit.Diamonds,
        CardSuit.Spades,
        CardSuit.Clubs,
    ];

    constructor() {
        const deck = new Deck();
        deck.shuffle();

        const tableauCards: Card[][] = [];
        for (let i = 0; i < Solitaire.TABLEAU_SIZE; i++) {
            const cards: Card[] = [];
            tableauCards.push(cards);
        }
        for (let i = 0; i < Solitaire.TABLEAU_SIZE; i++) {
            for (let j = i; j < Solitaire.TABLEAU_SIZE; j++) {
                tableauCards[j].push(deck.getNextCard());
            }
        }
        this.tableau = [];
        for (let i = 0; i < Solitaire.TABLEAU_SIZE; i++) {
            this.tableau.push(new TableauPile(tableauCards[i]));
        }

        this.foundations = [];
        for (const suit of Solitaire.FOUNDATION_ORDER) {
            this.foundations.push(new FoundationPile(suit));
        }

        this.stock = [];
        for (let i = 0; i < deck.getNumCards(); i++) {
            this.stock.push(deck.getNextCard());
        }

        this.waste = [];
    }

    public moveNCards(
        tableauPileStartIndex: number,
        tableauPileEndIndex: number,
        numCards: number
    ) {
        if (
            tableauPileStartIndex < 0 ||
            tableauPileEndIndex >= Solitaire.TABLEAU_SIZE ||
            tableauPileEndIndex < 0 ||
            tableauPileEndIndex >= Solitaire.TABLEAU_SIZE ||
            tableauPileStartIndex === tableauPileEndIndex
        ) {
            throw new Error('Cannot move between these two piles');
        }

        const tableauPileStart = this.tableau[tableauPileStartIndex];
        const tableauPileEnd = this.tableau[tableauPileEndIndex];

        if (tableauPileStart.getNumVisibleCards() < numCards) {
            throw new Error('Not enough cards to move');
        }
    }
}
