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
});
