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
    replanish: "Test it.",
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
    replanish: "Теперь попробуйте сами.",
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

let currentTexts:LocTexts;
currentTexts = globalThis.lang == "en"  ? enTexts : ruTexts;

export class DemoF extends Phaser.Scene
{
    treesGrp:Phaser.Physics.Arcade.StaticGroup;
    fpsText:Phaser.GameObjects.Text;
    walkersArr:Array<Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody>
    gunBase:Phaser.GameObjects.Image
    gunTube:Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
    cursors:Phaser.Types.Input.Keyboard.CursorKeys
    enemiesGrp:EnemiesF
    bulletsGrp:BulletsF
    /** в отличии от других уровней,shootBullets здесь - количество отстрелянных пуль */
    shootBullets:number
    radDegreeCoef:number
    numTick:number
    shootOn:boolean
    pointerDownOn:boolean
    gameState:GameState
    enemiesIsStoped:boolean
    fireGranade:Phaser.GameObjects.Sprite
    myStrikeGrp:StrikeGrp
    isPreview:boolean
    numIssue:number
    issueArr:Array<{numTick:number,issue: Array<{x:number,y:number}>} >
    numEnemiesBefore:number
    numEnemiesAfter:number
    

    constructor(){
        super("demoF")
        this.walkersArr = []
        this.radDegreeCoef = Math.PI/180;
        this.numTick = 0
        this.pointerDownOn = false
        this.isPreview = true
        this.numIssue = 0
        this.issueArr = [{numTick:0,issue:[{x:700,y:50},{x:700,y:120},{x:700,y:180},
            {x:60,y:160},{x:60,y:260},{x:650,y:150}]},
            {numTick:50,issue:[{x:700,y:50},{x:700,y:120},{x:700,y:180},
                {x:60,y:160},{x:60,y:260},{x:650,y:150}]}];
                //{x:290,y:290},
        this.numEnemiesBefore =0;
        this.issueArr.forEach((element) => {
            this.numEnemiesBefore+=element.issue.length;
        })

        this.numEnemiesAfter = this.numEnemiesBefore;
    }

    preload(){
        
    }

    create(){
        globalThis.currentLevel = lvlNames.DemoF;
        globalThis.currentSceneName = lvlNames.DemoF
        globalThis.currentScene = this;

        // this.numEnemiesBefore =0;
        // this.issueArr.forEach((element) => {
        //     this.numEnemiesBefore+=element.issue.length;
        // })

        // this.numEnemiesAfter = this.numEnemiesBefore;

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
        (this.treesGrp.create(736,160,"atlas1",'trsGrpRight') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(64,200).setOffset(16,16);
        (this.treesGrp.create(725,302,"atlas1",'tr12') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(32,24).setOffset(4,4);
        (this.treesGrp.create(758,374,"atlas1",'tr13') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(32,40).setOffset(4,8);

        //this.add.image(399,404,"atlas1","bulletF")
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shootOn =false;
        this.pointerDownOn =true;
        this.fpsText = this.add.text(150,20,'').setStyle({fill:'black'});

        this.enemiesGrp = new EnemiesF(this)
        this.bulletsGrp = new BulletsF(this)

        
        this.shootBullets = 0

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
            bulletF.body.reset(0,-100);
            bulletF.setActive(false).setVisible(false);
            //if(enemyF.getData("offSide")) return;
            
            //enemyF.play("fallenF")
            if (enemyF.state != 'falling') {
                if(!this.isPreview) this.numEnemiesAfter--;
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
            if(this.numEnemiesAfter == 0){
                this.gameState = GameState.Win;
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
                    enemyF.state = ''
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

        this.showPreview()

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
    }

    update(time: number, delta: number): void {
        if ((this.gameState == GameState.Win || this.gameState == GameState.Lost)
            && !this.enemiesIsStoped) {
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
                this.scene.pause(lvlNames.DemoF)
                globalThis.myUIBlocks.showSummary(this.shootBullets, this.numEnemiesBefore,
                    GameState.Win)
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
                    this.gunTube.body.setAngularAcceleration(-10)
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
                if(this.gunTube.body.rotation < 80)
                    this.gunTube.body.setAngularAcceleration(10)
            }

            this.fpsText.setText(` Num Enemies:  ${this.numEnemiesAfter}`)
        }
    }

    checkBullet(){
        if (this.isPreview) {
            if (this.numTick == 0)
                this.enemiesGrp.issueEnemy([{ x: 700, y: 50 }, { x: 700, y: 120 }, { x: 700, y: 180 },
                { x: 60, y: 160 }, { x: 60, y: 260 }, { x: 290, y: 290 }, { x: 650, y: 150 },
                { x: 740, y: 380 }])
        }else{
            if (this.issueArr[this.numIssue].numTick == this.numTick) {
                if (this.numTick == this.issueArr[this.numIssue].numTick) {
                    this.enemiesGrp.issueEnemy(this.issueArr[this.numIssue].issue)
                    if (this.numIssue < this.issueArr.length - 1) {
                        this.numIssue++
                    }
                }
            }
        }

        this.numTick++

        if (this.shootOn){
            //if(this.shootBullets > 0){
                // let xOrg = (this.gunTube.body.gameObject as Phaser.GameObjects.Image)
                //     .displayOriginX;
                // let yOrg = (this.gunTube.body.gameObject as Phaser.GameObjects.Image)
                //     .displayOriginY;

                //console.log(`xOrg = ${xOrg}, ${yOrg}`)

                let xProection = Math.sin(this.gunTube.body.rotation*this.radDegreeCoef)
                let yProection = Math.cos(this.gunTube.body.rotation*this.radDegreeCoef)
                
                let xCoord = 400 + 54*xProection
                let yCoord = 450 - 54*yProection
                //this.add.image(xCoord,yCoord,"bulletF")
                this.bulletsGrp.fireBullet(xCoord,yCoord,xProection*180,-yProection*180)
                this.shootBullets++;
            //}
        }
    }

    showPreview(){
        this.pointerDownOn = false;
        let bubble;
        let captionBubble;
        bubble = this.add.graphics({x:0, y:0})
        bubble.fillStyle(0x222222, 0.5);
        bubble.fillRoundedRect(6, 6, 575, 48, 16);

        //  Bubble color
        bubble.fillStyle(0xffffff, 1);

        //  Bubble outline line style
        bubble.lineStyle(4, 0x565656, 1);

        //  Bubble shape and outline
        bubble.strokeRoundedRect(0, 0, 575,48, 16);
        bubble.fillRoundedRect(0, 0, 575,48, 16);
        bubble.generateTexture('captionBubble',582,54)
        captionBubble = this.add.image(400,36,'captionBubble').setDepth(21)
        bubble.clear()

        let captionStyle:Phaser.Types.GameObjects.Text.TextStyle =
            {fontFamily:"Roboto, Arial", fontSize: '30px', fontStyle: 'bold',
            color: '#ff0000'}
        let capTxt = this.add.text(200,16,currentTexts.touchControl ,captionStyle).setDepth(22);
        capTxt.setShadow(1,1,'#000000')
        capTxt.setDepth(22)
        
        bubble = this.add.graphics({x:0, y:0})
        bubble.fillStyle(0x222222, 0.5);
        bubble.fillRoundedRect(6, 6, 298, 128, 16);
        //  Bubble color
        bubble.fillStyle(0xffffff, 1);
        //  Bubble outline line style
        bubble.lineStyle(4, 0x565656, 1);
        //  Bubble shape and outline
        bubble.strokeRoundedRect(0, 0, 298, 128, 16);
        bubble.fillRoundedRect(0, 0, 298, 128, 16);
        bubble.generateTexture('bubble',305,135)
        bubble.clear()

        let rect = this.add.graphics({x:0,y:0})
        rect.fillStyle(0x0000ff,0.3)
        rect.fillRoundedRect(0,0,330,420,30)
        rect.generateTexture('leftTouchRect',330,420)
        rect.clear()
        //let leftToughtRect = this.add.image(188,228,'leftTouchRect').setAlpha(0)

        rect.fillStyle(0x0000ff,0.3)
        rect.fillRoundedRect(0,0,550,420,30)
        rect.generateTexture('rightToughtRect',550,420)
        rect.clear()
        //let rightToughtRect = this.add.image(532,228,'rightToughtRect').setAlpha(0)

        rect.fillStyle(0x0000ff,0.3)
        rect.fillRoundedRect(0,0,120,420,30)
        rect.generateTexture('centerToughtRect',120,420)
        rect.clear()
        let centerToughtRect = this.add.image(400,228,'centerToughtRect').setAlpha(0)
        
        let hand = this.add.image(210,280,'atlas0','hand').setAlpha(0)

        const bubbleImg = this.add.image(186,148,'bubble').setDepth(21).setAlpha(0)
        const leftBubbleTxt = this.add.text(0, 0, currentTexts.leftTap,
          { fontFamily: 'Arial, Roboto', fontStyle:'bold', fontSize: '24px', color: '#000000', align: 'center', wordWrap: { width: 278 } });
        
        let txtBnd = leftBubbleTxt.getBounds()
        //console.log(txtBnd)
        leftBubbleTxt.setPosition(bubbleImg.x - leftBubbleTxt.width/2 - 5,
            bubbleImg.y - txtBnd.height/2 - 5).setDepth(22).setAlpha(0)

        
        const rightBubbleTxt = this.add.text(0, 0, currentTexts.rightTap,
            { fontFamily: 'Arial, Roboto', fontStyle:'bold', fontSize: '24px', color: '#000000', align: 'center', wordWrap: { width: 278 } });
        txtBnd = rightBubbleTxt.getBounds()
        rightBubbleTxt.setPosition(634 - rightBubbleTxt.width/2 - 5,
            148 - txtBnd.height/2 - 5).setDepth(22).setAlpha(0)

        const centerBubbleTxt = this.add.text(0, 0, currentTexts.shooting,
        { fontFamily: 'Arial, Roboto', fontStyle:'bold', fontSize: '24px', color: '#000000', align: 'center', wordWrap: { width: 278 }})
        centerBubbleTxt.setPosition(400 - centerBubbleTxt.width/2 - 5,
            148 - centerBubbleTxt.height/2 - 5).setDepth(22).setAlpha(0)

        // цепочка для текста и подложек для него
        this.tweens.chain({
            persist:false,
            // тыкаем слева от орудия
            tweens:[
            {
                targets: bubbleImg,
                props: {
                    alpha: { value: 1 },
                },
                duration: 100
            },
            {
                targets: leftBubbleTxt,
                props: {
                    alpha: { value: 1 },
                },
                duration: 300
            },
            {
                targets: leftBubbleTxt,
                props:{
                    alpha:{value: 0}
                },
                duration: 300,
                delay:3500
            },
            {
                targets: bubbleImg,
                props:{
                    alpha:{value: 0}
                },
                duration: 100,
                onComplete: () => {
                    bubbleImg.setX(634)
                    //bubbleImg.setAlpha(1)
                },
            },
            {
                targets: bubbleImg,
                props:{
                    alpha:{value: 1}
                },
                delay:1500,
                duration: 100,
            },
            {
                targets: rightBubbleTxt,
                props: {
                    alpha: { value: 1 },
                },
                duration: 300
            },
            // {
            //      targets: rightToughtRect,
            //      props: {
            //          x: { value: 732 },
            //      },
            //      delay:1500,
            //      duration: 1500,
            // },
        ]})

        // цепочка твинов для hand
        this.tweens.chain({
            persist:false,
            // тыкаем слева от орудия
            tweens:[
            {
                targets: hand,
                props: {
                    alpha: { value: 1 },
                },
                duration: 100,
                delay: 800
            },
            {
                targets: hand,
                props: {
                    scale: { value: 0.6 },
                    y: { value: 260 }
                },
                duration: 300,
                delay: 400
            },
            {
                targets: hand,
                props: {
                    alpha: { value: 0 },
                },
                duration: 200,
                delay:800, 
                onComplete: () => {
                    hand.setAlpha(0)
                    hand.setX(600)
                    hand.setY(280)
                    hand.setScale(1)
                }
            },
            {
                targets: hand,
                props: {
                    alpha: { value: 1 },
                },
                duration: 100,
                delay:4000, 
            },
            {
                targets: hand,
                props: {
                    scale: { value: 0.6 },
                    y: { value: 260 }
                },
                duration: 300,
                delay: 400
            },
            {
                targets: hand,
                props: {
                    alpha: { value: 0 },
                },
                duration: 200,
                delay:800, 
                onComplete: () => {
                    hand.setAlpha(0)
                    hand.setX(400)
                    hand.setY(280)
                    hand.setScale(1)
                }
            },
            
        ]
        })
        
        // появляется левая область-прямоугольник, эта область движется влево,
        // появляется правая область-прямоугольник, левая область передвигается
        // влево, левая область исчезает
        // this.tweens.chain({
        //     persist:false,
        //     tweens: [
                // {
                //     targets: leftToughtRect,
                //     props: {
                //         alpha: { value: 1 },
                //     },
                //     duration: 300,
                //     delay:1200 
                // },
                // {
                //     targets: leftToughtRect,
                //     props: {
                //         x: {value: -12}
                //     },
                //     duration: 1500,
                //     delay:300 
                // },
                // {
                //     targets: rightToughtRect,
                //     props: {
                //         alpha: { value: 1 },
                //     },
                //     duration: 300,
                //     delay:4200 
                // },
                // {
                //     targets: leftToughtRect,
                //     props: {
                //         x: {value: 188}
                //     },
                //     duration: 1500,
                //     //delay:4200 
                // },
                // {
                //     targets: leftToughtRect,
                //     props: {
                //         alpha: {value: 0}
                //     },
                //     duration: 300,
                //     delay:400 
                // },
        //     ]
        // })

        
        // цепочка для каретки - каретка движется влево, движется вправо,
        // появляется подложка справа, подложка справа исчезает и перемещается
        // в центр, исчезает правая область-прямоугольник, в центре появляется
        // подложка, на ней появляется текст, появляется hand, hand жмёт на
        // центральную область, появляется центральная область-прямоугольник,
        // исчезает hand, начинается стрельба, появляется hand, hand жмёт на
        // центральную область, стрельба прекращается, hand исчезает
        this.tweens.chain({
            persist:false,
            tweens: [
                
                {
                    targets: this.gunTube,
                    props: {
                        angle:{value: -80}
                    },
                    duration: 1500,
                    delay:1800 
                },
                {
                    targets: this.gunTube,
                    props: {
                        angle:{value: 80}
                    },
                    duration: 1500,
                    delay:4600 
                },
                {
                    targets: rightBubbleTxt,
                    props:{
                        alpha:{value: 0}
                    },
                    duration: 300,
                    //delay:3500
                },
                {
                    targets: bubbleImg,
                    props:{
                        alpha:{value: 0}
                    },
                    duration: 100,
                    onComplete: () => {
                        bubbleImg.setX(400)
                        bubbleImg.setAlpha(1)
                        hand.setAlpha(1)
                        centerBubbleTxt.setAlpha(1)
                    },
                },
                // {
                //     targets: rightToughtRect,
                //     props:{
                //         alpha: 0
                //     },
                //     duration: 300
                // },
                {
                    targets: bubbleImg,
                    props: {
                        alpha: { value: 1 },
                    },
                    duration: 100
                },
                {
                    targets: centerBubbleTxt,
                    props: {
                        alpha: { value: 1 },
                    },
                    duration: 300
                },
                {
                    targets: hand,
                    props: {
                        alpha: { value: 1 },
                    },
                    duration: 100,
                    delay: 400
                },
                {
                    targets: hand,
                    props: {
                        scale: { value: 0.6 },
                        y: { value: 260 }
                    },
                    duration: 300,
                    delay: 400
                },
                {
                    targets: centerToughtRect,
                    props: {
                        alpha: { value: 1 },
                    },
                    duration: 300,
                },
                {
                    targets: hand,
                    props:{
                        alpha: {value: 0}
                    },
                    duration:200,
                    onComplete: () =>{
                        hand.setScale(1)
                        hand.setY(280)
                        this.shootOn = true;
                    }
                },
                {
                    targets: hand,
                    props: {
                        alpha: { value: 1 },
                    },
                    duration: 100,
                    delay: 2000
                },
                {
                    targets: hand,
                    props:{
                        scale: { value: 0.6 },
                        y: { value: 260 }
                    },
                    duration:200,
                    onComplete: () =>{
                        this.shootOn = false;
                    }
                },
                {
                    targets: hand,
                    props:{
                        alpha: {value:0}
                    },
                    duration:200
                },
                {
                    targets: centerToughtRect,
                    props: {
                        alpha: {value: 0}
                    },
                    duration: 300,
                },
                {
                    targets: centerBubbleTxt,
                    props:{
                        alpha:{value: 0}
                    },
                    duration: 300,
                },
                {
                    targets: capTxt,
                    props:{
                        alpha:{value:0}
                    },
                    duration:300,
                    onComplete: () => {
                        capTxt.setText(currentTexts.keyboard)
                    }
                },
                {
                    targets: capTxt,
                    props:{
                        alpha:{value:1}
                    },
                    duration:300,
                    onComplete: () => {
                        centerBubbleTxt.setText( currentTexts.arrow)
                        centerBubbleTxt.setFontSize('20px')
                        centerBubbleTxt.setPosition(400 - centerBubbleTxt.width/2 - 5,
                            148 - centerBubbleTxt.height/2 - 5)
                    }
                },
                {
                    targets: centerBubbleTxt,
                    props: {
                        alpha: {value:1}
                    },
                    duration: 300
                },
                {
                    targets:centerBubbleTxt,
                    props:{
                        alpha:{value:0}
                    },
                    duration: 300,
                    delay:2200
                },
                
                {
                    targets: capTxt,
                    props:{
                        alpha:{value:0}
                    },
                    duration:300,
                    onComplete: () => {
                        capTxt.setText(currentTexts.dontLet)
                        capTxt.setX(captionBubble.x - capTxt.width/2 -5)
                    }
                },
                {
                    targets: capTxt,
                    props:{
                        alpha:{value:1}
                    },
                    duration:1500,
                    onComplete: () => {
                        centerBubbleTxt.setText(currentTexts.replanish)
                        centerBubbleTxt.setFontSize('24px')
                        centerBubbleTxt.setPosition(400 - centerBubbleTxt.width/2 - 5,
                            148 - centerBubbleTxt.height/2 - 5)
                    },
                    
                },
                {
                    targets: centerBubbleTxt,
                    props:{
                        alpha:{value:1}
                    },
                    duration:300
                },
                {
                    targets: centerBubbleTxt,
                    props:{
                        alpha:{value:0}
                    },
                    delay:2000,
                    duration:300
                },
                {
                    targets: bubbleImg,
                    props:{
                        alpha: {value:0}
                    },
                    duration: 100
                },
                {
                    targets: capTxt,
                    props:{
                        alpha:{value:0}
                    },
                    delay:200,
                    duration:300
                },
                {
                    targets: captionBubble,
                    props:{
                        alpha:{value:0}
                    },
                    delay:200,
                    duration:300,
                    onComplete: () =>{
                        this.textures.remove("leftTouchRect")
                        this.textures.remove("rightToughtRect")
                        this.textures.remove("centerToughtRect")
                        this.textures.remove("bubble")
                        this.textures.remove("captionBubble")
                    }
                }
            ]
        })

        return
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
                this.fireGranade.once(Phaser.Animations.Events.ANIMATION_COMPLETE,
                    () => {
                        if(this.isPreview){
                            this.isPreview = false;
                            this.playLevel();
                        }else{
                            this.scene.pause(lvlNames.DemoF);
                            globalThis.myUIBlocks.showSummary(this.shootBullets,
                                (this.numEnemiesBefore-this.numEnemiesAfter),
                                GameState.Lost)
                        }
                    }, this);
                this.fireGranade.play({ key: 'gunExplode', startFrame: 0 })
            }
        })

        flyingGranad.play()
    }

    playLevel() {
        this.enemiesGrp.clearEnemies();
        //this.enemiesGrp.createGroup("demo", 0, 0, 0)
        //this.turnOnInput(true)
        (this.gunTube as Phaser.Physics.Arcade.Image).setAngle(0);
        this.enemiesIsStoped = false
        this.fireGranade.setPosition(-100, -100).setTexture('atlas0', "fireGranade")
        this.pointerDownOn = true;
        this.gameState = GameState.Gone;
        this.numTick = 0;
        this.isPreview = false
        this.numIssue = 0
        this.scene.resume("demoF")
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