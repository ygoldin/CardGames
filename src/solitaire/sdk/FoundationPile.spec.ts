import { Card, CardSuit } from '../../cards';
import { FoundationPile } from './FoundationPile';

const diamondsAce = new Card(CardSuit.Diamonds, 1);
const clubsAce = new Card(CardSuit.Clubs, 1);
const clubs2 = new Card(CardSuit.Clubs, 2);

test('Can add proper ace to empty foundation', () => {
    const foundation = new FoundationPile(CardSuit.Clubs);
    const canAddClubsAce = foundation.canAddCard(clubsAce);
    expect(canAddClubsAce).toBeTruthy();
    const canAddDiamondsAce = foundation.canAddCard(diamondsAce);
    expect(canAddDiamondsAce).toBeFalsy();
});

test('Can add two to foundation with ace', () => {
    const foundation = new FoundationPile(CardSuit.Clubs);
    foundation.addCard(clubsAce);
    const canAdd2 = foundation.canAddCard(clubs2);
    expect(canAdd2).toBeTruthy();
});

test('Cannot remove card from empty foundation', () => {
    const foundation = new FoundationPile(CardSuit.Clubs);
    expect(() => foundation.removeCard()).toThrow();
});

test('Proper card removed', () => {
    const foundation = new FoundationPile(CardSuit.Clubs);
    foundation.addCard(clubsAce);
    foundation.addCard(clubs2);
    const removedCard = foundation.removeCard();
    expect(removedCard.getValue()).toBe(2);
});

test('Correct top card shown', () => {
    const foundation = new FoundationPile(CardSuit.Clubs);
    let topCard = foundation.getTopCard();
    expect(topCard).not.toBeDefined();

    foundation.addCard(clubsAce);
    topCard = foundation.getTopCard();
    expect(topCard).toBeDefined();
    expect(topCard.getValue()).toBe(1);

    foundation.addCard(clubs2);
    topCard = foundation.getTopCard();
    expect(topCard).toBeDefined();
    expect(topCard.getValue()).toBe(2);

    foundation.removeCard();
    topCard = foundation.getTopCard();
    expect(topCard).toBeDefined();
    expect(topCard.getValue()).toBe(1);
});
