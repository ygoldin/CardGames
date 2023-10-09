import { Card, CardSuit } from '../../cards';
import { TableauPile } from './TableauPile';

const diamonds3 = new Card(CardSuit.Diamonds, 3);
const clubs4 = new Card(CardSuit.Clubs, 4);
const hearts5 = new Card(CardSuit.Hearts, 5);
const spadesKing = new Card(CardSuit.Spades, 13);

test('Can remove top card and add king to empty pile', () => {
    const tableau = new TableauPile([clubs4]);
    tableau.removeNCards(1);
    const canAddKing = tableau.canAddCards([spadesKing]);
    expect(canAddKing).toBeTruthy();
});

test('Can add 3 of diamonds to pile with 4 of clubs', () => {
    const tableau = new TableauPile([clubs4]);
    const canAdd3Diamonds = tableau.canAddCards([diamonds3]);
    expect(canAdd3Diamonds).toBeTruthy();
});

test('Cannot add 3 of diamonds to pile with 5 of hearts', () => {
    const tableau = new TableauPile([hearts5]);
    const canAdd3Diamonds = tableau.canAddCards([diamonds3]);
    expect(canAdd3Diamonds).toBeFalsy();
});

test('Can add 3 of diamonds/4 of clubs to 5 of hearts', () => {
    const tableau = new TableauPile([hearts5]);
    expect(tableau.getNumVisibleCards()).toBe(1);
    const canAddBothCards = tableau.canAddCards([clubs4, diamonds3]);
    expect(canAddBothCards).toBeTruthy();
    tableau.addCards([clubs4, diamonds3]);
    expect(tableau.getNumVisibleCards()).toBe(3);
});

test('Cannot add 3 of diamonds/king of spades to 5 of hearts', () => {
    const tableau = new TableauPile([hearts5]);
    const canAddBothCards = tableau.canAddCards([spadesKing, diamonds3]);
    expect(canAddBothCards).toBeFalsy();
});

test('Cannot remove more cards than exist', () => {
    const tableau = new TableauPile([hearts5]);
    expect(() => tableau.removeNCards(2)).toThrow();
});

test('Cannot remove more cards than are visible', () => {
    const tableau = new TableauPile([hearts5, clubs4]);
    expect(() => tableau.removeNCards(2)).toThrow();
});

test('Can remove visible cards', () => {
    const tableau = new TableauPile([hearts5]);
    tableau.addCards([clubs4]);
    const removedCards = tableau.removeNCards(2);
    expect(removedCards.length).toBe(2);
    expect(removedCards[0].getValue()).toBe(5);
    expect(removedCards[1].getValue()).toBe(4);
});
