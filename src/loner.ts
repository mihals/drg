import * as Phaser from 'phaser';
import { GameState, lvlNames } from "./enums";
import { Enemies } from "./Enemies";
import { Bullet } from './bullets';
import { Bullets } from './bullets';
import { UIBlocks } from "./uiblocks";

type LocTexts = {
    ammo:string
}
const enTexts:LocTexts = {
    ammo:"Ammo"
}
const ruTexts:LocTexts = {
    ammo:"Патронов"
}
let currentTexts:LocTexts;
currentTexts = ruTexts;

export class Loner extends Phaser.Scene
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
    bigBulletsGrp:Phaser.Physics.Arcade.StaticGroup
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
    fpsText:Phaser.GameObjects.Text
    inputText:Phaser.GameObjects.Text
    inputText2:Phaser.GameObjects.Text
    numBullets:number = 0;
    shooterCont:Phaser.GameObjects.Container
    shooterContBody:Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
    leftBulletArs:Phaser.GameObjects.Image
    rightBulletArs:Phaser.GameObjects.Image
    blankShot:Phaser.GameObjects.Sprite
    fireGranade:Phaser.GameObjects.Image

    myUIBlocks:UIBlocks

    /** Уровни для колонн и кустов */
    // lr20:Phaser.GameObjects.Layer;lr60:Phaser.GameObjects.Layer
    // lr100:Phaser.GameObjects.Layer;lr140:Phaser.GameObjects.Layer
    // lr180:Phaser.GameObjects.Layer;lr220:Phaser.GameObjects.Layer
    // lrTrees:Phaser.GameObjects.Layer;lrOvalBush:Phaser.GameObjects.Layer;
    // lrRogaBush:Phaser.GameObjects.Layer;lrRosaBush:Phaser.GameObjects.Layer;

    constructor ()
    {
        super('loner');
        this.shootBullets =100
        //this.gameState = {autoPilot: false,waitAction: false, needToSave:false}
        this.shootOn = false;
        //this.actionArr = []
        this.timeActionArr = []
        this.counterActionArr = []
        this.keyActionArr = []
        this.vActionArr = []
        this.xActionArr = []
        this.shootActionArr = []
        this.currentGameState = GameState.Gone;
        this.pointerDownOn = false;
        //this.myUIBlocks = new UIBlocks("")
    }  
    
    

    preload ()
    {
        
    }

    create ()
    {
        // if (this.gameState.autoPilot) {
        //     this.gameState.waitAction = true
        //     let response = fetch('http://localhost/drgServer/get_actions.php',
        //         {
        //             method: 'post',
        //             headers: {
        //                 'Content-Type': 'application/x-www-form-urlencoded',
        //                 'Origin': 'https://localhost/drg'
        //             },
        //             body: ('data=')
        //         }).then(response => {
        //             if (response.ok) {
        //                 return response.json();
        //             }
        //         }).then((data : {a_time:string, id:string, is_shoot:string,
        //             key_code:string, update_cntr:string, v:string,x:string}) => {
        //             this.timeActionArr = data.a_time.split(',').
        //                 map((val)=>Number(val))
        //             this.counterActionArr = data.update_cntr.split(',').
        //                 map((val)=>Number(val))
        //             this.keyActionArr = data.key_code.split(',')
        //             this.shootActionArr = data.is_shoot.split(',').
        //                 map((val)=>Number(val))
        //             this.vActionArr = data.v.split(',').map((val)=>Number(val))
        //             this.xActionArr = data.x.split(',').map((val)=>Number(val))
        //             if(this.keyActionArr.length != 0){
        //                 this.gameState.waitAction = false
        //                 this.indCounterArr = 0
        //             }
                    
        //             this.scene.resume()
        //         })
        // }

        globalThis.currentScene = this;
        
        this.add.tileSprite(500,225,1000,450,'bg')

        this.shooterCont = this.add.container(400,418);
        this.shooterCont.add(this.add.image(0,0,'gun'))
        
        this.leftBulletArs = this.add.image(-16,3,'bulletArs');
        this.shooterCont.add(this.leftBulletArs)
        this.rightBulletArs = this.add.image(16,3,'bulletArs');
        this.shooterCont.add(this.rightBulletArs)
        this.shooterCont.setSize(80,40)
        this.shooterContBody = this.physics.world.enableBody(this.shooterCont,
            Phaser.Physics.Arcade.DYNAMIC_BODY) as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
        this.shooterContBody.body.setCollideWorldBounds(true);
        this.shooterContBody.body.setBoundsRectangle(new Phaser.Geom.Rectangle(80, 0, 910, 450))
        
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
        this.fpsText = this.add.text(150,20,'').setStyle({fill:'black'});
        this.inputText = this.add.text(150,40,'').setStyle({fill:'black'});
        this.inputText2 = this.add.text(150,60,'').setStyle({fill:'black'});

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

        this.cameras.main.setBounds(0, 0, 1000, 225);
        this.physics.world.setBounds(0, 0, 1000, 450);

        this.staticGrp = this.physics.add.staticGroup();

        this.staticGrp.create(125,158,'ovalBush').
            setBodySize(30,24).setOffset(4,2).setDepth(8);
        this.staticGrp.create(211,158,'ovalBush').
            setBodySize(30,24).setOffset(4,2).setDepth(8);
        this.staticGrp.create(267,148,'ovalBush').
            setBodySize(30,24).setOffset(4,2).setDepth(8);
        this.staticGrp.create(400,201,'rogaBush').
            setBodySize(34,24).setOffset(0,0).setDepth(10);
        this.staticGrp.create(452,192,'rogaBush').
            setBodySize(34,24).setOffset(0,0).setDepth(10);
        this.staticGrp.create(708,196,'rosaBush').
            setBodySize(42,16).setOffset(9,0).setDepth(10);
        this.staticGrp.create(750,202,'rosaBush').
            setBodySize(42,16).setOffset(9,0).setDepth(10);
        this.staticGrp.create(846,199,'rosaBush').
            setBodySize(42,16).setOffset(9,0).setDepth(10);
        this.staticGrp.create(375,64,'bigTree').
            setBodySize(94,60).setOffset(0,0).setDepth(8);
        this.staticGrp.create(621,50,'midleTree').
            setBodySize(92,60).setOffset(0,0).setDepth(5);
        this.staticGrp.create(945,250,'rectBush').
            setBodySize(42,16).setOffset(0,0).setDepth(5);

        this.bulletsGrp = new Bullets(this)

        this.physics.add.collider(this.staticGrp,this.bulletsGrp,
            (stat:Phaser.Types.Physics.Arcade.GameObjectWithStaticBody,bullet:Bullet)=>{
                this.add.sprite(stat.body.center.x,stat.body.bottom,'bulletStrike0').
                    setDepth(11).anims.play({key:'strike', startFrame:0})
                bullet.body.reset(0,-32);
                bullet.setActive(false).setVisible(false);
        })

        this.bigBulletsGrp = this.physics.add.staticGroup()
        this.bigBulletsGrp.create(94,426,'bigBullet').setData('isFull',true)
        this.bigBulletsGrp.create(790,426,'bigBullet').setData('isFull',true)

        this.physics.add.overlap(this.shooterCont, this.bigBulletsGrp,
            (shooterCont, bigBullet: Phaser.Types.Physics.Arcade.GameObjectWithStaticBody) => {
                if (this.shootBullets <= 50 && bigBullet.getData('isFull')) {
                    this.shootBullets += 50
                    bigBullet.setData('isFull', false)
                    bigBullet.body.reset(-100, 0)
                    bigBullet.setActive(false)
                    this.rightBulletArs.isCropped = false
                    if (this.shootBullets >= 60) {
                        let offset = Math.round(33 - 33 * (this.shootBullets - 50) / 50)
                        this.leftBulletArs.setCrop(0, offset, 13, 33 - offset)
                    }
                }
            })

        const { world } = this.physics;
        this.bulettCounter = 0;
        this.shootOn = false
        
        this.enemies = new Enemies(this.bulletsGrp);

        this.enemies.createGroup('loner',0,0,0)

        this.railway = this.physics.add.staticImage(44,225,'railway');
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.time.addEvent({ delay: 500, callback: () => this.checkBullet(), loop: true });
        this.rwExplode = this.add.sprite(43,225,'empty');

        this.fireGranade =  this.add.image(-100,-100,'fireGranade')

        this.add.tileSprite(500,438,1000,24,'scheben1')
        
        this.cameras.main.startFollow(this.shooterCont)

        this.enemiesIsStoped = false
        this.input.addPointer(2)

        this.input.on('pointerdown', (pointer) => {
            if(!this.pointerDownOn) return;
            if (pointer.x < this.shooterCont.x - this.cameras.main.scrollX - 50) {
                this.shooterContBody.body.setAcceleration(-60, 0).setMaxVelocity(60)
                this.inputText.setText('left')
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
                if (this.shootOn) this.inputText.setText('shootOn')
                else this.inputText.setText('shootOff')
            }
        })

        this.pointerDownOn = true;
        globalThis.currentResult = GameState.Gone;
        this.currentGameState = GameState.Gone;
        //this.shootOn = true;
        globalThis.currentScene = this;
        globalThis.currentSceneName = "loner";
        this.shootBullets = 100;
    }

    update(time: number, delta: number): void {
        let deltaX:number =0;
        let velocityX:number = 0;

        let nLst = this.input.listeners('pointerdown')
        console.log("numListeners "+this.input.listenerCount("pointerdown"))

        // если все враги уничтожены (GameState.Win) или состав взорван (GameState.Lost),
        // но игра ещё не остановлена (!this.enemiesIsStoped), завершаем её
        if ((this.currentGameState == GameState.Win || this.currentGameState == GameState.Lost)
            && !this.enemiesIsStoped) {
            this.pointerDownOn = false;

            globalThis.currentResult = this.currentGameState;
            globalThis.currentLevel = lvlNames.Loner;
            
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
                let numMsg;
                
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
                    // this.timeActionArr.push(Math.round(time))
                    // this.counterActionArr.push(this.updateCounter)
                    // this.keyActionArr.push('u')
                    // this.vActionArr.push(this.shooter.body.velocity.x)
                    // this.xActionArr.push(this.shooter.body.x)
                    // this.shootActionArr.push(this.shootOn ? 1 : 0)
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
                this.shooterContBody.body.setAcceleration(-60, 0).setMaxVelocity(60)
                    // this.timeActionArr.push(Math.round(time))
                    // this.counterActionArr.push(this.updateCounter)
                    // this.keyActionArr.push('l')
                    // this.vActionArr.push(this.shooter.body.velocity.x)
                    // this.xActionArr.push(this.shooter.body.x)
                    // this.shootActionArr.push(this.shootOn ? 1 : 0)
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
                this.shooterContBody.body.setAcceleration(60, 0).setMaxVelocity(60)
                    // this.timeActionArr.push(Math.round(time))
                    // this.counterActionArr.push(this.updateCounter)
                    // this.keyActionArr.push('r')
                    // this.vActionArr.push(this.shooter.body.velocity.x)
                    // this.xActionArr.push(this.shooter.body.x)
                    // this.shootActionArr.push(this.shootOn ? 1 : 0)
            }
        }
        // else if((this.currentGameState != GameState.Gone) && !this.gameState.waitAction){
        //     // извлекаем номер очередного фрейма, в котором следует что-то совершить 
        //     let numFrame = this.counterActionArr[this.indCounterArr]
        //     if(numFrame == this.updateCounter){
        //         // один и тот же номер фрейма может находится в соседних ячейках
        //         // массива, если в момент воспроизведения этого фрейма была
        //         // нажата не одна клавиша
        //         while(numFrame == this.counterActionArr[this.indCounterArr]){
        //             switch(this.keyActionArr[this.indCounterArr]){
        //                 case 'u':
        //                     this.shootOn = this.shootActionArr[this.indCounterArr] == 1?
        //                         true:false;
        //                     break;
        //                 case 'l':
        //                     this.shooter.setAcceleration(-60, 0).setMaxVelocity(60)
        //                     break;
        //                 case 'r':
        //                     this.shooter.setAcceleration(60, 0).setMaxVelocity(60)
        //                     break;
        //             }
        //             if(this.indCounterArr+1 < this.counterActionArr.length){
        //                 this.indCounterArr++;
        //             }else{
        //                 //this.gameState.waitAction = true
        //                 break;
        //             }
        //         }
        //     }
        // }

        this.infoText.setText(currentTexts.ammo +`: ${this.shootBullets}`)
        //this.fpsText.setText(` fps:  ${Math.round(1000/delta)}`)
        this.fpsText.setText(` Num listeners:  ${this.input.listenerCount("pointerdown")}`)
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
                    this.railway.setTexture('blackRailway');
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
                                this.bigBulletsGrp.getChildren().forEach((child) =>{
                                    if(child.getData("isFull")) numRemBullets += 50;
                                })
                                numRemBullets += this.shootBullets;
                                
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
        if (this.delayChecker == 10) {
        }

        // delayChecker до полного истребления всех диверсов первой волны
        // достигалось 290, 300, 417,306, после тренировок ~ 230 
        this.currentGameState = this.enemies.handleUpdate();
        if (this.currentGameState != GameState.Gone) {
            let data: string[] = []
            data.push(this.timeActionArr.join())
            data.push(this.counterActionArr.join())
            data.push(this.keyActionArr.join())
            data.push(this.shootActionArr.join())
            data.push(this.vActionArr.join())
            data.push(this.xActionArr.join())

            // saveActions(JSON.stringify(data))
            // this.gameState.needToSave = false
        }
    }
}