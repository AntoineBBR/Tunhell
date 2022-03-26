import { GameBoard } from "./GameBoard";
import { Player } from "./Player";

import { Card } from "../Card/Card";

import { Blaster } from "../Action/Blaster";
import { Dwarf } from "../Card/Dwarf";
import { Picker } from "../Action/Picker";
import { Scout } from "../Action/Scout";

import { Enemy } from "../Card/Enemy";
import { Bonus } from "../Card/Bonus";
import { Treasure } from "../Card/Treasure";

import { debugValue } from "../Launcher";
import { debugExtremeValue } from "../Launcher";

import { prompt } from "../Module/Question";


export class Game {
    public gameboard : GameBoard;
    public selectedPlayer : number;
    public turn : number;

    private scout: Scout;
    private blaster: Blaster;
    private picker: Picker;

    public constructor(gameboard: GameBoard){
        this.gameboard = gameboard;
        this.selectedPlayer = 1;
        this.turn = 1;

        this.scout = new Scout();
        this.blaster = new Blaster();
        this.picker = new Picker();
    }

    public playGame() : void {
        this.doRound();     // Boucle de jeu
        let scores =  this.computeScore();
        this.endGame(scores);

        if (debugExtremeValue) { this.gameboard.showAllCards(); }
        if (debugValue) { this.gameboard.comptAllCards(); }
    }
    
    private async doRound() {
        // Rajouter la condition d'arrêt de la partie
        if (debugExtremeValue) { this.gameboard.showAllCards(); }
        if (debugValue) { this.gameboard.comptAllCards(); }

        // Test d'arrêt
        if (this.almost2MinesEmpty()) { console.log(`\nThe game has ended!! Let's count the points!!\n`); return; }

        console.debug(`\n=====================================\n| Turn ${this.turn}: Player ${this.selectedPlayer}, it's your turn! |\n=====================================`);

        // Rajouter une question pour savoir ce que le joueur veut voir (main, plateau etc..)
        this.gameboard.players[this.selectedPlayer-1].showHand();

        let choice = await prompt('Pick a Card or Play a Card (1/2)? ');
        switch (choice) {
            case 1:
                await this.recruitCard();
                break;
            case 2:
                await this.playCard();
                break;
            default:
                this.doRound();
                return;
        }

        if (debugValue) { console.log('[DEBUG] Primary choice done!'); }

        for (let [index, cards_mine] of this.gameboard.players[this.selectedPlayer-1].mines.entries()) {
            for (let card of cards_mine.collection) {
                if (debugValue) { console.log(`[DEBUG] Action going on for ${card.name}`); }
                await this.cardAction(card, index);   // ne traitera que les piocheurs
            }
        }

        if (this.selectedPlayer < this.gameboard.nbPlayers) {
            this.selectedPlayer++;
        }
        else {
            console.log('The turn is over!\n');
            this.selectedPlayer = 1;
            this.turn++;
        }
        await prompt('\nPress a key a end your turn ');
        this.doRound();
    }

    private async recruitCard() {
        let player = this.gameboard.players[this.selectedPlayer-1];
        if (player.playerHand.collection.length >= 6) {
            console.log('You have already 6 cards in your hand!'); 
            await this.playCard();
            return;
        }
        console.debug('Recruit Center:', this.gameboard.recruitCenter.toStringFirst(5));
        let noCard = await prompt(`Which Card do you want to pick (1 to ${this.gameboard.recruitCenter.lenghtMaxFive()})? `);
        if (noCard > 0 && noCard <= this.gameboard.recruitCenter.lenghtMaxFive()) {
            console.log(`You choose the ${this.gameboard.recruitCenter.collection[noCard-1].name}!\n`)
            // Ajouter une demande de bonus
            this.gameboard.recruitCenter.moveCardToStack(this.gameboard.recruitCenter.collection[noCard-1], player.playerHand );
        } 
        else {
            await this.recruitCard();
            return;
        }
    }

    private async playCard() {                                          // Peut boucler à l'infini si le joueur ne peux jouer que des piocheurs (après il fait pas d'effort quoi ..)
        let player = this.gameboard.players[this.selectedPlayer-1];     
        if (player.playerHand.collection.length == 0) {                 // Ne prend pas en compte le fais que le joueur peut avoir des cartes non jouables dans sa main !!
            console.log('You have no card in your hand!');
            await this.recruitCard();
            return;
        }
        let noCard = await prompt(`Whitch Card do you want to play (1 to ${player.playerHand.collection.length})? `);
        if (noCard > 0 && noCard <= player.playerHand.collection.length) {
            let card = player.playerHand.collection[noCard-1];
            if (card.typeName == 'Picker') {
                if (!this.isPossible(this.selectedPlayer-1, 0) && !this.isPossible(this.selectedPlayer-1, 1) && !this.isPossible(this.selectedPlayer-1, 2)) {
                    console.log(`You shouldn't place the card ${card.name} in any mine because you haven't enough "warriors power"!`);
                    await this.playCard();
                    return;
                }
            }
            await this.moveCardtoMine(player, noCard-1);        
        }
        else {
            await this.playCard();
            return;
        }
    }

    private async moveCardtoMine(player: Player, noCard: number) {
        let noMines = await prompt(`In which mine do you want to place the card ${player.playerHand.collection[noCard].name} (1 to ${this.gameboard.mines.length})? `);
        if (noMines > 0 && noMines <= this.gameboard.mines.length) {
            let card = player.playerHand.collection[noCard];
            if (card.typeName == 'Picker') {
                if (!this.isPossible(this.selectedPlayer-1, noMines-1)) { 
                    console.log(`You shouldn't place the card ${card.name} in the mine n°${noMines} because you haven't enough "warriors power"!`);
                    await this.moveCardtoMine(player, noCard);
                    return;
                } 
            }
            console.log(`The ${player.playerHand.collection[noCard].name} has been moved to the mine n°${noMines}\n`);
            player.moveCardToMine(noCard, noMines-1);
        } 
        else {
            await this.moveCardtoMine(player, noCard);
        }
    }

    private isPossible(player: number, noMine: number) : boolean {
        let combatValuePlayer: number = this.picker.combatValue(player, noMine, this.gameboard);
        for (let i=0; i < this.gameboard.nbPlayers; i++) {
            if (combatValuePlayer < this.picker.combatValue(i, noMine, this.gameboard)) {
                return false;
            }
        }
        return true;
    }

    private async cardAction(card: Card, noMine: number) {
        let cardTypeName = card.typeName;
        switch (cardTypeName) {
            case 'Blaster':
                this.blaster.blasterAction(card, noMine, this.gameboard, this.selectedPlayer-1);
                break;
            case 'Scout':
                this.scout.scoutAction(card, noMine, this.gameboard, this.selectedPlayer-1);
                break;
            case 'Picker':
                await this.picker.pickerAction(card, noMine, this.gameboard, this.selectedPlayer-1);
                break;
            case 'Warrior':
                break;
            default:
                console.log(`Action of the card ${card.name} of the type ${card.typeName} not implemented ;(`);
                console.log('The card has been add to the unUsedCard stack (temporary solution)');
                this.gameboard.unUsedCards.addCard(card);
                this.gameboard.players[this.selectedPlayer-1].mines[noMine].removeCard(card);
        }
    }

    private almost2MinesEmpty(): boolean {
        let b1:boolean = this.gameboard.mines[0].collection.length == 0;
        let b2:boolean = this.gameboard.mines[1].collection.length == 0;
        let b3:boolean = this.gameboard.mines[2].collection.length == 0;
        //return ((b1 && b2) || (b2 && b3) || (b1 && b3));
        return b1 ? (b2 || b3) : (b2 && b3);
    }

    private computeScore(): Map<number, number> {
        let score = new Map;
        let maxDirt:number, maxRat:number = 0;
        let ownerDirt:number, ownerRat:number = 0;

        for (let i=0; i<4; i++) {
            let s:number, dirt:number, rat:number = 0;
            for (let card of this.gameboard.players[i].treasure.collection) {
                if (card instanceof Enemy || card instanceof Treasure) {
                    s += card.gold_value;
                }
                if (card.name == 'Dirt') { dirt++; }
                else if (card.name == 'Rat') { rat++; }
            }
            if (maxDirt < dirt) { maxDirt = dirt; ownerDirt = i; }
            if (maxRat < rat) { maxRat = rat; ownerRat = i; }

            for (let card of this.gameboard.players[i].playerHand.collection) {
                if (card.name == 'Unique_rings') { s += (card as Treasure).gold_value; }    // Rajouter les execptions
            }
            score.set(i, s);
        }
        // Mon Dieu que c'est horrible :(
        // On verra plus tard pour l'extensibilitée
        if (this.gameboard.trophy[0].name == 'Employee_of_the_month') {
            this.gameboard.players[ownerDirt].playerTrophy.addCard(this.gameboard.trophy[0]);
            this.gameboard.players[ownerRat].playerTrophy.addCard(this.gameboard.trophy[1]); 
        }
        else { 
            this.gameboard.players[ownerDirt].playerTrophy.addCard(this.gameboard.trophy[1]);
            this.gameboard.players[ownerRat].playerTrophy.addCard(this.gameboard.trophy[0]);
        }

        for (let i=0; i<4; i++) {
            for (let card of this.gameboard.players[i].playerTrophy.collection) {
                let n = score.get(i);
                n += (card as Treasure).gold_value;
                score.set(i, n);
            }
        }
        return new Map([...score.entries()].sort((a, b) => b[1] - a[1]));
    }

    private endGame(scores:Map<number, number>): void {
        console.log('\n\nThis is the ranking of the game:');
        for (let [key, value] of scores) {
            console.log(`(1) - Player ${key} with a score of ${value}!`);
        }
        console.log('\n\nThanks for playing and see ya!!');
    }
}