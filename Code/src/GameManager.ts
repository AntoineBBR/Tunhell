import { GameBoard } from './GameBoard'
import { CardMover } from './CardMover';
import { Player } from './Player/Player'

export class GameManager {
    public gameBoardList:Array<GameBoard> = [];

    public createGame() : GameBoard {
        // Faut créer tout le système de génération de main automatique et aléatoire
        return 
    }

    public addPlayerToBoard(player:Player, gameBoard:GameBoard) {

    }
}