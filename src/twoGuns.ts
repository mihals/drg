import * as Phaser from 'phaser';
import { GameState, lvlNames } from "./enums";
import { Enemies } from "./Enemies";
import { Bullet } from './bullets';
import { Bullets } from './bullets';
import { UIBlocks } from "./uiblocks";

type LocTexts = {
    ammo:string
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

const enTexts:LocTexts = {
    ammo:"Ammo"
}
const ruTexts:LocTexts = {
    ammo:"Патронов"
}
let currentTexts:LocTexts;
currentTexts = ruTexts;

export class TwoGuns extends Phaser.Scene
{
    /** режимы и состояния игры: autoPilot - игра воспроизводится в режиме
     * автопилота на основе сохранённых данных,
     * waitAction - игра ожидает загрузки данных для воспроизведения в
     * режиме автопилота, сбрасывается в false после загрузки, если массив
     * инструкций непустой. Выставляется в true после выполнения всех
     * инструкций в массиве keyActionArr
     * needToSave - необходимо сохранить все ходы после окончания игры
     * в ручном режиме
     */
    //gameState: {autoPilot:boolean; waitAction:boolean; needToSave:boolean}


    /** true если игра не закончена(враг ещё не прошёл)  */ 
    //gameIsGone: boolean ;
    currentGameState:GameState;

    /** true если диверсы не движутся, они останавливаются при завершении игры */
    enemiesIsStoped:boolean;

    /** включает и отключает управление клавишами и тапами */
    pointerDownOn:boolean;

    myCamera:Phaser.Cameras.Scene2D.Camera
    cursors:Phaser.Types.Input.Keyboard.CursorKeys
    shooterGrp:Phaser.Physics.Arcade.Group
    shooter:Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    /**скорость стрелка по оси X */
    shooterVX:number
    virusOff:Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    bulletsGrp:Bullets
    //bigBulletsGrp:Phaser.Physics.Arcade.StaticGroup
    staticGrp:Phaser.Physics.Arcade.StaticGroup
    treeGrp:Phaser.Physics.Arcade.StaticGroup

    actionObj: string[]
    /**массив с номерами фрейма, в котором произошло событие-нажатие одной из
     *  клавиш 'up', 'left' или 'right' */
    counterActionArr:number[]
    /**показания часов в аргументе метода update time при воспроизведении
     * фрейма с номером, указанным в массиве counterActionArr
     */
    timeActionArr:number[]
    /**код клавиши, нажатой в соответствующем фрейме */
    keyActionArr:string[]
    /**скорость шутера в соответствующем фрейме */
    vActionArr:number[]
    /**x-координата шутера в соответствующем фрейме */
    xActionArr:number[]
    /**состояние шутера(стреляет или нет) в соответствующем фрейме */
    shootActionArr:number[]
    /**x-координата якоря emptyAnchor */
    emptyAnchorArr: number []

    //isActionFetched:boolean = false;
    /** номер фрейма, увеличивается при каждом вызове update, используется
     * при фиксации действий пользователя - стрельбы и движения
     */
    updateCounter:number = 0;
    /**номер индекса, по которому в counterActionArr находится номер очередного
     * кадра, в котором в режиме автопилота должно быть совершено какое-либо
     * действие - начата или закончена стрельба и(или)
     * изменено направление движения
    */
    indCounterArr:number;

    // ovalBushGrp:Phaser.Physics.Arcade.StaticGroup
    // rogaBushGrp:Phaser.Physics.Arcade.StaticGroup
    // rosaBushGrp:Phaser.Physics.Arcade.StaticGroup
    
    /**
     * счетчик - индекс наименьшего неиспользуемого объекта в bulettsArr
     */
    bulettCounter:number
    /**
     * количество пуль у стрелка
     */
    shootBullets:number
    /**
     * ведётся ли стрельба
     */
    shootOn:boolean

    /**ведётся ли стрельба ботом */
    bbShootOn:boolean
    bbShootBullets:number

    /** счётчик срабатывания таймера checkBullets */
    delayChecker:number = 0;
    railway:any;
    railwayLine:Phaser.GameObjects.Graphics;
    lineStatic:Phaser.GameObjects.GameObject;
    enemies:Enemies
    /**спрайт для анимации взрыва */
    rwExplode:Phaser.GameObjects.Sprite
    explodeTween:Phaser.Tweens.Tween
    flyingGranad:Phaser.Tweens.Tween
    staticLayer:Phaser.GameObjects.Layer
    infoText:Phaser.GameObjects.Text
    //fpsText:Phaser.GameObjects.Text
    inputText:Phaser.GameObjects.Text
    inputText2:Phaser.GameObjects.Text
    numBullets:number = 0;
    //blackBot:Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
    shooterCont:Phaser.GameObjects.Container
    shooterContBody:Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
    leftBulletArs:Phaser.GameObjects.Image
    rightBulletArs:Phaser.GameObjects.Image
    
    bbShooterCont:Phaser.GameObjects.Container
    bbShooterContBody:Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
    bbLeftBulletArs:Phaser.GameObjects.Image
    bbRightBulletArs:Phaser.GameObjects.Image

    blankShot:Phaser.GameObjects.Sprite
    fireGranade:Phaser.GameObjects.Image

    /**индикатор прогресса анимации - движущийся с постоянной скоростью объект */
    emptyAnchor:Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
    currentAnchInd:number

    myUIBlocks:UIBlocks

    /** Уровни для колонн и кустов */
    // lr20:Phaser.GameObjects.Layer;lr60:Phaser.GameObjects.Layer
    // lr100:Phaser.GameObjects.Layer;lr140:Phaser.GameObjects.Layer
    // lr180:Phaser.GameObjects.Layer;lr220:Phaser.GameObjects.Layer
    // lrTrees:Phaser.GameObjects.Layer;lrOvalBush:Phaser.GameObjects.Layer;
    // lrRogaBush:Phaser.GameObjects.Layer;lrRosaBush:Phaser.GameObjects.Layer;

    constructor ()
    {
        super('twoGuns');
        this.shootBullets =100
        this.bbShootBullets =100
        //this.gameState = {autoPilot: false,waitAction: false, needToSave:false}
        this.shootOn = false;
        this.bbShootOn = false;

        this.currentAnchInd = 0;
    }  

    preload ()
    {
        
    }

    create ()
    {
        globalThis.currentLevel = lvlNames.TwoGuns;
        globalThis.currentSceneName = lvlNames.TwoGuns
        globalThis.currentScene = this;

        currentTexts = globalThis.lang == "en" ? enTexts : ruTexts;

        this.bbShootOn = false;

        document.body.style.backgroundImage = "url(bg5.png)"

        try{
            let botData:BotData = JSON.parse(localStorage.getItem("botData"))
            /**массив с номерами фрейма, в котором произошло событие-нажатие одной из
             *клавиш 'up', 'left' или 'right' */
            this.counterActionArr = botData.counter;
            /**показания часов в аргументе метода update time при воспроизведении
             * фрейма с номером, указанным в массиве counterActionArr
             */
            this.timeActionArr = botData.time;
            /**код клавиши, нажатой в соответствующем фрейме */
            this.keyActionArr = botData.key;
            
            /**состояние шутера(стреляет или нет) в соответствующем фрейме */
            this.shootActionArr = botData.shoot;
            this.emptyAnchorArr = botData.anchor;
        }catch{}

        this.indCounterArr = 0;
        
        this.add.tileSprite(500,225,1000,450,'atlas0','bg')

        //this.blackBot = this.physics.add.image(400,418,'blackBot');

        this.shooterCont = this.add.container(400,418);
        this.shooterCont.add(this.add.image(0,0,'atlas0','gun'))
        
        this.leftBulletArs = this.add.image(-16,3,'atlas0','bulletArs');
        this.shooterCont.add(this.leftBulletArs)
        this.rightBulletArs = this.add.image(16,3,'atlas0','bulletArs');
        this.shooterCont.add(this.rightBulletArs)
        this.shooterCont.setSize(80,40)
        this.shooterContBody = this.physics.world.enableBody(this.shooterCont,
            Phaser.Physics.Arcade.DYNAMIC_BODY) as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
        this.shooterContBody.body.setCollideWorldBounds(true);
        this.shooterContBody.body.setBoundsRectangle(new Phaser.Geom.Rectangle(80, 0, 910, 450))
        
        this.bbShooterCont = this.add.container(400,418);
        //this.bbShooterCont.add(this.add.image(0,0,'atlas0','blackBot'))
        this.bbShooterCont.add(this.add.image(0,0,'blackBotMark'));
        this.bbLeftBulletArs = this.add.image(-16,3,'atlas0','bulletArs');
        this.bbShooterCont.add(this.bbLeftBulletArs)
        this.bbRightBulletArs = this.add.image(16,3,'atlas0','bulletArs');
        this.bbShooterCont.add(this.bbRightBulletArs)
        this.bbShooterCont.setSize(80,40)
        this.bbShooterContBody = this.physics.world.enableBody(this.bbShooterCont,
            Phaser.Physics.Arcade.DYNAMIC_BODY) as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
        this.bbShooterContBody.body.setCollideWorldBounds(true);
        this.bbShooterContBody.body.setBoundsRectangle(new Phaser.Geom.Rectangle(80, 0, 910, 450))

        
        // this.leftBulletArs = this.add.image(-16,3,'bulletArs');
        // this.shooterCont.add(this.leftBulletArs)
        // this.rightBulletArs = this.add.image(16,3,'bulletArs');
        // this.shooterCont.add(this.rightBulletArs)
        // this.shooterCont.setSize(80,40)

        let bubble = this.add.graphics({x:0, y:0})
        bubble.fillStyle(0x222222, 0.5);
        bubble.fillRoundedRect(4, 4, 100, 20, 4);

        //  Bubble color
        bubble.fillStyle(0xffffff, 1);

        //  Bubble outline line style
        bubble.lineStyle(2, 0x565656, 1);

        //  Bubble shape and outline
        bubble.strokeRoundedRect(0, 0, 100,20, 4);
        bubble.fillRoundedRect(0, 0, 100,20, 4);
        bubble.generateTexture('numBulletsBubble',120,24)
        let numBulletsBubble = this.add.image(748,14,'numBulletsBubble').setDepth(21)
        bubble.clear()
        
        //{ fontFamily: 'Arial, Roboto', fontStyle:'bold', fontSize: '24px', color: '#000000', align: 'center',
        this.infoText = this.add.text(694,4,'').setStyle({fontFamily: 'Arial, Roboto',
            fill:'black', fontSize: '14px'}).setDepth(21);
        //this.fpsText = this.add.text(150,20,'').setStyle({fill:'black'});
        this.inputText = this.add.text(150,40,'').setStyle({fill:'black'});
        this.inputText2 = this.add.text(150,60,'').setStyle({fill:'black'});

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

        this.cameras.main.setBounds(0, 0, 1000, 225);
        this.physics.world.setBounds(0, 0, 1000, 450);

        this.staticGrp = this.physics.add.staticGroup();

        this.staticGrp.create(125,158,'atlas0','ovalBush').
            setBodySize(30,24).setOffset(4,2).setDepth(8);
        this.staticGrp.create(211,158,'atlas0','ovalBush').
            setBodySize(30,24).setOffset(4,2).setDepth(8);
        this.staticGrp.create(267,148,'atlas0','ovalBush').
            setBodySize(30,24).setOffset(4,2).setDepth(8);
        this.staticGrp.create(400,201,'atlas0','rogaBush').
            setBodySize(34,24).setOffset(0,0).setDepth(10);
        this.staticGrp.create(452,192,'atlas0','rogaBush').
            setBodySize(34,24).setOffset(0,0).setDepth(10);
        this.staticGrp.create(708,196,'atlas0','rosaBush').
            setBodySize(42,16).setOffset(9,0).setDepth(10);
        this.staticGrp.create(750,202,'atlas0','rosaBush').
            setBodySize(42,16).setOffset(9,0).setDepth(10);
        this.staticGrp.create(846,199,'atlas0','rosaBush').
            setBodySize(42,16).setOffset(9,0).setDepth(10);
        this.staticGrp.create(375,64,'atlas0','bigTree').
            setBodySize(94,60).setOffset(0,0).setDepth(8);
        this.staticGrp.create(621,50,'atlas0','midleTree').
            setBodySize(92,60).setOffset(0,0).setDepth(5);
        this.staticGrp.create(945,250,'atlas0','rectBush').
            setBodySize(42,16).setOffset(0,0).setDepth(5);

        this.bulletsGrp = new Bullets(this)

        this.physics.add.collider(this.staticGrp,this.bulletsGrp,
            (stat:Phaser.Types.Physics.Arcade.GameObjectWithStaticBody,bullet:Bullet)=>{
                this.add.sprite(stat.body.center.x,stat.body.bottom,'bulletStrike0').
                    setDepth(11).anims.play({key:'strike', startFrame:0})
                bullet.body.reset(0,-32);
                bullet.setActive(false).setVisible(false);
        })

        // this.bigBulletsGrp = this.physics.add.staticGroup()
        // this.bigBulletsGrp.create(94,426,'bigBullet').setData('isFull',true)
        // this.bigBulletsGrp.create(790,426,'bigBullet').setData('isFull',true)

        // this.physics.add.overlap(this.shooterCont, this.bigBulletsGrp,
        //     (shooterCont, bigBullet: Phaser.Types.Physics.Arcade.GameObjectWithStaticBody) => {
        //         if (this.shootBullets <= 50 && bigBullet.getData('isFull')) {
        //             this.shootBullets += 50
        //             bigBullet.setData('isFull', false)
        //             bigBullet.body.reset(-100, 0)
        //             bigBullet.setActive(false)
        //             this.rightBulletArs.isCropped = false
        //             if (this.shootBullets >= 60) {
        //                 let offset = Math.round(33 - 33 * (this.shootBullets - 50) / 50)
        //                 this.leftBulletArs.setCrop(0, offset, 13, 33 - offset)
        //             }
        //         }
        //     })

        const { world } = this.physics;
        this.bulettCounter = 0;
        this.shootOn = false
        
        this.enemies = new Enemies(this.bulletsGrp);

        this.enemies.createGroup('loner',0,0,0)

        this.railway = this.physics.add.staticImage(44,225,'atlas1','railway');
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.time.addEvent({ delay: 500, callback: () => this.checkBullet(), loop: true });
        this.rwExplode = this.add.sprite(43,225,'atlas0','empty');

        this.fireGranade =  this.add.image(-100,-100,'atlas0','fireGranade')

        this.add.tileSprite(500,438,1000,24,'atlas0','scheben1')
        
        this.cameras.main.startFollow(this.shooterCont)

        this.enemiesIsStoped = false
        this.input.addPointer(2)

        this.input.on('pointerdown', (pointer) => {
            if(!this.pointerDownOn) return;
            if (pointer.x < this.shooterCont.x - this.cameras.main.scrollX - 50) {
                this.shooterContBody.body.setAcceleration(-60, 0).setMaxVelocity(60)
                //this.inputText.setText('left')
                return
            }
            else if (pointer.x > this.shooterCont.x - this.cameras.main.scrollX + 50) {
                this.shooterContBody.body.setAcceleration(60, 0).setMaxVelocity(60)
                //this.inputText.setText('right')
                return
            }

            if ((pointer.x <= this.shooterCont.x - this.cameras.main.scrollX + 50) &&
                (pointer.x >= this.shooterCont.x - this.cameras.main.scrollX - 50)) {
                this.shootOn = !this.shootOn
                //if (this.shootOn) this.inputText.setText('shootOn')
                //else this.inputText.setText('shootOff')
            }
        })

        this.pointerDownOn = true;
        globalThis.currentResult = GameState.Gone;
        this.currentGameState = GameState.Gone;
        //this.shootOn = true;
        
        this.shootBullets = 100;

        this.emptyAnchor =  this.physics.add.image(0,0,'atlas0',"empty")
        this.emptyAnchor.body.setVelocity(6,0)
        this.currentAnchInd = 0;
        this.bbShootBullets =100

        try{
            globalThis.gYsdk.features.GameplayAPI.start()
        }catch{}
    }

    update(time: number, delta: number): void {
        let deltaX:number =0;
        let velocityX:number = 0;
        let numFrame = this.game.getFrame()

        let nLst = this.input.listeners('pointerdown')

        // если все враги уничтожены (GameState.Win) или состав взорван (GameState.Lost),
        // но игра ещё не остановлена (!this.enemiesIsStoped), завершаем её
        if ((this.currentGameState == GameState.Win || this.currentGameState == GameState.Lost)
            && !this.enemiesIsStoped) {
            this.pointerDownOn = false;

            globalThis.currentResult = this.currentGameState;
            
            this.enemiesIsStoped = true
            if (this.currentGameState == GameState.Lost) {
                let point = this.enemies.stopEnemies(GameState.Lost)
                this.fireGranade.setPosition(point.x - 16, point.y - 16)
                this.enemiesIsStoped = true;
                
                
                this.cameras.main.stopFollow()
                this.cameras.main.pan(400,225,300);
                (this.shooterCont as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).
                    body.reset(400,398)
                this.shooterCont.setY(418)
                this.playGransdExplodeTween()
            }
            if (this.currentGameState == GameState.Win) {
                this.enemies.stopEnemies(GameState.Win)
                /** номер сообщения, которое зависит от результата и достижений игрока */
                
                try{
                    globalThis.gYsdk.features.GameplayAPI.stop()
                }catch{}
                globalThis.myUIBlocks.showSummary(200 - this.shootBullets, 68, GameState.Win)
            }
            this.enemiesIsStoped = true
        }

        // при демонстрации Preview и при завершении игры, управление 
        // отключается (pointerDownOn=false)?, если управление не отключено,
        // то обрабатываем события
        if (this.pointerDownOn) {
            this.updateCounter++;
            if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
                this.shootOn = !this.shootOn
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
                this.shooterContBody.body.setAcceleration(-60, 0).setMaxVelocity(60)
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
                this.shooterContBody.body.setAcceleration(60, 0).setMaxVelocity(60)
            }
        }

        if(this.currentGameState == GameState.Gone){
            if (this.currentAnchInd < this.emptyAnchorArr.length - 1) {
                while (this.emptyAnchor.body.x >= this.emptyAnchorArr[this.currentAnchInd]) {
                    switch (this.keyActionArr[this.currentAnchInd]) {
                        case 'u':
                            this.bbShootOn = this.shootActionArr[this.currentAnchInd] == 1 ?
                                true : false;
                            break;
                        case 'l':
                            this.bbShooterContBody.body.setAcceleration(-60, 0).setMaxVelocity(60)
                            break;
                        case 'r':
                            this.bbShooterContBody.body.setAcceleration(60, 0).setMaxVelocity(60)
                            break;
                    }
                    this.currentAnchInd++;
                }
            }

            // извлекаем номер очередного фрейма, в котором следует что-то совершить 
            let numFrame = this.counterActionArr[this.indCounterArr]
            
        }

        this.infoText.setText(currentTexts.ammo +`: ${this.shootBullets}`)
        //this.fpsText.setText(` fps:  ${Math.round(1000/delta)}`)
        //this.fpsText.setText(` FPS:  ${1000/delta}`)
    }

    // метод создающий твин летящей гранаты, после которого начинается
    // анимация взрыва, после которой текстура ж-д станции заменяется на
    // сгоревшую и стартует твин, делающий облако взрыва прозрачным, по
    // окончании его в зависимости от того была ли это презентация или
    // взрыв произошёл в реальной игре либо выводится окно с итогами, либо
    // стартует уровень 
    playGransdExplodeTween() {
        let flyingGranad = this.tweens.add({
            targets: this.fireGranade,
            x: 50,
            duration: 1000,
            persist: false,
            paused: true,
            onComplete: () => {
                this.rwExplode.play({ key: 'rwExplode', startFrame: 0 })
                this.rwExplode.setAlpha(1)
                this.rwExplode.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.railway.setTexture('atlas1','blackRailway');
                    this.explodeTween = this.tweens.add({
                        targets: this.rwExplode,
                        alpha: 0,
                        duration: 2000,
                        persist: false,
                        paused: true,
                        onComplete: () => {
                            
                                this.scene.pause("demo")
                                let numRemBullets = 0;
                                // считаем сколько осталось патронов в игре
                                // this.bigBulletsGrp.getChildren().forEach((child) =>{
                                //     if(child.getData("isFull")) numRemBullets += 50;
                                // })
                                numRemBullets += this.shootBullets;
                                
                                try{
                                    globalThis.gYsdk.features.GameplayAPI.stop()
                                }catch{}

                                globalThis.myUIBlocks.showSummary(200 - numRemBullets,
                                    this.enemies.getNumKilledEnemies(),GameState.Lost)
                            }
                    });
                    this.explodeTween.play();
                })
            }
        })
        flyingGranad.play()
    }

    

    
    checkBullet() {
        if (this.enemiesIsStoped) return
        if (this.shootOn) {
            if (this.shootBullets > 0) {
                this.bulletsGrp.fireBullet(this.shooterCont.x, this.shooterCont.y - 15,
                    this.shooterCont.body.velocity.x)
                this.shootBullets--;
                if (this.shootBullets % 10 == 0) {
                    if (this.shootBullets >= 50) {
                        let offset = Math.round(33 - 33 * (this.shootBullets - 50) / 50)
                        this.leftBulletArs.setCrop(0, offset, 13, 33 - offset)
                    } else {
                        let offset = Math.round(33 - 33 * this.shootBullets / 50)
                        this.rightBulletArs.setCrop(0, offset, 13, 33 - offset)
                    }
                }
            } else {
                this.bulletsGrp.fireBlank(this.shooterCont.x, this.shooterCont.y - 15,
                    this.shooterCont.body.velocity.x)
            }
        }

        this.delayChecker++;

        if (this.bbShootOn) {
            if (this.bbShootBullets > 0) {
                this.bulletsGrp.fireBullet(this.bbShooterCont.x,
                    this.bbShooterCont.y - 15,
                    this.bbShooterCont.body.velocity.x)
                this.bbShootBullets--;
                if (this.bbShootBullets % 10 == 0) {
                    if (this.bbShootBullets >= 50) {
                        let offset = Math.round(33 - 33 * (this.bbShootBullets - 50) / 50)
                        this.bbLeftBulletArs.setCrop(0, offset, 13, 33 - offset)
                    } else {
                        let offset = Math.round(33 - 33 * this.bbShootBullets / 50)
                        this.bbRightBulletArs.setCrop(0, offset, 13, 33 - offset)
                    }
                }
            } else {
                this.bulletsGrp.fireBlank(this.bbShooterCont.x, this.bbShooterCont.y - 15,
                    this.bbShooterCont.body.velocity.x)
            }
        }

        // delayChecker до полного истребления всех диверсов первой волны
        // достигалось 290, 300, 417,306, после тренировок ~ 230 
        this.currentGameState = this.enemies.handleUpdate();
    }
}