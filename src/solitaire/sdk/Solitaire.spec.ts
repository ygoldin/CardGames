import { Solitaire } from './Solitaire';

test('Initial setup', () => {
    const solitaire = new Solitaire();
    const stockSize = solitaire.getStockSize();
    expect(stockSize).toBe(24);

    const wasteSize = solitaire.getWasteSize();
    expect(wasteSize).toBe(0);

    const foundations = solitaire.getFoundations();
    for (let i = 0; i < Solitaire.FOUNDATION_ORDER.length; i++) {
        expect(foundations[i]).not.toBeDefined();
    }

    const tableau = solitaire.getTableau();
    for (let i = 0; i < Solitaire.TABLEAU_SIZE; i++) {
        const [cards, numVisible] = tableau[i];
        expect(cards.length).toBe(i + 1);
        expect(numVisible).toBe(1);
    }

    const {
        canFlipCard,
        canReturnWaste,
        moveWasteToFoundation,
        moveWasteToTableau,
        tableauMovesFromFoundation,
    } = solitaire.getLegalMoves();
    expect(canFlipCard).toBeTruthy();
    expect(canReturnWaste).toBeFalsy();
    expect(moveWasteToFoundation).not.toBeDefined();
    expect(moveWasteToTableau.length).toBe(0);
    expect(tableauMovesFromFoundation.length).toBe(0);
});
