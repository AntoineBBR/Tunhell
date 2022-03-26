import { Card } from '../Card/Card'
import { Stack } from '../Card/Stack'
import { StackType } from '../Card/StackType'
import { Player } from './Player';

export class GameBoard {

    public id: number;
    public nbPlayers: number;
    public players:Array<Player> = [];

    public mines: Array<Stack> = [];
    public recruitCenter: Stack;

    public trophy: Array<Card> = [];
    public unUsedCards: Stack;


    public constructor(id: number, nbPlayers: number, deck:Map<string,Array<Card>>) {
        this.id = id;
        this.nbPlayers = nbPlayers;
        this.trophy = deck.get('Trophy');

        this.recruitCenter = new Stack("RecuitCenter", StackType.RecruitCenter);
        this.unUsedCards = new Stack("UnUsedCards", StackType.unUsedCards);

        for (let stack of this.getPlayersStack(this.fisherYatesShuffle(deck.get('Dwarf')))) {
            this.players.push(new Player(stack, nbPlayers));
        }
        this.mines = this.divideBy(3, this.fisherYatesShuffle(deck.get('Mine')), this.fisherYatesShuffle(deck.get('End_mine')));
    }

    private fisherYatesShuffle(cards: Array<Card>): Array<Card> {
        for (let i = cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }

    private divideBy(nb: number, cards: Array<Card>, endMine: Array<Card>): Array<Stack> {
        const n = Math.floor(cards.length / nb);
        let tmpArr = [];
        for (let i = 0; i < nb; i++) {
            let s = new Stack("Mine" + i, StackType.Mine);
            s.addCollection(cards.slice(n * i, n * (i + 1)));               // Transfert le nombre de carte total (- reste) / nombre de joueur pour chacun des joueurs
            s.addCard(endMine[i]);
            tmpArr[i] = s;
        }
        if (nb % n != 0) {
            this.unUsedCards.addCollection(cards.slice(n * nb, cards.length));
        }
        if (endMine.length > nb) {
            this.unUsedCards.addCollection(cards.slice(nb, endMine.length));
        }
        return tmpArr;
    }

    public getPlayersStack(card: Array<Card>): Array<Stack> {
        let tmpArr = [];
        for (let i = 0; i < this.nbPlayers; i++) {
            let s = new Stack("PlayerHand" + i, StackType.PlayerHand);
            s.addCollection(card.slice(4 * i, 4 * (i + 1)));                // Transfert 4 carte à chaque joueur
            tmpArr[i] = s;
        }
        if (card.length > this.nbPlayers * 4) {
            this.recruitCenter.addCollection(card.slice(this.nbPlayers * 4, card.length));
        }
        return tmpArr;
    }

    public showAllCards() : void {
        console.debug('\n\n[DEBUG]');
        console.debug('===== All cards =====');
        this.showMineCards();
        this.showPlayerCards();
        this.showRecruitCenterCards();
        this.showTrophyCards();
        this.showUnUsedCards();
        console.debug('\n=====================\n');
    }

    public showMineCards() : void {
        console.debug('\n==== Mines ====\n');
        for (let i=0; i<3; i++) {
            console.debug(`==== Mines ${i+1} ====`);
            console.log(this.mines[i].toString());
        }
    }

    public showPlayerCards() : void {
        console.debug('\n==== Players ====\n');
        for (let i=0; i<this.nbPlayers; i++) {
            console.debug(`==== Hand player ${i+1} ====`);
            console.log(this.players[i].playerHand.toString());
            console.debug(`==== Mines player ${i+1} ====`);
            for (let j=0; j<3; j++) {
                console.debug(`==== Mines ${j+1} ====`);
                console.log(this.players[i].mines[j].toString());
            }
            console.debug(`==== Treasure player ${i+1} ====`);
            console.log(this.players[i].treasure.toString());
            console.debug(`==== Trophy player ${i+1} ====`);
            console.log(this.players[i].playerTrophy.toString());
        }
    }

    public showRecruitCenterCards() : void {
        console.debug('\n==== RecruitCenter ====\n');
        console.log(this.recruitCenter.toString());
    }

    public showTrophyCards() : void {
        console.debug('\n==== Trophy ====\n');
        console.log(this.trophy.toString());
    }

    public showUnUsedCards() : void {
        console.debug('\n==== UnUsed ====\n');
        console.log(this.unUsedCards.toString());
    }

    public comptAllCards() : void {
        console.debug('\n[DEBUG]');
        console.debug('=== Number of cards ===');

        let nbCardMines = 0;
        if (this.mines.length != 0) {
            nbCardMines = this.mines.map(tab => tab.collection.length).reduce( (acc, curr) => acc + curr);
        }
        console.debug('Mine ' + nbCardMines);

        let nbCardPlayerHands = 0;
        if (this.players.length != 0) {
            nbCardPlayerHands = this.players.map(player => player.playerHand.collection.length).reduce( (acc, curr) => acc + curr);
        }
        console.debug('PlayerHand ' + nbCardPlayerHands);

        let nbCardPlayerMines = 0;
        if (this.players.length != 0) {
            nbCardPlayerMines = this.players.map(player => player.mines.map(mine => mine.collection.length).reduce( (acc, curr) => acc + curr)).reduce( (acc, curr) => acc + curr);
        }
        console.debug('PlayerMine ' + nbCardPlayerMines);

        let nbCardPlayerTreasure = 0;
        if (this.players.length != 0) {
            nbCardPlayerTreasure = this.players.map(player => player.treasure.collection.length).reduce( (acc, curr) => acc + curr);
        }
        console.debug('PlayerTreasure ' + nbCardPlayerTreasure);

        let nbCardRecruitCenter = this.recruitCenter.collection.length;
        console.debug('RecuitCenter ' + nbCardRecruitCenter);

        let nbCardTrophy = this.trophy.length;
        for (let i=0; i < this.nbPlayers; i++) {
            nbCardTrophy += this.players[i].playerTrophy.collection.length;
        }
        console.debug('Trophy ' + nbCardTrophy);

        let nbCardUnused = this.unUsedCards.collection.length;
        console.debug('UnUsed ' + nbCardUnused);

        console.debug('==== Total ' + (nbCardMines + nbCardPlayerHands + nbCardPlayerMines + nbCardPlayerTreasure + nbCardRecruitCenter + nbCardTrophy + nbCardUnused) + ' ====');
    }

    public printPlayerHands() : void {
        console.debug('=== Players hands ===');
        for (let i=0; i < this.nbPlayers; i++) {
            console.debug('Player ' + (i+1) + ' : ' + this.players[i].playerHand.collection.length);
        }
    }
}