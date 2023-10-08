export enum CardSuit {
    Hearts,
    Diamonds,
    Spades,
    Clubs,
}

export const getSuitString = (suit: CardSuit): string | undefined => {
    switch (suit) {
        case CardSuit.Clubs:
            return '♣';
        case CardSuit.Diamonds:
            return '♦';
        case CardSuit.Hearts:
            return '♥';
        case CardSuit.Spades:
            return '♠';
        default:
            return undefined;
    }
}