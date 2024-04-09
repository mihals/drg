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

let currentTexts:LocTexts;
currentTexts = globalThis.lang == "en"  ? enTexts : ruTexts;

export class Forest extends Phaser.Scene
{
    treesGrp:Phaser.Physics.Arcade.StaticGroup;
    fpsText:Phaser.GameObjects.Text;
    walkersArr:Array<Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody>
    gunBase:Phaser.GameObjects.Image
    gunTube:Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
    cursors:Phaser.Types.Input.Keyboard.CursorKeys
    enemiesGrp:EnemiesF
    bulletsGrp:BulletsF
    shootBullets:number
    radDegreeCoef:number
    numTick:number
    shootOn:boolean
    pointerDownOn:boolean
    gameState:GameState
    enemiesIsStoped:boolean
    fireGranade:Phaser.GameObjects.Sprite
    myStrikeGrp:StrikeGrp

    constructor(){
        super("forest")
        this.walkersArr = []
        this.radDegreeCoef = Math.PI/180;
        this.numTick = 0
    }

    preload(){
        this.load.image('empty','assetsF/empty.png')

        this.load.image('walkerF1','assetsF/walk1.png')
        this.load.image('walkerF2','assetsF/walk2.png')
        this.load.image('walkerF3','assetsF/walk3.png')
        this.load.image('walkerF4','assetsF/walk4.png')
        this.load.image('walkerF5','assetsF/walk5.png')
        this.load.image('walkerF6','assetsF/walk6.png')
        this.load.image('walkerF7','assetsF/walk7.png')
        this.load.image('walkerF8','assetsF/walk8.png')
        this.load.image('walkerF9','assetsF/walk9.png')
        this.load.image('walkerF10','assetsF/walk10.png')

        this.load.image('expl1','assetsF/expl1.png')
        this.load.image('expl2','assetsF/expl2.png')
        this.load.image('expl3','assetsF/expl3.png')
        this.load.image('expl4','assetsF/expl4.png')
        this.load.image('expl5','assetsF/expl5.png')
        this.load.image('expl6','assetsF/expl6.png')
        this.load.image('expl7','assetsF/expl7.png')

        this.load.image('gunBase','assetsF/gunBase.png')
        this.load.image('gunTube','assetsF/gunTubeC.png')
        this.load.image('bulletF','assetsF/bulletA.png')
        this.load.image('trsGrpLeft','assetsF/trsGrpLeft.png')
        this.load.image('trs0','assetsF/trs0.png')
        this.load.image('tr1','assetsF/tr1.png')
        this.load.image('tr2','assetsF/tr2.png')
        this.load.image('tr3','assetsF/tr3.png')
        this.load.image('tr4','assetsF/tr4.png')
        this.load.image('tr7','assetsF/tr7.png')
        this.load.image('trs8','assetsF/trs8.png')
        this.load.image('tr9','assetsF/tr9.png')
        this.load.image('trs10','assetsF/trs10.png')
        this.load.image('trs11','assetsF/trs11.png')
        this.load.image('trsGrpRight','assetsF/trsGrpRight.png')
        this.load.image('board','assetsF/board.png')

        this.load.image('fireGranade','assets/circleBullet.png')
    }

    create(){
        globalThis.currentLevel = lvlNames.Forest;
        globalThis.currentScene = this;

        this.anims.create({
            key: 'fallenF',
            frames: [
                { key: 'walkerF6' },
                { key: 'walkerF7' },
                { key: 'walkerF8' },
                { key: 'walkerF9' }
            ],
            frameRate: 5
        });

        this.anims.create({
            key: 'strike',
            frames: [
                { key: 'bulletStrike0' },
                { key: 'bulletStrike1' },
                { key: 'bulletStrike2' },
                { key: 'bulletStrike3' },
                { key: 'bulletStrike4' },
                { key: 'bulletStrike5' },
                { key: 'empty' }
            ],
            frameRate: 5,
            //repeat: -1
        });

        this.anims.create({
            key: 'gunExplode',
            frames: [
                { key: 'expl1' },
                { key: 'expl2' },
                { key: 'expl3' },
                { key: 'expl4' },
                { key: 'expl5' },
                { key: 'expl6' },
                { key: 'expl7' }
            ],
            frameRate: 5
        });

        

        this.treesGrp = this.physics.add.staticGroup();
        
        (this.treesGrp.create(64,230,'trsGrpLeft') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(30,152).setOffset(30,20);
        (this.treesGrp.create(60,68,'trs0') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(36,38).setOffset(4,8);
        (this.treesGrp.create(131,66,'tr1') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(28,28).setOffset(4,6);
        (this.treesGrp.create(178,37,'tr2') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(36,24).setOffset(1,0);
        (this.treesGrp.create(251,55,'tr3') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(24,24).setOffset(4,12);
        (this.treesGrp.create(319,61,'tr4') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(40,28).setOffset(6,20);
        (this.treesGrp.create(365,68,'tr3') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(28,32).setOffset(6,6);
        (this.treesGrp.create(398,46,'tr3') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(32,32).setOffset(4,6);
        (this.treesGrp.create(422,36,'tr7') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(20,16).setOffset(4,8);
        (this.treesGrp.create(498,80,'trs8') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(48,28).setOffset(4,24);
        (this.treesGrp.create(552,56,'tr9') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(24,24).setOffset(4,12);
        (this.treesGrp.create(602,40,'trs10') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(38,36).setOffset(4,16);
        (this.treesGrp.create(664,36,'trs11') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(36,36).setOffset(8,12);
        (this.treesGrp.create(736,160,'trsGrpRight') as Phaser.Types.Physics.
            Arcade.ImageWithStaticBody).body.setSize(64,200).setOffset(16,16);

        this.add.image(399,404,"bulletF")
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shootOn =false;
        this.pointerDownOn =true;
        this.fpsText = this.add.text(150,20,'').setStyle({fill:'black'});

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
            bulletF.body.reset(-100,0);
            bulletF.setActive(false).setVisible(false);
            if(enemyF.getData("offSide")) return;
            
            //enemyF.play("fallenF")
            if (enemyF.state != 'falling') {
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

        this.add.image(401,409,"board");
        this.gunBase = this.physics.add.staticImage(400,433,'gunBase').setCircle(80).
           setOffset(-40,-40);
        
        this.physics.add.overlap(this.enemiesGrp, this.gunBase,
            (gunBase: Phaser.Types.Physics.Arcade.GameObjectWithStaticBody, enemyF: EnemyF) => {
                //enemyF.anims.stop();
                //enemyF.setVelocity(0,0)
                if (this.gameState != GameState.Lost) {
                    this.enemiesGrp.stopEnemies();
                    enemyF.setData("offSide", true);
                    enemyF.setTexture('walkerF10')
                    this.gameState = GameState.Lost;
                    this.playGransdExplodeTween(enemyF.x, enemyF.y)
                    console.log(enemyF.state, gunBase.state);
                }
            })

        
        //this.gunBase.setCircle(100);
        //this.gunTube =  this.add.image(400,430,'gunTube')
        this.gunTube =  this.physics.add.image(400,450,'gunTube').setOrigin(0.5, 1)
        this.fireGranade = this.add.sprite(-10, -10, "fireGranade");
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

        if(this.gunTube.body.angularVelocity <= -10){
            this.gunTube.body.angularAcceleration = 0;
            this.gunTube.body.angularVelocity = -10;
        }

        if(this.gunTube.body.angularVelocity >= 10){
            this.gunTube.body.angularAcceleration = 0;
            this.gunTube.body.angularVelocity = 10;
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

            this.fpsText.setText(` FPS:  ${Math.round(1000 / delta)}`)
        }
    }

    checkBullet(){
        if(this.numTick == 0){
            //{x:50,y:50},{x:750,y:50},,,{x:700,y:100},{x:550,y:200},{x:400,y:75}
            this.enemiesGrp.issueEnemy([{x:250,y:200},{x:650,y:150}
                ])
            this.numTick++;
        }

        if (this.shootOn){
            if(this.shootBullets > 0){
                let xOrg = (this.gunTube.body.gameObject as Phaser.GameObjects.Image)
                    .displayOriginX;
                let yOrg = (this.gunTube.body.gameObject as Phaser.GameObjects.Image)
                    .displayOriginY;

                console.log(`xOrg = ${xOrg}, ${yOrg}`)
                let xProection = Math.sin(this.gunTube.body.rotation*this.radDegreeCoef)
                let yProection = Math.cos(this.gunTube.body.rotation*this.radDegreeCoef)
                
                let xCoord = 400 + 54*xProection
                let yCoord = 450 - 54*yProection
                //this.add.image(xCoord,yCoord,"bulletF")
                this.bulletsGrp.fireBullet(xCoord,yCoord,xProection*180,-yProection*180)
            }
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
        let leftToughtRect = this.add.image(188,228,'leftTouchRect').setAlpha(0)

        rect.fillStyle(0x0000ff,0.3)
        rect.fillRoundedRect(0,0,550,420,30)
        rect.generateTexture('rightToughtRect',550,420)
        rect.clear()
        let rightToughtRect = this.add.image(532,228,'rightToughtRect').setAlpha(0)

        rect.fillStyle(0x0000ff,0.3)
        rect.fillRoundedRect(0,0,120,420,30)
        rect.generateTexture('centerToughtRect',120,420)
        rect.clear()
        let centerToughtRect = this.add.image(400,228,'centerToughtRect').setAlpha(0)
        
        let hand = this.add.image(210,280,'hand').setAlpha(0)

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
            {
                 targets: rightToughtRect,
                 props: {
                     x: { value: 732 },
                 },
                 delay:1500,
                 duration: 1500,
            },
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
        this.tweens.chain({
            persist:false,
            tweens: [
                {
                    targets: leftToughtRect,
                    props: {
                        alpha: { value: 1 },
                    },
                    duration: 300,
                    delay:1200 
                },
                {
                    targets: leftToughtRect,
                    props: {
                        x: {value: -12}
                    },
                    duration: 1500,
                    delay:300 
                },
                {
                    targets: rightToughtRect,
                    props: {
                        alpha: { value: 1 },
                    },
                    duration: 300,
                    delay:4200 
                },
                {
                    targets: leftToughtRect,
                    props: {
                        x: {value: 188}
                    },
                    duration: 1500,
                    //delay:4200 
                },
                {
                    targets: leftToughtRect,
                    props: {
                        alpha: {value: 0}
                    },
                    duration: 300,
                    delay:400 
                },
            ]
        })

        
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
                {
                    targets: rightToughtRect,
                    props:{
                        alpha: 0
                    },
                    duration: 300
                },
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
                    duration:300,
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