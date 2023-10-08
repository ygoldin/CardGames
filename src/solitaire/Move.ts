export type ValidMove =
    | FoundationMoveFromTableau
    | FoundationMoveFromWaste
    | InterTableauMove
    | TableauMoveFromWaste
    | FlipCard;

export type FoundationMoveFromTableau = Readonly<{
    tableauPileIndex: number;
}>;

export type FoundationMoveFromWaste = Readonly<{}>;

export type InterTableauMove = Readonly<{
    tableauPileStartIndex: number;
    tableauPileEndIndex: number;
    numCards: number;
}>;

export type TableauMoveFromWaste = Readonly<{
    tableauPileIndex: number;
}>;

export type FlipCard = Readonly<{}>;
