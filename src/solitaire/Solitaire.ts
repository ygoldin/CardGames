import { Card, CardSuit, Deck } from "../cards";
import { FoundationPile } from "./FoundationPile";
import { TableauPile } from "./TableauPile";

export class Solitaire {
    private foundations: FoundationPile[]; // 4 piles at the top
    private tableau: TableauPile[]; // 7 piles in the middle
    private stock: Deck; // Draw pile
    private waste: Deck; // Drawn cards

    public static TABLEAU_SIZE = 7;

    constructor() {
        this.stock = new Deck(true);
        this.stock.shuffle();
        this.waste = new Deck(false);

        const tableauCards: Card[][] = [];
        for (let i = 0; i < Solitaire.TABLEAU_SIZE; i++) {
            const cards: Card[] = [];
            tableauCards.push(cards);
        }
        for (let i = 0; i < Solitaire.TABLEAU_SIZE; i++) {
            for (let j = i; j < Solitaire.TABLEAU_SIZE; j++) {
                tableauCards[j].push(this.stock.getNextCard());
            }
        }
        this.tableau = [];
        for (let i = 0; i < Solitaire.TABLEAU_SIZE; i++) {
            this.tableau.push(new TableauPile(tableauCards[i]));
        }

        this.foundations = [];
        for (const suit of [CardSuit.Hearts, CardSuit.Diamonds, CardSuit.Spades, CardSuit.Clubs]) {
            this.foundations.push(new FoundationPile(suit));
        }
    }
}