/*
 пули из шутера вылетают каждые полсекунды, скорость пули 300 пикселей в секунду
 по оси Y, стартуя с y = 412 (координата центра пули), за эти полсекунды каждая группа
 продвигается на 4 пиксела. Максимальная скорость самого шутера 60 пкс/сек, вражьи 
 колонны движутся начиная с 20 пкс сверху с интервалом кратным 40 пкс
 На первой сверху тропе движущийся с постоянной скоростью шутер выбивает 4-5 диверсов 
 из 10, на второй тропе - столько же, на третьей тропе выбивает 5-6 диверсов, столько
 же на 4,5 и 6-ой причём достигается стопроцентное попадание при равномерном движении
 шутера
*/
import * as Phaser from 'phaser';
import Walkers from './walkers';
import { Walker } from './walkers';
import { EnemyGrp } from './walkers';
import { Enemies } from './Enemies';
 
let glPreviewMode:boolean
export class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'bullet');
    }

    fire (x, y, velocityX)
    {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocity(velocityX, -300);
        (this.scene as Demo).numBullets++
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.y <= -32)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

class Bullets extends Phaser.Physics.Arcade.Group
{
    myScene: Phaser.Scene
    blankShot:Phaser.Physics.Arcade.Sprite
    constructor (scene:Phaser.Scene)
    {
        super(scene.physics.world, scene);
        //this.myScene
        
        this.createMultiple({
            frameQuantity: 5,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Bullet
        });

        let anim = scene.anims.create({
            key: 'blankShoot',
            frames: [
                { key: 'empty' },
                { key: 'blankShoot' },
                { key: 'empty' }
            ],
            frameRate: 5,
        });
        //console.log(anim)
        this.blankShot = scene.physics.add.sprite(-100,-100,'empty').setDepth(12)
    }

    fireBullet (x, y, velocityX)
    {
        const bullet = this.getFirstDead(false);

        if (bullet)
        {
            bullet.fire(x, y, velocityX);
        }
    }

    fireBlank(x, y, velocityX){
        this.blankShot.body.reset(x-3,y-10)
        this.blankShot.play({key:'blankShoot',startFrame:0})
        this.blankShot.setVelocityX(velocityX)
    }
}
export class Demo extends Phaser.Scene
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
    gameState: {autoPilot:boolean; waitAction:boolean; needToSave:boolean} 
    gameIsGone: boolean ;
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
    numBullets:number = 0;
    shooterCont:Phaser.GameObjects.Container
    shooterContBody:Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody
    leftBulletArs:Phaser.GameObjects.Image
    rightBulletArs:Phaser.GameObjects.Image
    blankShot:Phaser.GameObjects.Sprite
    fireGranade:Phaser.GameObjects.Image

    /** Уровни для колонн и кустов */
    // lr20:Phaser.GameObjects.Layer;lr60:Phaser.GameObjects.Layer
    // lr100:Phaser.GameObjects.Layer;lr140:Phaser.GameObjects.Layer
    // lr180:Phaser.GameObjects.Layer;lr220:Phaser.GameObjects.Layer
    // lrTrees:Phaser.GameObjects.Layer;lrOvalBush:Phaser.GameObjects.Layer;
    // lrRogaBush:Phaser.GameObjects.Layer;lrRosaBush:Phaser.GameObjects.Layer;

    constructor ()
    {
        super('demo');
        this.shootBullets =100
        this.gameState = {autoPilot: false,waitAction: false, needToSave:false}
        this.shootOn = false;
        //this.actionArr = []
        this.timeActionArr = []
        this.counterActionArr = []
        this.keyActionArr = []
        this.vActionArr = []
        this.xActionArr = []
        this.shootActionArr = []
        
    }    

    preload ()
    {
        
    }

    create ()
    {
        this.extractFromCache()
        this.gameIsGone = true;
        let bc:Phaser.Cache.BaseCache = (window as any).baseCache
        if (bc.exists("atlasImg") && bc.exists("atlasJson")) {
            console.log("Create.Basecache has atlas");
            this.textures.addAtlasJSONHash("atlas", bc.get("atlasImg"),
            bc.get("atlasJson"));
          }
        
        

        if (this.gameState.autoPilot) {
            this.gameState.waitAction = true
            let response = fetch('http://localhost/drgServer/get_actions.php',
                {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Origin': 'https://localhost/drg'
                    },
                    body: ('data=')
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then((data : {a_time:string, id:string, is_shoot:string,
                    key_code:string, update_cntr:string, v:string,x:string}) => {
                    this.timeActionArr = data.a_time.split(',').
                        map((val)=>Number(val))
                    this.counterActionArr = data.update_cntr.split(',').
                        map((val)=>Number(val))
                    this.keyActionArr = data.key_code.split(',')
                    this.shootActionArr = data.is_shoot.split(',').
                        map((val)=>Number(val))
                    this.vActionArr = data.v.split(',').map((val)=>Number(val))
                    this.xActionArr = data.x.split(',').map((val)=>Number(val))
                    if(this.keyActionArr.length != 0){
                        this.gameState.waitAction = false
                        this.indCounterArr = 0
                    }
                    
                    this.scene.resume()
                })
        }
        
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
        
        this.infoText = this.add.text(50,0,'').setStyle({fill:'black'});
        this.fpsText = this.add.text(50,20,'').setStyle({fill:'black'});
        this.inputText = this.add.text(50,40,'').setStyle({fill:'black'});

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
        
        this.enemies = new Enemies(this);

        this.enemies.createGroup('oneColumn',0,0,0)

        this.railway = this.physics.add.staticImage(44,225,'railway');
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.time.addEvent({ delay: 500, callback: () => this.checkBullet(), loop: true });
        this.rwExplode = this.add.sprite(43,225,'empty');
        this.explodeTween = this.tweens.add({
            targets: this.rwExplode,
            alpha: 0,
            duration: 2000,
            persist: true,
            paused: true,
        });

        this.fireGranade =  this.add.image(-100,-100,'fireGranade')
        this.flyingGranad = this.tweens.add({
            targets : this.fireGranade,
            x:50,
            duration:1000,
            paused:true,
            onComplete: () =>{
                this.rwExplode.play({key:'rwExplode',startFrame:0})
                this.rwExplode.on(Phaser.Animations.Events.ANIMATION_COMPLETE,() =>{
                this.railway.setTexture('blackRailway');
                this.explodeTween.play();
            })}
        })

        this.add.tileSprite(500,438,1000,24,'scheben1')
        
        this.cameras.main.startFollow(this.shooterCont)
        if(this.gameState.autoPilot) this.scene.pause()
        if(!glPreviewMode) this.turnOnInput()
        else this.showPreview()
    }

    update(time: number, delta: number): void {
        let deltaX:number =0;
        let velocityX:number = 0;
        
        if(!this.gameIsGone && !this.physics.world.isPaused){
            this.physics.pause()
            let point = this.enemies.stopEnemies()
            this.fireGranade.setPosition(point.x-16,point.y-16)
            this.flyingGranad.play()
        }

        let boolToInt = this.shootOn? 1:0;
        this.updateCounter++

        if (!glPreviewMode && !this.gameState.autoPilot) {
            if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
                this.shootOn = !this.shootOn
                if(this.gameState.needToSave){
                    this.timeActionArr.push(Math.round(time))
                    this.counterActionArr.push(this.updateCounter)
                    this.keyActionArr.push('u')
                    this.vActionArr.push(this.shooter.body.velocity.x)
                    this.xActionArr.push(this.shooter.body.x)
                    this.shootActionArr.push(this.shootOn ? 1 : 0)
                }
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
                this.shooterContBody.body.setAcceleration(-60, 0).setMaxVelocity(60)
                if(this.gameState.needToSave){
                    this.timeActionArr.push(Math.round(time))
                    this.counterActionArr.push(this.updateCounter)
                    this.keyActionArr.push('l')
                    this.vActionArr.push(this.shooter.body.velocity.x)
                    this.xActionArr.push(this.shooter.body.x)
                    this.shootActionArr.push(this.shootOn ? 1 : 0)
                }
            }

            if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
                this.shooterContBody.body.setAcceleration(60, 0).setMaxVelocity(60)
                if(this.gameState.needToSave){
                    this.timeActionArr.push(Math.round(time))
                    this.counterActionArr.push(this.updateCounter)
                    this.keyActionArr.push('r')
                    this.vActionArr.push(this.shooter.body.velocity.x)
                    this.xActionArr.push(this.shooter.body.x)
                    this.shootActionArr.push(this.shootOn ? 1 : 0)
                }
            }
        }
        else if(!glPreviewMode && !this.gameState.waitAction){
            // извлекаем номер очередного фрейма, в котором следует что-то совершить 
            let numFrame = this.counterActionArr[this.indCounterArr]
            if(numFrame == this.updateCounter){
                // один и тот же номер фрейма может находится в соседних ячейках
                // массива, если в момент воспроизведения этого фрейма была
                // нажата не одна клавиша
                while(numFrame == this.counterActionArr[this.indCounterArr]){
                    switch(this.keyActionArr[this.indCounterArr]){
                        case 'u':
                            this.shootOn = this.shootActionArr[this.indCounterArr] == 1?
                                true:false;
                            break;
                        case 'l':
                            this.shooter.setAcceleration(-60, 0).setMaxVelocity(60)
                            break;
                        case 'r':
                            this.shooter.setAcceleration(60, 0).setMaxVelocity(60)
                            break;
                    }
                    if(this.indCounterArr+1 < this.counterActionArr.length){
                        this.indCounterArr++;
                    }else{
                        this.gameState.waitAction = true
                        break;
                    }
                }
            }
        }

        this.infoText.setText(`num bullets: ${this.shootBullets}`)
        this.fpsText.setText(` fps:  ${Math.round(1000/delta)}`)
    }

    /** включается обработка управления с тачскрина, если игра не
     * в режиме презентации
     */
    turnOnInput() {
        this.input.on('pointerdown', (pointer) => {
            if (pointer.x < this.shooterCont.x - this.cameras.main.scrollX - 50) {
                this.shooterContBody.body.setAcceleration(-60, 0).setMaxVelocity(60)
                this.inputText.setText('left')
                return
            }
            if (pointer.x > this.shooterCont.x - this.cameras.main.scrollX + 50) {
                this.shooterContBody.body.setAcceleration(60, 0).setMaxVelocity(60)
                this.inputText.setText('right')
                return
            }
            this.shootOn = !this.shootOn
            this.inputText.setText('shootOn')
        })
    }

    showPreview(){
        let bubble = this.add.graphics({x:0, y:0})
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
        this.add.image(400,36,'captionBubble').setDepth(21)
        bubble.clear()

        let captionStyle:Phaser.Types.GameObjects.Text.TextStyle =
            {fontFamily:"Roboto, Arial", fontSize: '30px', fontStyle: 'bold',
            color: '#ff0000'}
        let capTxt = this.add.text(200,16,'Управление на тачскрине:',captionStyle).setDepth(22);
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
        const leftBubbleTxt = this.add.text(0, 0, 'Жмите слева от орудия, чтобы двигаться влево.',
          { fontFamily: 'Arial, Roboto', fontStyle:'bold', fontSize: '24px', color: '#000000', align: 'center', wordWrap: { width: 278 } });
        
        let txtBnd = leftBubbleTxt.getBounds()
        //console.log(txtBnd)
        leftBubbleTxt.setPosition(bubbleImg.x - leftBubbleTxt.width/2 - 5,
            bubbleImg.y - txtBnd.height/2 - 5).setDepth(22).setAlpha(0)

        txtBnd = leftBubbleTxt.getBounds()
        const rightBubbleTxt = this.add.text(0, 0, 'Жмите справа от орудия, чтобы двигаться вправо.',
            { fontFamily: 'Arial, Roboto', fontStyle:'bold', fontSize: '24px', color: '#000000', align: 'center', wordWrap: { width: 278 } });
        rightBubbleTxt.setPosition(634 - rightBubbleTxt.width/2 - 5,
            154 - txtBnd.height/2 - 5).setDepth(22).setAlpha(0)

        const centerBubbleTxt = this.add.text(0, 0, 'Чтобы начать или закончить стрельбу, жмите над орудием.',
        { fontFamily: 'Arial, Roboto', fontStyle:'bold', fontSize: '24px', color: '#000000', align: 'center', wordWrap: { width: 278 }})
        centerBubbleTxt.setPosition(400 - centerBubbleTxt.width/2 - 5,
            154 - centerBubbleTxt.height/2 - 5).setDepth(22).setAlpha(0)

        // цепочка для текста и подложек для него
        this.tweens.chain({
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
            tweens: [
                
                {
                    targets: this.shooterCont,
                    props: {
                        x:{value: 200}
                    },
                    duration: 1500,
                    delay:1800 
                },
                {
                    targets: this.shooterCont,
                    props: {
                        x:{value: 400}
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
                        capTxt.setText("Управление с клавиатуры.")
                    }
                },
                {
                    targets: capTxt,
                    props:{
                        alpha:{value:1}
                    },
                    duration:300,
                    onComplete: () => {
                        centerBubbleTxt.setText("Клавиша со стрелкой вверх начинает или заканчивает стрельбу, со стрелками вправо и влево двигают орудие.")
                        centerBubbleTxt.setFontSize('20px')
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
                    duration:300,
                    onComplete: () => {
                        capTxt.setText("Не дайте им пройти!")
                    }
                },
                {
                    targets: capTxt,
                    props:{
                        alpha:{value:1}
                    },
                    duration:300
                }
            ]
        })

        return
    }

    checkBullet() {
        if (!this.gameIsGone) return
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
        this.gameIsGone = this.enemies.handleUpdate();
        if (!this.gameIsGone && this.gameState.needToSave) {
            let data: string[] = []
            data.push(this.timeActionArr.join())
            data.push(this.counterActionArr.join())
            data.push(this.keyActionArr.join())
            data.push(this.shootActionArr.join())
            data.push(this.vActionArr.join())
            data.push(this.xActionArr.join())

            saveActions(JSON.stringify(data))
            this.gameState.needToSave = false
        }
    }

    extractFromCache() {
        const globalCache:Phaser.Cache.BaseCache = (window as any).baseCache

        this.textures.addImage('bg',globalCache.get('bg'))
        this.textures.addImage('railway',globalCache.get('railway'))
        this.textures.addImage('gun',globalCache.get('gun'))
        this.textures.addImage('bullet',globalCache.get('bullet'))
        this.textures.addImage('bigBullet',globalCache.get('bigBullet'))
        this.textures.addImage('bulletArs',globalCache.get('bulletArs'))
        this.textures.addImage('circleBullet',globalCache.get('circleBullet'))
        this.textures.addImage('fireGranade',globalCache.get('fireGranade'))
        this.textures.addImage('virusOff',globalCache.get('virusOff'))
        this.textures.addImage('walker0',globalCache.get('walker0'))
        this.textures.addImage('walker1',globalCache.get('walker1'))
        this.textures.addImage('walker2',globalCache.get('walker2'))
        this.textures.addImage('walker3',globalCache.get('walker3'))
        this.textures.addImage('walker4',globalCache.get('walker4'))
        this.textures.addImage('runner0',globalCache.get('runner0'))
        this.textures.addImage('runner1',globalCache.get('runner1'))
        this.textures.addImage('runner2',globalCache.get('runner2'))
        this.textures.addImage('runner3',globalCache.get('runner3'))
        this.textures.addImage('runner4',globalCache.get('runner4'))
        this.textures.addImage('failed0',globalCache.get('failed0'))
        this.textures.addImage('failed1',globalCache.get('failed1'))
        this.textures.addImage('granade',globalCache.get('granade'))
        this.textures.addImage('standStay',globalCache.get('standStay'))
        this.textures.addImage('sitStay',globalCache.get('sitStay'))
        this.textures.addImage('handStay',globalCache.get('handStay'))
        this.textures.addImage('stepStay',globalCache.get('stepStay'))
        this.textures.addImage('gunStay',globalCache.get('gunStay'))

        // this.textures.addImage('bmp',globalCache.get('bmp'))
        // this.textures.addImage('bmp1',globalCache.get('bmp1'))
        // this.textures.addImage('bmp2',globalCache.get('bmp2'))
        // this.textures.addImage('bmp3',globalCache.get('bmp3'))

        this.textures.addImage('blackRailway',globalCache.get('blackRailway'))
        this.textures.addImage('explode1',globalCache.get('explode1'))
        this.textures.addImage('explode2',globalCache.get('explode2'))
        this.textures.addImage('explode3',globalCache.get('explode3'))
        this.textures.addImage('explode4',globalCache.get('explode4'))
        this.textures.addImage('explode5',globalCache.get('explode5'))
        this.textures.addImage('explode6',globalCache.get('explode6'))
        this.textures.addImage('explode7',globalCache.get('explode7'))
        this.textures.addImage('explode8',globalCache.get('explode8'))
        this.textures.addImage('explode9',globalCache.get('explode9'))
        this.textures.addImage('explode10',globalCache.get('explode10'))
        this.textures.addImage('explode11',globalCache.get('explode11'))
        this.textures.addImage('explode12',globalCache.get('explode12'))
        this.textures.addImage('explode13',globalCache.get('explode13'))
        this.textures.addImage('explode14',globalCache.get('explode14'))
        this.textures.addImage('explode15',globalCache.get('explode15'))
        this.textures.addImage('explode16',globalCache.get('explode16'))
        this.textures.addImage('explode17',globalCache.get('explode17'))
        this.textures.addImage('explode18',globalCache.get('explode18'))
        this.textures.addImage('explode19',globalCache.get('explode19'))
        this.textures.addImage('explode20',globalCache.get('explode20'))
        this.textures.addImage('explode21',globalCache.get('explode21'))
        this.textures.addImage('explode22',globalCache.get('explode22'))
        this.textures.addImage('explode23',globalCache.get('explode23'))

        this.textures.addImage('bigTree',globalCache.get('bigTree'))
        this.textures.addImage('midleTree',globalCache.get('midleTree'))
        this.textures.addImage('rogaBush',globalCache.get('rogaBush'))
        this.textures.addImage('rosaBush',globalCache.get('rosaBush'))
        this.textures.addImage('ovalBush',globalCache.get('ovalBush'))

        this.textures.addImage('bulletStrike0',globalCache.get('bulletStrike0'))
        this.textures.addImage('bulletStrike1',globalCache.get('bulletStrike1'))
        this.textures.addImage('bulletStrike2',globalCache.get('bulletStrike2'))
        this.textures.addImage('bulletStrike3',globalCache.get('bulletStrike3'))
        this.textures.addImage('bulletStrike4',globalCache.get('bulletStrike4'))
        this.textures.addImage('bulletStrike5',globalCache.get('bulletStrike5'))
        this.textures.addImage('blankShoot',globalCache.get('blankShoot'))
        this.textures.addImage('scheben1',globalCache.get('scheben1'))

        this.textures.addImage('empty',globalCache.get('empty'))
        this.textures.addImage('hand',globalCache.get('hand'))
        return
    }
}

export function startGame(previewMode:boolean){
    glPreviewMode = previewMode;

    const config = {
    
        type: Phaser.CANVAS,
        transparent: true,
        //backgroundColor: '#ffffff',
        width: 800,
        height: 450,
        parent: 'gameContainer',
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
            }
        },
        scale: {
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            mode: Phaser.Scale.FIT
          },
        scene: Demo,
        //render :render,
    };
    const game = new Phaser.Game(config);
}

function saveActions(data) {
    // при получении данных с beget эта строчка должна быть раскомментирована
    //let response = await fetch('https://galogame.ru/php/get_lvl_lead.php',
    //C:\Server\data\htdocs\tutor1Server
    //let data:string[]
    //data.push(timeA)
    let response = fetch('http://localhost/drgServer/set_actions.php',
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin':'https://localhost/drg'
            },
            body: ('data=' + data)
        }).then()
    
    //return false
}

(window as any).baseCache = new Phaser.Cache.BaseCache()

// class Preview extends Phaser.Scene
// {
//     shooterCont:Phaser.GameObjects.Container
//     leftBulletArs:Phaser.GameObjects.Image
//     rightBulletArs:Phaser.GameObjects.Image
//     railway:Phaser.GameObjects.Image

//     constructor(){
//         super("preview")
//     }

//     create(){
//         this.extractFromCache();
//         this.shooterCont = this.add.container(400,418);
//         this.add.tileSprite(500,225,1000,450,'bg')
//         this.railway = this.physics.add.staticImage(44,225,'railway');
//         this.shooterCont = this.add.container(400,418);
//         this.shooterCont.add(this.add.image(0,0,'gun'))
        
//         this.leftBulletArs = this.add.image(-16,3,'bulletArs');
//         this.shooterCont.add(this.leftBulletArs)
//         this.rightBulletArs = this.add.image(16,3,'bulletArs');
//         this.shooterCont.add(this.rightBulletArs)
//         this.shooterCont.setSize(80,40)
//     }

//     extractFromCache(){
//         const globalCache:Phaser.Cache.BaseCache = (window as any).baseCache
//         this.textures.addImage('bg',globalCache.get('bg'))
//         this.textures.addImage('gun',globalCache.get('gun'))
//         this.textures.addImage('bulletArs',globalCache.get('bulletArs'))
//         this.textures.addImage('railway',globalCache.get('railway'))
//     }
// }

export function loadAtlas(){
    function preload(){
        // this.load.atlas('atlas','assets/atlas.png','assets/atlas.json')
        // this.load.json("json", 'assets/atlas.json')

        this.load.image('bg','assets/bg5.png')
        this.load.image('railway','assets/railway4.png')
        this.load.image('gun','assets/gun1.png')
        this.load.image('bullet','assets/bullet0.png')
        this.load.image('bigBullet','assets/bigBullet4.png')
        this.load.image('bulletArs','assets/bulletArs.png')
        this.load.image('circleBullet','assets/circleBullet0.png')
        this.load.image('fireGranade','assets/circleBullet.png')
        this.load.image('virusOff','assets/virusOff.png')
        this.load.image('walker0','assets/walker0b.png')
        this.load.image('walker1','assets/walker1b.png')
        this.load.image('walker2','assets/walker2b.png')
        this.load.image('walker3','assets/walker3b.png')
        this.load.image('walker4','assets/walker4b.png')
        this.load.image('runner0','assets/runner0b.png')
        this.load.image('runner1','assets/runner1b.png')
        this.load.image('runner2','assets/runner2b.png')
        this.load.image('runner3','assets/runner3b.png')
        this.load.image('runner4','assets/runner4b.png')
        this.load.image('failed0','assets/failing0b.png')
        this.load.image('failed1','assets/fallen0b.png')
        this.load.image('granade','assets/granade0a.png')
        this.load.image('standStay','assets/standStay.png')
        this.load.image('sitStay','assets/sitStay.png')
        this.load.image('handStay','assets/handStay.png')
        this.load.image('stepStay','assets/stepStay.png')
        this.load.image('gunStay','assets/gunStay.png')
        
        // this.load.image('bmp','assets/bmp.png')
        // this.load.image('bmp1','assets/bmp1.png')
        // this.load.image('bmp2','assets/bmp2.png')
        // this.load.image('bmp3','assets/bmp3.png')

        this.load.image('blackRailway','assets/blackRailway1.png')
        this.load.image('explode1','assets/explode1.png')
        this.load.image('explode2','assets/explode2.png')
        this.load.image('explode3','assets/explode3.png')
        this.load.image('explode4','assets/explode4.png')
        this.load.image('explode5','assets/explode5.png')
        this.load.image('explode6','assets/explode6.png')
        this.load.image('explode7','assets/explode7.png')
        this.load.image('explode8','assets/explode8.png')
        this.load.image('explode9','assets/explode9.png')
        this.load.image('explode10','assets/explode10.png')
        this.load.image('explode11','assets/explode11.png')
        this.load.image('explode12','assets/explode12.png')
        this.load.image('explode13','assets/explode13.png')
        this.load.image('explode14','assets/explode14.png')
        this.load.image('explode15','assets/explode15.png')
        this.load.image('explode16','assets/explode16.png')
        this.load.image('explode17','assets/explode17.png')
        this.load.image('explode18','assets/explode18.png')
        this.load.image('explode19','assets/explode19.png')
        this.load.image('explode20','assets/explode20.png')
        this.load.image('explode21','assets/explode21.png')
        this.load.image('explode22','assets/explode22.png')
        this.load.image('explode23','assets/explode23.png')
        this.load.image('bigTree','assets/bigTree.png')
        this.load.image('midleTree','assets/midleTree.png')
        this.load.image('rogaBush','assets/rogaBush_B.png')
        this.load.image('rosaBush','assets/rosaBush_B.png')
        this.load.image('ovalBush','assets/ovalBush_B.png')
        this.load.image('scheben1','assets/scheben11.png')

        this.load.image('bulletStrike0','assets/bulletStrike0a.png')
        this.load.image('bulletStrike1','assets/bulletStrike1a.png')
        this.load.image('bulletStrike2','assets/bulletStrike2a.png')
        this.load.image('bulletStrike3','assets/bulletStrike3a.png')
        this.load.image('bulletStrike4','assets/bulletStrike4a.png')
        this.load.image('bulletStrike5','assets/bulletStrike5a.png')
        this.load.image('blankShoot','assets/blankShoot.png')

        this.load.image('empty','assets/empty.png')
        this.load.image('hand','assets/hand.png')
    }

    function create(){
        const globalCache:Phaser.Cache.BaseCache = (window as any).baseCache

        globalCache.add('railway',this.game.textures.get('railway').getSourceImage())
        globalCache.add('bg',this.game.textures.get('bg').getSourceImage())
        globalCache.add('gun',this.game.textures.get('gun').getSourceImage())
        //this.game.pause()

        globalCache.add('bullet',this.game.textures.get('bullet').getSourceImage())
        globalCache.add('bigBullet',this.game.textures.get('bigBullet').getSourceImage())
        globalCache.add('bulletArs',this.game.textures.get('bulletArs').getSourceImage())
        globalCache.add('circleBullet',this.game.textures.get('circleBullet').getSourceImage())
        globalCache.add('fireGranade',this.game.textures.get('fireGranade').getSourceImage())
        globalCache.add('virusOff',this.game.textures.get('virusOff').getSourceImage())
        globalCache.add('walker0',this.game.textures.get('walker0').getSourceImage())
        globalCache.add('walker1',this.game.textures.get('walker1').getSourceImage())
        globalCache.add('walker2',this.game.textures.get('walker2').getSourceImage())
        globalCache.add('walker3',this.game.textures.get('walker3').getSourceImage())
        globalCache.add('walker4',this.game.textures.get('walker4').getSourceImage())
        globalCache.add('runner0',this.game.textures.get('runner0').getSourceImage())
        globalCache.add('runner1',this.game.textures.get('runner1').getSourceImage())
        globalCache.add('runner2',this.game.textures.get('runner2').getSourceImage())
        globalCache.add('runner3',this.game.textures.get('runner3').getSourceImage())
        globalCache.add('runner4',this.game.textures.get('runner4').getSourceImage())
        globalCache.add('failed0',this.game.textures.get('failed0').getSourceImage())
        globalCache.add('failed1',this.game.textures.get('failed1').getSourceImage())
        globalCache.add('granade',this.game.textures.get('granade').getSourceImage())
        globalCache.add('standStay',this.game.textures.get('standStay').getSourceImage())
        globalCache.add('sitStay',this.game.textures.get('sitStay').getSourceImage())
        globalCache.add('handStay',this.game.textures.get('handStay').getSourceImage())
        globalCache.add('stepStay',this.game.textures.get('stepStay').getSourceImage())
        globalCache.add('gunStay',this.game.textures.get('gunStay').getSourceImage())
        
        // globalCache.add('bmp',this.game.textures.get('bmp').getSourceImage())
        // globalCache.add('bmp1',this.game.textures.get('bmp1').getSourceImage())
        // globalCache.add('bmp2',this.game.textures.get('bmp2').getSourceImage())
        // globalCache.add('bmp3',this.game.textures.get('bmp3').getSourceImage())

        globalCache.add('blackRailway',this.game.textures.get('blackRailway').getSourceImage())
        globalCache.add('explode1',this.game.textures.get('explode1').getSourceImage())
        globalCache.add('explode2',this.game.textures.get('explode2').getSourceImage())
        globalCache.add('explode3',this.game.textures.get('explode3').getSourceImage())
        globalCache.add('explode4',this.game.textures.get('explode4').getSourceImage())
        globalCache.add('explode5',this.game.textures.get('explode5').getSourceImage())
        globalCache.add('explode6',this.game.textures.get('explode6').getSourceImage())
        globalCache.add('explode7',this.game.textures.get('explode7').getSourceImage())
        globalCache.add('explode8',this.game.textures.get('explode8').getSourceImage())
        globalCache.add('explode9',this.game.textures.get('explode9').getSourceImage())
        globalCache.add('explode10',this.game.textures.get('explode10').getSourceImage())
        globalCache.add('explode11',this.game.textures.get('explode11').getSourceImage())
        globalCache.add('explode12',this.game.textures.get('explode12').getSourceImage())
        globalCache.add('explode13',this.game.textures.get('explode13').getSourceImage())
        globalCache.add('explode14',this.game.textures.get('explode14').getSourceImage())
        globalCache.add('explode15',this.game.textures.get('explode15').getSourceImage())
        globalCache.add('explode16',this.game.textures.get('explode16').getSourceImage())
        globalCache.add('explode17',this.game.textures.get('explode17').getSourceImage())
        globalCache.add('explode18',this.game.textures.get('explode18').getSourceImage())
        globalCache.add('explode19',this.game.textures.get('explode19').getSourceImage())
        globalCache.add('explode20',this.game.textures.get('explode20').getSourceImage())
        globalCache.add('explode21',this.game.textures.get('explode21').getSourceImage())
        globalCache.add('explode22',this.game.textures.get('explode22').getSourceImage())
        globalCache.add('explode23',this.game.textures.get('explode23').getSourceImage())
        globalCache.add('bigTree',this.game.textures.get('bigTree').getSourceImage())
        globalCache.add('midleTree',this.game.textures.get('midleTree').getSourceImage())
        globalCache.add('rogaBush',this.game.textures.get('rogaBush').getSourceImage())
        globalCache.add('rosaBush',this.game.textures.get('rosaBush').getSourceImage())
        globalCache.add('ovalBush',this.game.textures.get('ovalBush').getSourceImage())
        let a = this.game.textures.get('scheben1')
        let b = a.getSourceImage()
        globalCache.add('scheben1',this.game.textures.get('scheben1').getSourceImage())

        globalCache.add('bulletStrike0',this.game.textures.get('bulletStrike0').getSourceImage())
        globalCache.add('bulletStrike1',this.game.textures.get('bulletStrike1').getSourceImage())
        globalCache.add('bulletStrike2',this.game.textures.get('bulletStrike2').getSourceImage())
        globalCache.add('bulletStrike3',this.game.textures.get('bulletStrike3').getSourceImage())
        globalCache.add('bulletStrike4',this.game.textures.get('bulletStrike4').getSourceImage())
        globalCache.add('bulletStrike5',this.game.textures.get('bulletStrike5').getSourceImage())
        globalCache.add('blankShoot',this.game.textures.get('blankShoot').getSourceImage())

        globalCache.add('empty',this.game.textures.get('empty').getSourceImage())
        globalCache.add('hand',this.game.textures.get('hand').getSourceImage())
        this.game.pause()
        document.getElementById('loaderCont').dispatchEvent(new Event('assetLoaded'))
        return
    }

    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.CANVAS,
        width: 0,
        height: 0,
        parent: 'loaderCont',
        backgroundColor: '#5accff',
        scene: {
            preload:preload,
            create:create
        }
    }

    const myGame = new Phaser.Game(config);
}

