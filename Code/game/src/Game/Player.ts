import { Card } from "../Card/Card";
import { Stack } from "../Card/Stack";
import { StackType } from "../Card/StackType";

export class Player {
    public playerHand : Stack;
    public mines : Array<Stack> = [];
    public playerTrophy : Stack;
    public treasure : Stack;

    public constructor(playerHand: Stack, nbPlayers: Number) {
        this.playerHand = playerHand;
        for (let i=0; i<nbPlayers; i++) {
            this.mines[i] = new Stack("PlayerMine" + i, StackType.PlayerMine);
        }
        this.treasure = new Stack("PlayerTreasure", StackType.PlayerTreasure);
        this.playerTrophy = new Stack("PlayerTrophy", StackType.PlayerTrophy);
    }

    public moveCardToMine(noCard:number, noMine:number) : void {
        if (noMine > this.mines.length) {
            throw new Error("Mine number is too higher !");
        }     
        this.playerHand.moveCardToStack(this.playerHand.collection[noCard],this.mines[noMine]);
    }

    public showHand() : void {
        console.log("Your hand:\n" + this.playerHand.toString() + "\n");
    }
}