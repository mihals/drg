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
export default class Demo extends Phaser.Scene
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
    staticLayer:Phaser.GameObjects.Layer
    infoText:Phaser.GameObjects.Text
    fpsText:Phaser.GameObjects.Text
    inputText:Phaser.GameObjects.Text
    numBullets:number = 0;
    //blankShot:Phaser.GameObjects.Sprite

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
        this.load.image('bg','assets/bg5.png')
        this.load.image('railway','assets/railway4_B.png')
        this.load.image('gun','assets/gun1.png')
        this.load.image('bullet','assets/bullet0.png')
        this.load.image('bigBullet','assets/bigBullet4.png')
        this.load.image('bulletArs','assets/bulletArs.png')
        this.load.image('circleBullet','assets/circleBullet0.png')
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
        
        this.load.image('bmp','assets/bmp.png')
        this.load.image('bmp1','assets/bmp1.png')
        this.load.image('bmp2','assets/bmp2.png')
        this.load.image('bmp3','assets/bmp3.png')
        //this.load.image('bigEllowBush','assets/bigEllowBush.png')
        //this.load.image('smallYellowBush','assets/smallYellowBush.png')
        //this.load.image('hills','assets/hills.png')
        

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
        this.load.image('bigTree','assets/bigTree_B.png')
        this.load.image('midleTree','assets/midleTree_B.png')
        this.load.image('rogaBush','assets/rogaBush_B.png')
        this.load.image('rosaBush','assets/rosaBush_B.png')
        this.load.image('ovalBush','assets/ovalBush_B.png')
        //this.load.image('scheben','assets/scheben.png')
        this.load.image('scheben1','assets/scheben10.png')

        this.load.image('bulletStrike0','assets/bulletStrike0a.png')
        this.load.image('bulletStrike1','assets/bulletStrike1a.png')
        this.load.image('bulletStrike2','assets/bulletStrike2a.png')
        this.load.image('bulletStrike3','assets/bulletStrike3a.png')
        this.load.image('bulletStrike4','assets/bulletStrike4a.png')
        this.load.image('bulletStrike5','assets/bulletStrike5a.png')
        this.load.image('blankShoot','assets/blankShoot.png')
        

        this.load.image('empty','assets/empty.png')
    }

    create ()
    {
        //this.blankShoot = this.add.sprite(400,250,'blankShoot').setDepth(12)
        this.gameIsGone = true;
        // let anim = this.anims.create({
        //     key: 'blankShoot',
        //     frames: [
        //         { key: 'bulletStrike0' },
        //         { key: 'bulletStrike5' },
        //         { key: 'empty' }
        //     ],
        //     frameRate: 3,
        //     repeat: -1
        // });
        this.input.on('pointerdown',(pointer)=>{
                if(pointer.x <this.shooter.x -this.cameras.main.scrollX -50){
                     this.shooter.setAcceleration(-60,0).setMaxVelocity(60)
                     this.inputText.setText('left')
                     return
                }
                if(pointer.x > this.shooter.x -this.cameras.main.scrollX +50){
                    this.shooter.setAcceleration(60,0).setMaxVelocity(60) 
                    this.inputText.setText('right')
                    return
                }
                this.shootOn = !this.shootOn
                this.inputText.setText('shootOn')
        })

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
                        //let reader = response.body.getReader()
                        //reader.read().then(response =>{
                        //    this.gameIsGone =false;
                        //})

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
        
        // this.lr20 = this.add.layer().setDepth(0)
        // this.lr60 = this.add.layer().setDepth(1)
        // this.lrTrees = this.add.layer().setDepth(2)
        // this.lr100 = this.add.layer().setDepth(3)
        // this.lr140 = this.add.layer().setDepth(4)
        // this.lrOvalBush = this.add.layer().setDepth(5)
        // this.lrRosaBush = this.add.layer().setDepth(6);
        // this.lr180 = this.add.layer().setDepth(7)
        // this.lrRogaBush = this.add.layer().setDepth(8);
        // this.lr220 = this.add.layer().setDepth(9)

        
        this.infoText = this.add.text(50,0,'',{fill:'black'});
        this.fpsText = this.add.text(50,20,'',{fill:'black'});
        this.inputText = this.add.text(50,40,'',{fill:'black'});

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

        //this.staticLayer = new Phaser.GameObjects.Layer(this)
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

        //this.staticLayer = this.add.layer(this.staticGrp.getChildren());

        this.bulletsGrp = new Bullets(this)

        this.physics.add.collider(this.staticGrp,this.bulletsGrp,
            (stat:Phaser.Types.Physics.Arcade.GameObjectWithStaticBody,bullet:Bullet)=>{
                this.add.sprite(stat.body.center.x,stat.body.bottom,'bulletStrike0').
                    setDepth(11).anims.play({key:'strike', startFrame:0})
                bullet.body.reset(0,-32);
                bullet.setActive(false).setVisible(false);
        })

        // this.add.rectangle(2400,200,24,24,0xff0000)
        // this.add.rectangle(1200,200,24,24,0xff0000)
        // this.add.rectangle(0,200,24,24,0xff0000)
        this.shooter = this.physics.add.image(400,418,'gun');
        this.shooter.body.setCollideWorldBounds(true);
        this.shooter.body.setBoundsRectangle(new Phaser.Geom.Rectangle(90, 0, 910, 450))

        this.bigBulletsGrp = this.physics.add.staticGroup()
        this.bigBulletsGrp.create(94,426,'bigBullet').setData('isFull',true)
        this.bigBulletsGrp.create(790,426,'bigBullet').setData('isFull',true)

        this.physics.add.overlap(this.shooter,this.bigBulletsGrp,
            (shooter,bigBullet: Phaser.Types.Physics.Arcade.GameObjectWithStaticBody)=>{
            if(this.shootBullets<=50 && bigBullet.getData('isFull')){
                 this.shootBullets+=50
                 bigBullet.setData('isFull',false)
                 bigBullet.body.reset(-100,0)
                 bigBullet.setActive(false)
                 
            }
        })

        //this.physics.world.co
        const { world } = this.physics;
        this.bulettCounter = 0;
        this.shootOn = false
        
        this.enemies = new Enemies(this);
        // временно закомментированные волкеры первого этапа (первой волны)
        // this.enemies.createGroup('oneColumn',6,450,20);
        // this.enemies.createGroup('oneColumn',5,550,60);
        // this.enemies.createGroup('oneColumn',4,480,100);
        // this.enemies.createGroup('oneColumn',3,530,140);
        // this.enemies.createGroup('oneColumn',2,510,180);
        // this.enemies.createGroup('oneColumn',1,420,220);

        // this.enemies.createGroup('oneColumn',7,950,60);
        // this.enemies.createGroup('oneColumn',6,880,100);
        // this.enemies.createGroup('oneColumn',5,930,140);
        // this.enemies.createGroup('oneColumn',4,910,180);
        // this.enemies.createGroup('oneColumn',3,820,220);

        // this.enemies.createGroup('oneColumn',4,1350,60);
        // this.enemies.createGroup('oneColumn',4,1280,100);
        // this.enemies.createGroup('oneColumn',4,1330,140);
        // this.enemies.createGroup('oneColumn',5,1310,180);
        // this.enemies.createGroup('oneColumn',4,120,220);

        this.enemies.createGroup('oneColumn',0,0,0)

        this.railway = this.physics.add.staticImage(44,225,'railway');
        //this.add.image(0,422,'scheben')
        //this.add.image(350,160,'treeOak');
        //this.add.image(450,260,'treeOak2');
        
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

        this.add.tileSprite(500,438,1000,24,'scheben1')
        //this.add.tileSprite(500,442,1000,48,'scheben1')
        this.cameras.main.startFollow(this.shooter)
        if(this.gameState.autoPilot) this.scene.pause()
    }

    update(time: number, delta: number): void {
        let deltaX:number =0;
        let velocityX:number = 0;
        let boolToInt = this.shootOn? 1:0;
        this.updateCounter++

        if (!this.gameState.autoPilot) {
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
                this.shooter.setAcceleration(-60, 0).setMaxVelocity(60)
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
                this.shooter.setAcceleration(60, 0).setMaxVelocity(60)
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
        else if(!this.gameState.waitAction){
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

    checkBullet(){
        if(this.shootOn){
            if(this.shootBullets>0){
            this.bulletsGrp.fireBullet(this.shooter.x,this.shooter.y-15,
                this.shooter.body.velocity.x)
            this.shootBullets--;
            }else{
                //this.blankShot.setPosition(this.shooter.x,this.shooter.y-15).play({key:'blankShoot',startFrame:0})
                this.bulletsGrp.fireBlank(this.shooter.x,this.shooter.y-15,
                    this.shooter.body.velocity.x)
            }
        }
        this.delayChecker++;
        if(this.delayChecker ==10){
             //this.physics.pause()
        }

        // delayChecker до полного истребления всех диверсов первой волны
        // досигалось 290, 300, 417,306, после тренировок ~ 230 
        this.gameIsGone = this.enemies.handleUpdate();
        if(!this.gameIsGone && this.gameState.needToSave){
            let data:string[] = []
            data.push(this.timeActionArr.join())
            data.push(this.counterActionArr.join())
            data.push(this.keyActionArr.join())
            data.push(this.shootActionArr.join())
            data.push(this.vActionArr.join())
            data.push(this.xActionArr.join())
            

            saveActions(JSON.stringify(data))
            this.gameState.needToSave = false
            //this.isActionFetched = true
            //if(res == true){

            //}
        }
        // if(!res && this.gameIsGone){
        //     this.gameIsGone = false;
        //     this.rwExplode.play({key:'rwExplode',startFrame:0});
        //         this.rwExplode.on(Phaser.Animations.Events.ANIMATION_COMPLETE,
        //         () =>{
        //             this.railway.setTexture('blackRailway');
        //             this.explodeTween.play();
        //         })
        // }
    }

    
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
            gravity: { y: 0 }
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
