import { GameBoard } from "../Game/GameBoard";
import { Card } from "../Card/Card";

export class Blaster {
    public blasterAction(blaster: Card, noMine: number, gameboard: GameBoard, idPlayer: number) : void {
        for (let i=0; i < gameboard.nbPlayers; i++) {
            let mine = gameboard.players[i].mines[noMine];
            for (let card of mine.collection) {
                if (card.typeName === "Warrior") {
                    gameboard.recruitCenter.addCard(card);
                    console.log(`The card ${card.name} has been removed from the mine n°${noMine+1}`);
                    mine.removeCard(card);
                }
            }
        }
        gameboard.players[idPlayer].mines[noMine].removeCard(blaster);
        console.log(`The card ${blaster.name} has been removed from the mine n°${noMine+1}`);
        gameboard.recruitCenter.addCard(blaster);
    }
}