import { Card, CardSuit, Deck, getSuitString } from '../../cards';
import { FoundationPile } from './FoundationPile';
import { FoundationTableauMove, InterTableauMove } from './Move';
import { TableauPile } from './TableauPile';

export class Solitaire {
    private foundations: FoundationPile[]; // 4 piles at the top
    private tableau: TableauPile[]; // 7 piles in the middle
    private stock: Card[]; // Draw pile
    private waste: Card[]; // Drawn cards
    // All legal moves
    private canFlipCard: boolean; // Whether or not we can flip a card from the stock to the waste
    private canReturnWaste: boolean; // Whether or not we can return all of the cards from the waste back to the stock
    private moveWasteToFoundation?: number; // The index of which foundation we can move the top waste card to, or undefined
    private moveWasteToTableau: number[]; // The indeces of which tableau piles we can move the top waste card to
    private foundationMovesFromTableau: FoundationTableauMove[]; // Which cards can move from the tableau to a foundation
    private interTableauMoves: InterTableauMove[]; // Which cards can move between tableau piles
    private tableauMovesFromFoundation: FoundationTableauMove[]; // Which cards can move from the foundation to the tableau

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
        const numDeckCards = deck.getNumCards();
        for (let i = 0; i < numDeckCards; i++) {
            this.stock.push(deck.getNextCard());
        }

        this.waste = [];
        this.calculateLegalMoves();
    }

    public getLegalMoves = () => ({
        canFlipCard: this.canFlipCard,
        canReturnWaste: this.canReturnWaste,
        moveWasteToFoundation: this.moveWasteToFoundation,
        moveWasteToTableau: this.moveWasteToTableau,
        foundationMovesFromTableau: this.foundationMovesFromTableau,
        interTableauMoves: this.interTableauMoves,
        tableauMovesFromFoundation: this.tableauMovesFromFoundation,
    });

    public flipCard = (): void => {
        if (!this.canFlipCard) {
            throw new Error('Cannot flip card from stock');
        }

        this.waste.push(this.stock.pop());
        this.calculateLegalMoves();
    };

    public returnWaste = (): void => {
        if (!this.canReturnWaste) {
            throw new Error('Cannot return waste');
        }

        const wasteSize = this.waste.length;
        for (let i = 0; i < wasteSize; i++) {
            this.stock.push(this.waste.pop());
        }
        this.calculateLegalMoves();
    };

    public moveWasteToFoundationPile = (foundationIndex: number): void => {
        if (this.moveWasteToFoundation !== foundationIndex) {
            throw new Error(
                `Cannot move waste card to ${getSuitString(
                    Solitaire.FOUNDATION_ORDER[foundationIndex]
                )} foundation`
            );
        }

        const foundation = this.foundations[foundationIndex];
        foundation.addCard(this.waste.pop());
        this.calculateLegalMoves();
    };

    public moveWasteToTableauPile = (tableauIndex: number): void => {
        if (!this.moveWasteToTableau.includes(tableauIndex)) {
            throw new Error(
                `Cannot move waste card to tableau pile ${tableauIndex}`
            );
        }

        const tableauPile = this.tableau[tableauIndex];
        tableauPile.addCards([this.waste.pop()]);
        this.calculateLegalMoves();
    };

    public moveToFoundationFromTableau = (
        tableauIndex: number,
        foundationIndex: number
    ): void => {
        if (
            !this.foundationMovesFromTableau.find(
                (move: FoundationTableauMove) =>
                    move.tableauIndex === tableauIndex &&
                    move.foundationIndex === foundationIndex
            )
        ) {
            throw new Error(
                `Cannot move card from tableau pile ${tableauIndex} to foundation ${foundationIndex}`
            );
        }

        const tableauPile = this.tableau[tableauIndex];
        const topTableauCardList = tableauPile.removeNCards(1);
        if (topTableauCardList.length !== 1) {
            throw new Error('Should have only removed one card');
        }

        const foundation = this.foundations[foundationIndex];
        foundation.addCard(topTableauCardList[0]);
        this.calculateLegalMoves();
    };

    public moveWithinTableau = (
        tableauPileStartIndex: number,
        tableauPileEndIndex: number,
        numCards: number
    ): void => {
        if (
            !this.interTableauMoves.find(
                (move: InterTableauMove) =>
                    move.tableauPileStartIndex === tableauPileStartIndex &&
                    move.tableauPileEndIndex === tableauPileEndIndex &&
                    move.numCards === numCards
            )
        ) {
            throw new Error(
                `Cannot move ${numCards} cards from tableau pile ${tableauPileStartIndex} to tableau pile ${tableauPileEndIndex}`
            );
        }

        const tableauPileStart = this.tableau[tableauPileStartIndex];
        const tableauPileEnd = this.tableau[tableauPileEndIndex];
        tableauPileEnd.addCards(tableauPileStart.removeNCards(numCards));
        this.calculateLegalMoves();
    };

    public moveToTableauFromFoundation = (
        tableauIndex: number,
        foundationIndex: number
    ): void => {
        if (
            !this.tableauMovesFromFoundation.find(
                (move: FoundationTableauMove) =>
                    move.tableauIndex === tableauIndex &&
                    move.foundationIndex === foundationIndex
            )
        ) {
            throw new Error(
                `Cannot move card from foundation ${foundationIndex} to tableau pile ${tableauIndex}`
            );
        }

        const tableauPile = this.tableau[tableauIndex];
        const foundation = this.foundations[foundationIndex];
        tableauPile.addCards([foundation.removeCard()]);
        this.calculateLegalMoves();
    };

    public getStockSize = (): number => this.stock.length;

    public getWasteSize = (): number => this.waste.length;

    public getFoundations = (): Array<Card | undefined> =>
        this.foundations.map((foundation: FoundationPile) =>
            foundation.getTopCard()
        );

    public getTableau = (): Readonly<(readonly [readonly Card[], number])[]> =>
        this.tableau.map(
            (tableauPile: TableauPile) =>
                [
                    tableauPile.getCards(),
                    tableauPile.getNumVisibleCards(),
                ] as const
        );

    private calculateLegalMoves = (): void => {
        this.canFlipCard = false;
        this.canReturnWaste = false;
        this.moveWasteToFoundation = undefined;
        this.moveWasteToTableau = [];
        this.foundationMovesFromTableau = [];
        this.interTableauMoves = [];
        this.tableauMovesFromFoundation = [];

        // Flip a card from the stock to the waste
        if (this.stock.length > 0) {
            this.canFlipCard = true;
        }

        // Return all of the cards from the waste to the stock
        if (this.stock.length === 0 && this.waste.length > 0) {
            this.canReturnWaste = true;
        }

        if (this.waste.length > 0) {
            const wasteCard = this.waste[this.waste.length - 1];

            // Move a card from the waste to a foundation
            const appropriateFoundationIndex =
                Solitaire.FOUNDATION_ORDER.indexOf(wasteCard.getSuit());
            if (
                appropriateFoundationIndex &&
                this.foundations[appropriateFoundationIndex].canAddCard(
                    wasteCard
                )
            ) {
                this.moveWasteToFoundation = appropriateFoundationIndex;
            }

            // Move a card from the waste to a tableau pile
            const tableauCards = [wasteCard];
            for (
                let tableauIndex = 0;
                tableauIndex < Solitaire.TABLEAU_SIZE;
                tableauIndex++
            ) {
                const tableauPile = this.tableau[tableauIndex];
                if (tableauPile.canAddCards(tableauCards)) {
                    this.moveWasteToTableau.push(tableauIndex);
                }
            }
        }

        // Move cards between tableau piles or from a tableau pile to a foundation
        for (
            let tableauIndex = 0;
            tableauIndex < Solitaire.TABLEAU_SIZE;
            tableauIndex++
        ) {
            const tableauPile = this.tableau[tableauIndex];
            if (tableauPile.getNumVisibleCards() > 0) {
                const tableauCards = tableauPile.getCards();

                // Move last card to foundation
                const lastCard = tableauCards[tableauCards.length - 1];
                const appropriateFoundationIndex =
                    Solitaire.FOUNDATION_ORDER.indexOf(lastCard.getSuit());
                if (
                    appropriateFoundationIndex &&
                    this.foundations[appropriateFoundationIndex].canAddCard(
                        lastCard
                    )
                ) {
                    const newMove: FoundationTableauMove = {
                        foundationIndex: appropriateFoundationIndex,
                        tableauIndex,
                    };
                    this.foundationMovesFromTableau.push(newMove);
                }

                // Move any number of cards to another tableau pile
                for (
                    let numCards = 1;
                    numCards <= tableauPile.getNumVisibleCards();
                    numCards++
                ) {
                    const movedCards = tableauCards.slice(
                        tableauCards.length - numCards
                    );
                    for (
                        let otherTableauIndex = 0;
                        otherTableauIndex < Solitaire.TABLEAU_SIZE;
                        otherTableauIndex++
                    ) {
                        if (otherTableauIndex !== tableauIndex) {
                            const otherTableauPile =
                                this.tableau[otherTableauIndex];
                            if (otherTableauPile.canAddCards(movedCards)) {
                                const newMove: InterTableauMove = {
                                    tableauPileStartIndex: tableauIndex,
                                    tableauPileEndIndex: otherTableauIndex,
                                    numCards,
                                };
                                this.interTableauMoves.push(newMove);
                            }
                        }
                    }
                }
            }
        }

        // Move cards from the foundation to the tableau
        for (
            let foundationIndex = 0;
            foundationIndex < Solitaire.FOUNDATION_ORDER.length;
            foundationIndex++
        ) {
            const foundation = this.foundations[foundationIndex];
            const topCard = foundation.getTopCard();
            if (topCard) {
                const topCardList = [topCard];
                for (
                    let tableauIndex = 0;
                    tableauIndex < Solitaire.TABLEAU_SIZE;
                    tableauIndex++
                ) {
                    const tableauPile = this.tableau[tableauIndex];
                    if (tableauPile.canAddCards(topCardList)) {
                        const newMove: FoundationTableauMove = {
                            foundationIndex,
                            tableauIndex,
                        };
                        this.tableauMovesFromFoundation.push(newMove);
                    }
                }
            }
        }
    };
}
