import * as Phaser from 'phaser';
import Walkers from './walkers';
import { Walker } from './walkers';
import { EnemyGrp } from './walkers';

class Bullet extends Phaser.Physics.Arcade.Sprite
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
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 25,
            key: 'bullet',
            active: false,
            visible: false,
            classType: Bullet
        });
    }

    fireBullet (x, y, velocityX)
    {
        const bullet = this.getFirstDead(false);

        if (bullet)
        {
            bullet.fire(x, y, velocityX);
        }
    }
}
export default class Demo extends Phaser.Scene
{
    myCamera:Phaser.Cameras.Scene2D.Camera
    cursors:Phaser.Types.Input.Keyboard.CursorKeys
    shooter:Phaser.GameObjects.Rectangle
    /**скорость стрелка по оси X */
    shooterVX:number
    virusOff:Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    bulletsGrp:Bullets
    //enemyGrp:EnemyGrp
    walkerGrp:Walkers
    //walker:Phaser.GameObjects.Sprite
    /**
     * счетчик - индекс наименьшего неиспользуемого объекта в bulettsArr
     */
    bulettCounter:number
    shootOn:Boolean
    /** счётчик срабатывания таймера checkBullets */
    delayChecker:number = 0;
    railway:any;
    railwayLine:Phaser.GameObjects.Graphics;
    lineStatic:Phaser.GameObjects.GameObject

    constructor ()
    {
        super('demo');
        this.shootOn = false;
    }    

    preload ()
    {
        this.load.image('railway','assets/railway3.png')
        this.load.image('bush','assets/bush.png')
        this.load.image('bullet','assets/bullet.png')
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
        this.load.image('empty','assets/empty.png')
    }

    create ()
    {
        //this.add.image(44,225,'railway');
        //this.railWayBound = this.physics.add.staticBody(80,225,10,225)
        this.bulletsGrp = new Bullets(this)
        this.walkerGrp = new Walkers(this)
        this.add.grid(1200,300,2400,600,50,50,undefined,undefined,0xff0000)
        this.add.rectangle(1200,300,2400,600,0xffff00,0.2)
        this.add.rectangle(2400,200,24,24,0xff0000)
        this.add.rectangle(1200,200,24,24,0xff0000)
        this.add.rectangle(0,200,24,24,0xff0000)
        this.shooter = this.add.rectangle(400,425,48,24,0xa52a22)
        //this.virusOff = this.physics.add.image(400,575,'virusOff')
        const { world } = this.physics;
        this.bulettCounter = 0;
        this.shootOn = false
        this.walkerGrp.createWalkers(9,500,100)
        this.anims.create({
            key: 'fallen',
            frames: [
                { key: 'failed0' },
                { key: 'failed1' },
                { key: 'empty' }
            ],
            frameRate: 5
        });
        this.physics.add.collider(this.walkerGrp,this.bulletsGrp,
            (walker,bullet) => {
                let pg =(walker as Walker).parentGrp ;
                pg.runShoot();
                
                (bullet as Bullet).body.reset(100,-35);
                let item = (walker as Walker);
                if (item.state != 'falling') {
                    item.play({ key: "fallen", startFrame: 0 });
                    item.state = 'falling'
                    item.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        let imgX: number = item.x;
                        let imgY: number = item.y;
                        item.body.reset(-100, -35);
                        item.setActive(false).setVisible(false);
                        item.state = '';
                    }, this);
                }
                //(walker as Phaser.Physics.Arcade.Sprite).body.reset(-100,-35);
                //(walker as Phaser.Physics.Arcade.Sprite).setActive(false).setVisible(false);
                
            })

        
        //this.add.sprite(400,100,'walker0')
        //new Phaser.GameObjects.Sprite(this,400,100,'walker0')
        
        //this.railwayLine = this.add.graphics().lineStyle(3, 0x0000ff,1).lineBetween(100,0,150,450);
        //this.lineStatic = this.physics.add.existing(this.railwayLine,true);
        this.railway = this.physics.add.staticImage(44,225,'railway');
        this.physics.add.collider(this.railway,
            this.walkerGrp, (line, walker) =>{
                let item = (walker as Walker);
                item.setTexture('granade');
        })    
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.time.addEvent({ delay: 500, callback: () => this.checkBullet(), loop: true });
    }

    update(time: number, delta: number): void {
        let deltaX:number =0;
        let velocityX:number = 0

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)){
            this.shootOn = !this.shootOn
        }

        if((this.cursors.left.isDown)&&(this.cursors.right.isDown)){
            deltaX = 0;
        }
        else {
            if (this.cursors.left.isDown) {
                deltaX = -delta / 10
                velocityX = -100;
                if ((this.cameras.main.scrollX > 0) && (this.shooter.x > 400) &&
                    (this.shooter.x < 2000)) {
                    this.cameras.main.scrollX += deltaX; 
                }
                if (this.shooter.x > 25) this.shooter.x += deltaX;
            }
            if (this.cursors.right.isDown) {
                deltaX = delta / 10
                velocityX = 100;
                if ((this.cameras.main.scrollX < 1600) && (this.shooter.x > 400) &&
                    (this.shooter.x < 2000)) {
                    this.cameras.main.scrollX += deltaX
                }
                if (this.shooter.x < 2375) this.shooter.x += deltaX
            }
        }
        this.shooterVX = velocityX
        this.walkerGrp.incX(-0.2)
        //this.walker.x-=0.2
    }

    checkBullet(){
        if(this.shootOn){
            this.bulletsGrp.fireBullet(this.shooter.x,this.shooter.y, this.shooterVX)
        }
        this.delayChecker++;
        if(this.delayChecker == 3){
            this.walkerGrp.handleDelay(this.shooter.x,this.shooter.y);
            this.delayChecker = 0;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#ffffff',
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
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT
      },
    scene: Demo
};

const game = new Phaser.Game(config);
