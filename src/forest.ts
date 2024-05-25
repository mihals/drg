import * as Phaser from 'phaser';
import { GameState, lvlNames } from "./enums";
import { BulletF } from './bullets';
import { BulletsF } from './bullets';
import { UIBlocks } from "./uiblocks";
import { EnemiesF } from './enemiesF';
import { EnemyF } from './enemiesF';

type LocTexts = {
    touchControl: string
    leftTap: string
    rightTap: string
    shooting: string
    keyboard: string
    arrow: string
    dontLet: string
    replanish: string
    ammo:string
}
const enTexts:LocTexts = {
    touchControl: "Control on the touchscreen:",
    leftTap: "Tap to the left of the gun to rotate to the left.",
    rightTap: "Tap to the right of the gun to rotate to the right.",
    shooting: "To start or finish shooting, click on(above) the gun.",
    keyboard: "Keyboard control.",
    arrow: "The Up arrow key starts or ends shooting, the Right and Left arrows rotate the gun.",
    dontLet: "Don't let them pass!",
    replanish: "Replenish your ammo supply whenever possible.",
    ammo:"Ammo"
}
const ruTexts:LocTexts = {
    touchControl: "Управление на тачскрине:",
    leftTap: "Жмите слева от орудия, чтобы повернуть влево.",
    rightTap: "Жмите справа от орудия, чтобы повернуть вправо.",
    shooting: "Чтобы начать или закончить стрельбу, жмите над орудием.",
    keyboard: "Управление с клавиатуры.",
    arrow: "Клавиша со стрелкой вверх начинает или заканчивает стрельбу, со стрелками вправо и влево поворачивает орудие.",
    dontLet: "Не дайте им подобраться!",
    replanish: "Пополняйте по возможности запас патронов.",
    ammo:"Патронов"
}

type BotData = {
        time : Array<number>,
        counter: Array<number>,
        key : Array<string>,
        shoot : Array<number>,
        vActionA : Array<number>,
        xAction : Array<number>,
        anchor:Array<number>
}

/** перечень всех массивов стартовых точек */
type StartPntsArrSet = Array<{
    name:string,
    startPnts:Array<{x:number, y:number}>,
}>

/** перечень имён коротких цепочек с интервалами между ними и именами
 * массивов стартовых точек
 */


/** перечень имён коротких цепочек с именами следующих возможных
 * коротких цепочек, указывающих на их сложность 
 */


let currentTexts:LocTexts;
currentTexts = globalThis.lang == "en"  ? enTexts : ruTexts;

export class Forest extends Phaser.Scene
{
    treesGrp:Phaser.Physics.Arcade.StaticGroup;
    fpsText:Phaser.GameObjects.Text;
    /** количество уничтоженных врагов */
    enemyText:Phaser.GameObjects.Text;
    /** количество потраченных патронов */
    bulletsText:Phaser.GameObjects.Text;

    walkersArr:Array<Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody>
    gunBase:Phaser.GameObjects.Image
    gunTube:Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
    cursors:Phaser.Types.Input.Keyboard.CursorKeys
    enemiesGrp:EnemiesF
    bulletsGrp:BulletsF
    shootBullets:number
    radDegreeCoef:number

    numTick:number
    nextTick:number
    /**имя текущей цепочки из карты shortSeqMap */
    currentSeq:string
    /** индекс группы стартовых точек в текущей цепочке */
    indPntsGrp:number

    shootOn:boolean
    pointerDownOn:boolean
    gameState:GameState
    enemiesIsStoped:boolean
    fireGranade:Phaser.GameObjects.Sprite
    myStrikeGrp:StrikeGrp
    //** число выпусков */ 
    numIssue:number
    //** число уничтоженных врагов */
    numKilled:number
    //** число выпущенных врагов */
    numIssuedEnemies
    //** число выпущенных пуль */
    numBullets

    issueArr:Array<{numTick:number,issue: string} >
    /**верхний вход без шести точек, близких к другим */
    // topStartPointArr:Array<{x:number,y:number}>
    // leftStartPointArr:Array<{x:number,y:number}>
    // rightStartPointArr:Array<{x:number,y:number}>
    // rightStartPointArrOdd:Array<{x:number,y:number}>
    // topStartPointArrL:Array<{x:number,y:number}>
    // topStartPointArrR:Array<{x:number,y:number}>
    // leftStartPointArrEven:Array<{x:number,y:number}>
    // leftStartPointArrOdd:Array<{x:number,y:number}>
    // leftStartPointArr3:Array<{x:number,y:number}>
    // leftStartPointArr31:Array<{x:number,y:number}>
    // leftStartPointArr32:Array<{x:number,y:number}>
    // leftStartPointArr33:Array<{x:number,y:number}>
    //myStartPntsArrSet:StartPntsArrSet
    myShortSequenses:object

    /** наборы стартовых точек врагов: имя набора и массив стартовых точек набора*/
    startPntsMap:Map<string,Array<{x:number,y:number}>>

    /** наборы цепочек из имён групп стартовых точек с интервалами времени между стартами,
     *  каждая цепочка именована и для каждой цепочки указаны имена следующей
     *  цепочки - лёгкий, средней сложности и сложный выриант (nextEasy, middle, hard)
     */
    shortSeqMap:Map<string,{seq:Array<{startPntsName:string, interval?:number}>,
        nextEasy:string, middle:string, hard:string}>
    
    // startArrPntsSet:
    // seqArr:Array<Sequense>
    

    constructor(){
        super("forest")
        this.walkersArr = []
        this.radDegreeCoef = Math.PI/180;

        this.numTick = 0
        this.nextTick = 0
        this.currentSeq = "tl_tr_t"
        this.indPntsGrp = 0

        this.numIssue = 0
        this.numKilled = 0
        this.numIssuedEnemies = 0
        /**количество потраченных патронов */
        this.numBullets = 200;

        // точки входа для верхних деревьев
        // [{ x: 30, y: 50 }, { x: 40, y: 50 }, { x: 50, y: 50 }, { x: 130, y: 60 }, { x: 170, y: 30 },
        //     { x: 240, y: 50 }, { x: 300, y: 60 }, { x: 360, y: 70 }, { x: 380, y: 50 }, { x: 390, y: 50 },
        //     { x: 420, y: 30 }, { x: 460, y: 60 }, { x: 480, y: 60 }, { x: 490, y: 60 }, { x: 540, y: 50 },
        //     { x: 550, y: 50 }, { x: 590, y: 40 }, { x: 600, y: 50 }, { x: 610, y: 60 }, { x: 650, y: 50 }, { x: 660, y: 50 }]
        
        /**верхний вход без шести точек, близких к другим */    
        // this.topStartPointArr = [{ x: 30, y: 50 },  { x: 50, y: 50 }, { x: 130, y: 60 }, { x: 170, y: 30 },
        // { x: 240, y: 50 }, { x: 300, y: 60 }, { x: 360, y: 70 }, { x: 390, y: 50 },
        // { x: 420, y: 30 }, { x: 460, y: 60 },  { x: 490, y: 60 }, { x: 540, y: 50 },
        // { x: 590, y: 40 },  { x: 610, y: 60 }, { x: 650, y: 50 }]

        // // левая часть точек появления сверху
        // this.topStartPointArrL= [{ x: 30, y: 50 }, { x: 40, y: 50 }, { x: 50, y: 50 }, { x: 130, y: 60 }, { x: 170, y: 30 },
        //     { x: 240, y: 50 }, { x: 300, y: 60 }, { x: 360, y: 70 }, { x: 380, y: 50 }, { x: 390, y: 50 }]
        
        // // правая часть точек появления сверху
        // this.topStartPointArrR = [{ x: 420, y: 30 }, { x: 460, y: 60 }, { x: 480, y: 60 }, { x: 490, y: 60 }, { x: 540, y: 50 },
        //         { x: 550, y: 50 }, { x: 590, y: 40 }, { x: 600, y: 50 }, { x: 610, y: 60 }, { x: 650, y: 50 }, { x: 660, y: 50 }]

        // // все точки появления врагов с левого края
        // this.leftStartPointArr = [{x:60,y:166},{x:50,y:174},{x:64,y:174},{x:60,y:200},{x:60,y:204},{x:56,y:210},
        // {x:54,y:214},{x:56,y:224},{x:58,y:230},{x:60,y:236},{x:64,y:242},{x:70,y:250},
        // {x:70,y:256},{x:70,y:264},{x:60,y:270},{x:56,y:278},{x:54,y:286},{x:56,y:294},
        // {x:52,y:300},{x:54,y:308},{x:54,y:314}]

        // // каждая третья точка появления с левого края, начиная с первой
        // this.leftStartPointArr31= [{x:60,y:166},{x:60,y:200},{x:54,y:214},{x:60,y:236},
        //                             {x:70,y:256},{x:56,y:278},{x:52,y:300}]

        // // каждая третья точка появления с левого края, начиная со второй
        // this.leftStartPointArr32 = [{x:50,y:174},{x:60,y:204},{x:56,y:224},{x:64,y:242},
        //                             {x:70,y:264},{x:54,y:286},{x:54,y:308}]

        // // каждая третья точка появления с левого края, начиная с третьей
        // this.leftStartPointArr33 = [{x:64,y:174},{x:56,y:210},{x:58,y:230},{x:70,y:250},
        //                             {x:60,y:270},{x:56,y:294},{x:54,y:314}]                                    

        // // чётные точки левого края
        // this.leftStartPointArrEven = [{x:50,y:174},{x:60,y:200},{x:60,y:204},
        //     {x:54,y:214},{x:58,y:230},{x:64,y:242},
        //     {x:70,y:256},{x:60,y:270},{x:54,y:286},
        //     {x:52,y:300},{x:54,y:314}]

        // // нечётные точки левого края
        // this.leftStartPointArrOdd = [{x:60,y:166},{x:64,y:174},{x:60,y:204},
        //     {x:54,y:214},{x:58,y:230},{x:64,y:242},
        //     {x:70,y:256},{x:60,y:270},{x:54,y:286},
        //     {x:52,y:300},{x:54,y:314}]

        // this.leftStartPointArr3 = [{ x: 60, y: 166 }, { x: 60, y: 200 }, 
        // { x: 54, y: 214 }, { x: 60, y: 236 }, 
        // { x: 70, y: 256 },  { x: 56, y: 278 }, 
        // { x: 52, y: 300 }, ]

        // this.rightStartPointArr = [{x:704,y:60},{x:704,y:70},{x:704,y:80},{x:704,y:90},
        //     {x:704,y:100},{x:704,y:110},{x:704,y:120},{x:704,y:130},{x:704,y:140},
        //     {x:704,y:150},{x:704,y:160},{x:704,y:170},{x:704,y:216},{x:720,y:230},
        //     {x:720,y:300},{x:740,y:370}]

        // this.rightStartPointArrOdd = [{ x: 704, y: 60 }, { x: 704, y: 80 },
        // { x: 704, y: 100 },  { x: 704, y: 120 },  { x: 704, y: 140 },
        //  { x: 704, y: 160 },  { x: 704, y: 216 }, { x: 720, y: 230 },
        // { x: 720, y: 300 }, { x: 740, y: 370 }]

        
        //{x:704,y:60},{x:704,y:70},{x:704,y:80},{x:704,y:90},{x:704,y:100},{x:704,y:110}
        //,{x:704,y:120},{x:704,y:130},{x:704,y:140},{x:704,y:150},{x:704,y:160},{x:704,y:170}
        //{x:704,y:216},{x:720,y:230},{x:720,y:300},{x:740,y:370}

        

        // для отладки, потом надо закомментить
        // this.issueArr = [
        //     {numTick:0,issue:this.topStartPointArrL},
        //     //{numTick:30,issue:this.topStartPointArrL},
        //     {numTick:75,issue:this.topStartPointArrL},
        //     //{numTick:105,issue:this.topStartPointArrL},
        //     {numTick:145,issue:this.topStartPointArrL},
        //     //{numTick:160,issue:this.topStartPointArrL},
        //     {numTick:175,issue:this.topStartPointArrL},
        //     //{numTick:195,issue:this.topStartPointArrL},
        //     //{numTick:215,issue:this.topStartPointArrL},
        //     {numTick:235,issue:this.topStartPointArrL}]

        // this.myStartPntsArrSet = [{
        //     name: "left31",
        //     startPnts: this.leftStartPointArr31
        // },
        // {
        //     name: "left32",
        //     startPnts: this.leftStartPointArr31
        // },
        // {
        //     name: "left33",
        //     startPnts: this.leftStartPointArr31
        // },
        // {
        //     name: "top",
        //     startPnts: this.topStartPointArr
        // },
        // {
        //     name: "topL",
        //     startPnts: this.topStartPointArrL
        // },
        // {
        //     name: "topR",
        //     startPnts: this.topStartPointArrR
        // },
        // {
        //     name: "rightOdd",
        //     startPnts: this.rightStartPointArrOdd
        // },
        // ]

        // this.myShortSequenses = {
        //     seqL:{

        //     }
        // }

        // 
        this.startPntsMap = new Map(
            /**верхний вход без шести точек, близких к другим */
            [["topStartPointArr", [{ x: 30, y: 50 }, { x: 50, y: 50 }, { x: 130, y: 60 }, { x: 170, y: 30 },
            { x: 240, y: 50 }, { x: 300, y: 60 }, { x: 360, y: 70 }, { x: 390, y: 50 },
            { x: 420, y: 30 }, { x: 460, y: 60 }, { x: 490, y: 60 }, { x: 540, y: 50 },
            { x: 590, y: 40 }, { x: 610, y: 60 }, { x: 650, y: 50 }]],

            // левая часть точек появления сверху
            ["topStartPointArrL", [{ x: 30, y: 50 }, { x: 40, y: 50 }, { x: 50, y: 50 }, { x: 130, y: 60 }, { x: 170, y: 30 },
            { x: 240, y: 50 }, { x: 300, y: 60 }, { x: 360, y: 70 }, { x: 380, y: 50 }, { x: 390, y: 50 }]],

            // правая часть точек появления сверху
            ["topStartPointArrR", [{ x: 420, y: 30 }, { x: 460, y: 60 }, { x: 480, y: 60 }, { x: 490, y: 60 }, { x: 540, y: 50 },
            { x: 550, y: 50 }, { x: 590, y: 40 }, { x: 600, y: 50 }, { x: 610, y: 60 }, { x: 650, y: 50 }, { x: 660, y: 50 }]],

            // все точки появления врагов с левого края
            ["leftStartPointArr", [{ x: 60, y: 166 }, { x: 50, y: 174 }, { x: 64, y: 174 }, { x: 60, y: 200 }, { x: 60, y: 204 }, { x: 56, y: 210 },
            { x: 54, y: 214 }, { x: 56, y: 224 }, { x: 58, y: 230 }, { x: 60, y: 236 }, { x: 64, y: 242 }, { x: 70, y: 250 },
            { x: 70, y: 256 }, { x: 70, y: 264 }, { x: 60, y: 270 }, { x: 56, y: 278 }, { x: 54, y: 286 }, { x: 56, y: 294 },
            { x: 52, y: 300 }, { x: 54, y: 308 }, { x: 54, y: 314 }]],

            // каждая третья точка появления с левого края, начиная с первой
            ["leftStartPointArr31", [{ x: 60, y: 166 }, { x: 60, y: 200 }, { x: 54, y: 214 }, { x: 60, y: 236 },
            { x: 70, y: 256 }, { x: 56, y: 278 }, { x: 52, y: 300 }]],

            // каждая третья точка появления с левого края, начиная со второй
            ["leftStartPointArr32", [{ x: 50, y: 174 }, { x: 60, y: 204 }, { x: 56, y: 224 }, { x: 64, y: 242 },
            { x: 70, y: 264 }, { x: 54, y: 286 }, { x: 54, y: 308 }]],

            // каждая третья точка появления с левого края, начиная с третьей
            ["leftStartPointArr33", [{ x: 64, y: 174 }, { x: 56, y: 210 }, { x: 58, y: 230 }, { x: 70, y: 250 },
            { x: 60, y: 270 }, { x: 56, y: 294 }, { x: 54, y: 314 }]],

            // чётные точки левого края
            ["leftStartPointArrEven", [{ x: 50, y: 174 }, { x: 60, y: 200 }, { x: 60, y: 204 },
            { x: 54, y: 214 }, { x: 58, y: 230 }, { x: 64, y: 242 },
            { x: 70, y: 256 }, { x: 60, y: 270 }, { x: 54, y: 286 },
            { x: 52, y: 300 }, { x: 54, y: 314 }]],

            // нечётные точки левого края
            ["leftStartPointArrOdd", [{ x: 60, y: 166 }, { x: 64, y: 174 }, { x: 60, y: 204 },
            { x: 54, y: 214 }, { x: 58, y: 230 }, { x: 64, y: 242 },
            { x: 70, y: 256 }, { x: 60, y: 270 }, { x: 54, y: 286 },
            { x: 52, y: 300 }, { x: 54, y: 314 }]],

            ["rightStartPointArr", [{ x: 704, y: 60 }, { x: 704, y: 70 }, { x: 704, y: 80 }, { x: 704, y: 90 },
            { x: 704, y: 100 }, { x: 704, y: 110 }, { x: 704, y: 120 }, { x: 704, y: 130 }, { x: 704, y: 140 },
            { x: 704, y: 150 }, { x: 704, y: 160 }, { x: 704, y: 170 }, { x: 704, y: 216 }, { x: 720, y: 230 },
            { x: 720, y: 300 }, { x: 740, y: 370 }]],

            ["leftStartPointArr3", [{ x: 60, y: 166 }, { x: 60, y: 200 },
            { x: 54, y: 214 }, { x: 60, y: 236 },
            { x: 70, y: 256 }, { x: 56, y: 278 },
            { x: 52, y: 300 }]],

            ["rightStartPointArrOdd", [{ x: 704, y: 60 }, { x: 704, y: 80 },
            { x: 704, y: 100 }, { x: 704, y: 120 }, { x: 704, y: 140 },
            { x: 704, y: 160 }, { x: 704, y: 216 }, { x: 720, y: 230 },
            { x: 720, y: 300 }, { x: 740, y: 370 }]]
            ])

        this.issueArr = [
            { numTick: 0, issue: "rightStartPointArrOdd" },
            { numTick: 35, issue: "topStartPointArr" },
            { numTick: 70, issue: "topStartPointArrR" },
            { numTick: 75, issue: "topStartPointArrL" },
            { numTick: 105, issue: "leftStartPointArr32" },
            { numTick: 145, issue: "topStartPointArr" },
            { numTick: 160, issue: "leftStartPointArr3" },
            { numTick: 175, issue: "leftStartPointArr31" },
            { numTick: 195, issue: "leftStartPointArr32" },
            { numTick: 215, issue: "rightStartPointArrOdd" },
            { numTick: 235, issue: "topStartPointArrR" }]

        this.shortSeqMap = new Map([
            ["tl_tr_t",
            {seq:[{startPntsName:"topStartPointArrL",interval:20},
                {startPntsName:"topStartPointArrR",interval:20},
                {startPntsName:"topStartPointArr",interval:20},
                {startPntsName:"leftStartPointArr32",interval:20},
                {startPntsName:"topStartPointArrR",interval:20},
                {startPntsName:"topStartPointArrL"}
            ],
            nextEasy:"tr_tl_t", middle:"",hard:""}],

            ["tr_tl_t",
            {seq:[{startPntsName:"topStartPointArrR",interval:20},
                {startPntsName:"topStartPointArrL",interval:20},
                {startPntsName:"topStartPointArr",interval:20},
                {startPntsName:"leftStartPointArr32",interval:30},
                {startPntsName:"topStartPointArr",interval:20},
                {startPntsName:"topStartPointArrR",interval:20}
            ],
            nextEasy:"rodd_tl_t", middle:"",hard:""}],

            ["rodd_tl_t",
            {seq:[{startPntsName:"rightStartPointArrOdd",interval:20},
                {startPntsName:"topStartPointArrL",interval:20},
                {startPntsName:"topStartPointArr",interval:20},
                {startPntsName:"rightStartPointArrOdd",interval:20},
                {startPntsName:"topStartPointArrL",interval:20}
            ],
            nextEasy:"l31_rodd_tl", middle:"",hard:""}],

            ["l31_rodd_tl",
            {seq:[{startPntsName:"leftStartPointArr31",interval:20},
                {startPntsName:"rightStartPointArrOdd",interval:20},
                {startPntsName:"topStartPointArrL",interval:20},
                {startPntsName:"leftStartPointArr31",interval:20},
                {startPntsName:"rightStartPointArrOdd",interval:20}
            ],
            nextEasy:"l31_rodd_tl", middle:"l31_rodd_tl",hard:""}],
        ])


    }

    preload(){
        
    }

    create(){
        globalThis.currentLevel = lvlNames.Forest;
        globalThis.currentScene = this;

        this.cameras.main.setBackgroundColor('#fafbfd')

        this.anims.create({
            key: 'fallenF',
            frames: [
                {key:"atlas1", frame: 'walkerF6' },
                {key:"atlas1", frame: 'walkerF7' },
                {key:"atlas1", frame: 'walkerF8' },
                {key:"atlas1", frame: 'walkerF9' }
            ],
            frameRate: 5
        });

        this.anims.create({
            key: 'strike',
            frames: [
                {key:"atlas0", frame: 'bulletStrike0' },
                {key:"atlas0", frame: 'bulletStrike1' },
                {key:"atlas0", frame: 'bulletStrike2' },
                {key:"atlas0", frame: 'bulletStrike3' },
                {key:"atlas0", frame: 'bulletStrike4' },
                {key:"atlas0", frame: 'bulletStrike5' },
                {key:"atlas0", frame: 'empty' }
            ],
            frameRate: 5,
            //repeat: -1
        });

        this.anims.create({
            key: 'gunExplode',
            frames: [
                {key:"atlas1", frame: 'expl1' },
                {key:"atlas1", frame: 'expl2' },
                {key:"atlas1", frame: 'expl3' },
                {key:"atlas1", frame: 'expl4' },
                {key:"atlas1", frame: 'expl5' },
                {key:"atlas1", frame: 'expl6' },
                {key:"atlas1", frame: 'expl7' }
            ],
            frameRate: 5
        });

        //this.add.image(172,432,'progressEnemy')
        //this.add.image(634,432,'progressAmmo')

        this.treesGrp = this.physics.add.staticGroup();
        
        (this.treesGrp.create(64,230,"atlas1",'trsGrpLeft') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(30,152).setOffset(30,20);
        (this.treesGrp.create(60,68,"atlas1",'trs0') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(36,38).setOffset(4,8);
        (this.treesGrp.create(131,66,"atlas1",'tr1') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(28,28).setOffset(4,6);
        (this.treesGrp.create(178,37,"atlas1",'tr2') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(36,24).setOffset(1,0);
        (this.treesGrp.create(251,55,"atlas1",'tr3') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(24,24).setOffset(4,12);
        (this.treesGrp.create(319,61,"atlas1",'tr4') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(40,28).setOffset(6,20);
        (this.treesGrp.create(365,68,"atlas1",'tr3') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(28,32).setOffset(6,6);
        (this.treesGrp.create(398,46,"atlas1",'tr3') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(32,32).setOffset(4,6);
        (this.treesGrp.create(422,36,"atlas1",'tr7') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(20,16).setOffset(4,8);
        (this.treesGrp.create(498,80,"atlas1",'trs8') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(48,28).setOffset(4,24);
        (this.treesGrp.create(552,56,"atlas1",'tr9') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(24,24).setOffset(4,12);
        (this.treesGrp.create(602,40,"atlas1",'trs10') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(38,36).setOffset(4,16);
        (this.treesGrp.create(664,36,"atlas1",'trs11') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(36,36).setOffset(8,12);
        (this.treesGrp.create(724,302,"atlas1",'tr12') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(28,24).setOffset(8,4);
        (this.treesGrp.create(758,374,"atlas1",'tr13') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(28,36).setOffset(8,10);
        (this.treesGrp.create(736,160,"atlas1",'trsGrpRight') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(64,200).setOffset(16,16);

        //this.add.image(399,404,"bulletF")
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shootOn =false;
        this.pointerDownOn =true;
        this.fpsText = this.add.text(150,20,'').setStyle({color:'black'});
        this.enemyText = this.add.text(5,430,'').setStyle({color:'#184e44'});
        this.bulletsText = this.add.text(500,430,'').setStyle({color:'#a4001e'});

        this.enemiesGrp = new EnemiesF(this)
        this.bulletsGrp = new BulletsF(this)
        this.shootBullets = 200

        this.physics.add.collider(this.treesGrp, this.bulletsGrp,
            (stat: Phaser.Types.Physics.Arcade.GameObjectWithStaticBody, bullet: BulletF) => {
                let strikeSpr: Phaser.GameObjects.Sprite = this.myStrikeGrp.getFirstDead();
                strikeSpr.setPosition(bullet.x, bullet.y).setActive(true).setVisible(true);
                strikeSpr.once(Phaser.Animations.Events.ANIMATION_COMPLETE,
                    (anim, frame, sprite) => {
                        sprite.setPosition(0, -100);
                        sprite.setActive(false).setVisible(false);
                    }, this);
                strikeSpr.anims.play({ key: 'strike', startFrame: 0 });
                bullet.body.reset(0, -100);
                bullet.setActive(false).setVisible(false);
            })

        this.physics.add.collider(this.enemiesGrp,this.bulletsGrp,
            (enemyF:EnemyF, bulletF:BulletF) =>{
                if(!enemyF.active){
                    console.log(`enemy active = ${enemyF.active}`)
                }
            bulletF.body.reset(0, -100);
            bulletF.setActive(false).setVisible(false);
            //if(enemyF.getData("offSide")) return;
            
            //enemyF.play("fallenF")
            if (enemyF.state != 'falling') {
                this.numKilled++;
                if(this.numKilled%20 == 0) this.numBullets+=30
                enemyF.setVelocity(0,0)
                enemyF.state = 'falling'
                enemyF.play({ key: "fallenF", startFrame: 0 });
                enemyF.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    enemyF.body.reset(-100, 0);
                    enemyF.setActive(false).setVisible(false);
                    enemyF.state = '';
                    //this.remove(enemy);
                    //let hasActive = reserve.countActive()
                    //console.log(hasActive)
                }, this);
            }
        })

        this.add.image(401,409,"atlas1","board");
        this.gunBase = this.physics.add.staticImage(400,433,"atlas1",'gunBase').setCircle(80).
           setOffset(-40,-40);
        
        this.physics.add.overlap(this.enemiesGrp, this.gunBase,
            (gunBase: Phaser.Types.Physics.Arcade.GameObjectWithStaticBody, enemyF: EnemyF) => {
                //enemyF.anims.stop();
                //enemyF.setVelocity(0,0)
                if (this.gameState != GameState.Lost) {
                    this.enemiesGrp.stopEnemies();
                    enemyF.setData("offSide", true);
                    enemyF.setTexture("atlas1",'walkerF10')
                    this.gameState = GameState.Lost;
                    this.playGransdExplodeTween(enemyF.x, enemyF.y)
                    console.log(enemyF.state, gunBase.state);
                }
            })

        
        //this.gunBase.setCircle(100);
        //this.gunTube =  this.add.image(400,430,'gunTube')
        this.gunTube =  this.physics.add.image(400,450,"atlas1",'gunTube').setOrigin(0.5, 1)
        this.fireGranade = this.add.sprite(-10, -10,"atlas0", "fireGranade");
        this.gameState = GameState.Gone;
        this.enemiesIsStoped = false;

        this.input.on('pointerdown', (pointer) => {
            if(!this.pointerDownOn) return;
            if (pointer.x < this.gunBase.x - 80) {
                if(this.gunTube.body.rotation > -80)
                    this.gunTube.body.setAngularAcceleration(-10)
                return
            }
            else if (pointer.x > this.gunBase.x + 80) {
                if(this.gunTube.body.rotation < 80)
                    this.gunTube.body.setAngularAcceleration(10)
                return
            }

            if ((pointer.x <= this.gunBase.x + 80) &&
                (pointer.x >= this.gunBase.x - 80)) {
                this.shootOn = !this.shootOn
            }
        })

        this.myStrikeGrp = new StrikeGrp(this);
        this.time.addEvent({ delay: 500, callback: () => this.checkBullet(), loop: true });

        this.fpsText.setText(` Enemies:  ${(this.numIssuedEnemies - this.numKilled)}`)
    }

    update(time: number, delta: number): void {
        if ((this.gameState == GameState.Win || this.gameState == GameState.Lost)
            && !this.enemiesIsStoped) {
            this.pointerDownOn = false;
            this.pointerDownOn =false;
            this.gunTube.body.setAngularAcceleration(0);
            this.gunTube.body.setAngularVelocity(0);
            this.shootOn = false;
            this.pointerDownOn = false;
            //globalThis.currentResult = this.gameState;
            //globalThis.currentLevel = lvlNames.Loner;
            
            this.enemiesIsStoped = true
            if (this.gameState == GameState.Lost) {
                //let point = this.enemies.stopEnemies(GameState.Lost)
                //this.fireGranade.setPosition(point.x - 16, point.y - 16)
                this.enemiesIsStoped = true;
                
                // (this.shooterCont as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).
                //     body.reset(400,398)
                // this.shooterCont.setY(418)
                // this.playGransdExplodeTween()
            }
            if (this.gameState == GameState.Win) {
                //this.enemies.stopEnemies(GameState.Win)
                /** номер сообщения, которое зависит от результата и достижений игрока */
                let numMsg;
                
                globalThis.myUIBlocks.showSummary(200 - this.shootBullets, 68, GameState.Win)
            }
            this.enemiesIsStoped = true
        }

        if(this.gunTube.body.angularVelocity <= -15){
            this.gunTube.body.angularAcceleration = 0;
            this.gunTube.body.angularVelocity = -15;
        }

        if(this.gunTube.body.angularVelocity >= 15){
            this.gunTube.body.angularAcceleration = 0;
            this.gunTube.body.angularVelocity = 15;
        }

        if(this.gunTube.body.rotation <= -80){
            if(this.gunTube.body.angularVelocity < 0)
                this.gunTube.body.angularVelocity = 0;
            if(this.gunTube.body.angularAcceleration < 0)
                this.gunTube.body.angularAcceleration = 0;
        }

        if(this.gunTube.body.rotation >= 80){
            if(this.gunTube.body.angularVelocity > 0)
                this.gunTube.body.angularVelocity = 0;
            if(this.gunTube.body.angularAcceleration > 0)
                this.gunTube.body.angularAcceleration = 0;
        }

        if (this.pointerDownOn) {

            if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
                this.shootOn = !this.shootOn
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
                if(this.gunTube.body.rotation > -80)
                    this.gunTube.body.setAngularAcceleration(-15)
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
                if(this.gunTube.body.rotation < 80)
                    this.gunTube.body.setAngularAcceleration(15)
            }

            this.fpsText.setText(` FPS:  ${Math.round(1000 / delta)}`)
        }

        this.fpsText.setText(`numEnemies: ${(this.numIssuedEnemies - this.numKilled)}`)
        this.enemyText.setText(`Killed: ${this.numKilled}`)
        this.bulletsText.setText(`Bullets: ${this.numBullets}`)
    }

    checkBullet(){
        if(this.numTick == this.nextTick){
            this.shortSeqMap.get(this.currentSeq).seq
            this.issueNext()
        }

        // if (this.issueArr[this.numIssue].numTick == this.numTick) {
        //     //this.numIssuedEnemies += this.issueArr[this.numIssue].issue.length
        //     if (this.numTick == this.issueArr[this.numIssue].numTick) {
        //         let issueArr = this.startPntsMap.get(this.issueArr[this.numIssue].issue)
        //         this.enemiesGrp.issueEnemy(issueArr)
        //         this.numIssuedEnemies += issueArr.length
        //         if (this.numIssue < this.issueArr.length - 1) {
        //             this.numIssue++
        //         }
        //     }
        // }

        this.numTick++

        if (this.shootOn){
            if(this.shootBullets > 0){
                let xOrg = (this.gunTube.body.gameObject as Phaser.GameObjects.Image)
                    .displayOriginX;
                let yOrg = (this.gunTube.body.gameObject as Phaser.GameObjects.Image)
                    .displayOriginY;

                //console.log(`xOrg = ${xOrg}, ${yOrg}`)
                let xProection = Math.sin(this.gunTube.body.rotation*this.radDegreeCoef)
                let yProection = Math.cos(this.gunTube.body.rotation*this.radDegreeCoef)
                
                let xCoord = 400 + 54*xProection
                let yCoord = 450 - 54*yProection
                //this.add.image(xCoord,yCoord,"bulletF")
                this.bulletsGrp.fireBullet(xCoord,yCoord,xProection*180,-yProection*180)
                this.numBullets--;
            }
        }
    }

    issueNext(){
        let startPntsName:string
        let intEnemies = this.numIssuedEnemies%100
        // если в текущей цепочке дошли до последнего элемента, переходим к
        // новой цепочке
        if (this.shortSeqMap.get(this.currentSeq).seq.length - 1 == this.indPntsGrp) {
            switch (intEnemies) {
                case 1:
                    if (this.shortSeqMap.get(this.currentSeq).middle != "") {
                        this.currentSeq = this.shortSeqMap.get(this.currentSeq).middle;
                    } else {
                        this.currentSeq = this.shortSeqMap.get(this.currentSeq).nextEasy
                    }
                    break;
                case 2:
                    if (this.shortSeqMap.get(this.currentSeq).middle != "" &&
                        this.numBullets > 120) {
                        this.currentSeq = this.shortSeqMap.get(this.currentSeq).middle;
                    } else {
                        this.currentSeq = this.shortSeqMap.get(this.currentSeq).nextEasy
                    }
                    this.currentSeq = this.shortSeqMap.get(this.currentSeq).nextEasy
                    break;
                case 3:
                    if (this.shortSeqMap.get(this.currentSeq).middle != "") {
                        this.currentSeq = this.shortSeqMap.get(this.currentSeq).middle;
                    } else {
                        this.currentSeq = this.shortSeqMap.get(this.currentSeq).nextEasy
                    }
                    break;
                default:
                    this.currentSeq = this.shortSeqMap.get(this.currentSeq).nextEasy
            }
            // if(this.numIssuedEnemies>100&&
            //     this.shortSeqMap.get(this.currentSeq).middle!=""){
            //     this.currentSeq = this.shortSeqMap.get(this.currentSeq).middle;
            // }else{
            //     this.currentSeq = this.shortSeqMap.get(this.currentSeq).nextEasy
            // }
            this.indPntsGrp =0;
            this.nextTick += 50;
            //this.nextTick += this.shortSeqMap.get(this.currentSeq).
            //    seq[this.indPntsGrp].interval;
            startPntsName = this.shortSeqMap.get(this.currentSeq).
                seq[this.indPntsGrp].startPntsName; 
        }
        // переходим к следующему элементу в цепочке
        else{
            
            this.nextTick += this.shortSeqMap.get(this.currentSeq).
                seq[this.indPntsGrp].interval
            this.indPntsGrp++;
            startPntsName = this.shortSeqMap.get(this.currentSeq).
                seq[this.indPntsGrp].startPntsName;
        }
        if ((this.numIssuedEnemies - this.numKilled +
            this.startPntsMap.get(startPntsName).length) < 90) {
            this.numIssuedEnemies += this.startPntsMap.get(startPntsName).length
            this.enemiesGrp.issueEnemy(this.startPntsMap.get(startPntsName))
        }
        
    }

    playGransdExplodeTween(x,y) {
        this.fireGranade.setPosition(x,y);
        let flyingGranad = this.tweens.add({
            targets: this.fireGranade,
            x: 400,
            y: 425,
            duration: 1500,
            persist: false,
            paused: true,
            onComplete: () => {
                this.fireGranade.play({ key: 'gunExplode', startFrame: 0 })
            }
        })

        flyingGranad.play()
    }
}

class StrikeGrp extends Phaser.GameObjects.Group{
    constructor(scene:Phaser.Scene){
        super(scene)

        this.createMultiple({
            frameQuantity: 25,
            key: 'empty',
            setXY: {x:-100,y: 0},
            active: false,
            visible: false,
            classType: Phaser.GameObjects.Sprite
        })
    }
}