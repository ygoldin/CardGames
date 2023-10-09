export type FoundationTableauMove = Readonly<{
    tableauIndex: number;
    foundationIndex: number;
}>;

export type InterTableauMove = Readonly<{
    tableauPileStartIndex: number;
    tableauPileEndIndex: number;
    numCards: number;
}>;
