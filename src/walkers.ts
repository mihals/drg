import * as Phaser from 'phaser';

export  class EnemyGrp extends Phaser.Physics.Arcade.Group
{
    myScene:Phaser.Scene
    constructor(scene){
        super(scene.physics.world,scene)
        this.myScene = scene;

        scene.anims.create({
            key: 'walk',
            frames: [
                { key: 'walker0' },
                { key: 'walker1' },
                { key: 'walker2' },
                { key: 'walker3' },
                { key: 'walker4' }
            ],
            frameRate: 5,
            repeat: -1
        });
        scene.anims.create({
            key: 'run',
            frames: [
                { key: 'runner0' },
                { key: 'runner1' },
                { key: 'runner2' },
                { key: 'runner3' },
                { key: 'runner4' }
            ],
            frameRate: 5,
            repeat: -1
        });
    }
    
    addEnemies() {
        this.add(this.myScene.add.sprite(400, 300, 'walker0').
            play({ key: 'walk', startFrame: 2 }))
        this.add(this.myScene.add.sprite(440, 300, 'walker0').
            play({ key: 'walk', startFrame: 0 }))
        this.add(this.myScene.add.sprite(480, 300, 'walker0').
            play({ key: 'walk', startFrame: 3 }))
        this.add(this.myScene.add.sprite(520, 300, 'walker0').
            play({ key: 'walk', startFrame: 1 }))

        this.add(this.myScene.add.sprite(400, 100, 'walker0').
            play({ key: 'walk', startFrame: 2 }))
        this.add(this.myScene.add.sprite(440, 100, 'walker0').
            play({ key: 'walk', startFrame: 0 }))
        this.add(this.myScene.add.sprite(480, 100, 'walker0').
            play({ key: 'walk', startFrame: 3 }))
        this.add(this.myScene.add.sprite(520, 100, 'walker0').
            play({ key: 'walk', startFrame: 1 }))
        this.add(this.myScene.add.sprite(560, 100, 'walker0').
            play({ key: 'walk', startFrame: 1 }));

        this.add(this.myScene.add.sprite(900, 100, 'walker0').
            play({ key: 'walk', startFrame: 2 }))
        this.add(this.myScene.add.sprite(940, 100, 'walker1').
            play({ key: 'walk', startFrame: 0 }))
        this.add(this.myScene.add.sprite(980, 100, 'walker0').
            play({ key: 'walk', startFrame: 3 }))
        this.add(this.myScene.add.sprite(1020, 100, 'walker3').
            play({ key: 'walk', startFrame: 1 }))
        this.add(this.myScene.add.sprite(1060, 100, 'walker0').
            play({ key: 'walk', startFrame: 1 }));

        this.add(this.myScene.add.sprite(600, 200, 'walker0').
            play({ key: 'walk', startFrame: 2 }))
        this.add(this.myScene.add.sprite(640, 200, 'walker1').
            play({ key: 'walk', startFrame: 0 }))
        this.add(this.myScene.add.sprite(680, 200, 'walker0').
            play({ key: 'walk', startFrame: 3 }))
        this.add(this.myScene.add.sprite(720, 200, 'walker3').
            play({ key: 'walk', startFrame: 1 }))
        this.add(this.myScene.add.sprite(760, 200, 'walker0').
            play({ key: 'walk', startFrame: 1 }));
        this.add(this.myScene.add.sprite(760, 200, 'walker0').
            play({ key: 'walk', startFrame: 1 }));

            this.add(this.myScene.add.sprite(1400, 50, 'walker0').
            play({ key: 'walk', startFrame: 2 }))
        this.add(this.myScene.add.sprite(1440, 50, 'walker1').
            play({ key: 'walk', startFrame: 0 }))
        this.add(this.myScene.add.sprite(1480, 50, 'walker0').
            play({ key: 'walk', startFrame: 3 }))
        this.add(this.myScene.add.sprite(1520, 50, 'walker3').
            play({ key: 'walk', startFrame: 1 }))
        this.add(this.myScene.add.sprite(1560, 50, 'walker0').
            play({ key: 'walk', startFrame: 1 }));

        this.children.iterate((item) => {
            (item as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody).body.setSize(10,10);
            //(item as Walker).setPushable(false);
            return true;
        })
    }

    //this.walker = this.add.sprite(400, 300, 'walker0')
    //    .play('walk');
}

export default class Walkers extends Phaser.Physics.Arcade.Group
{
    myScene:Phaser.Scene;
    enemyType: string;
    enemyState:string;

    constructor(scene){
        super(scene.physics.world,scene)
        this.myScene = scene;
        this.enemyType = 'walker';
        this.enemyState = 'walk';

        scene.anims.create({
            key: 'walk',
            frames: [
                { key: 'walker0' },
                { key: 'walker1' },
                { key: 'walker2' },
                { key: 'walker3' },
                { key: 'walker4' }
            ],
            frameRate: 5,
            repeat: -1
        });
        scene.anims.create({
            key: 'run',
            frames: [
                { key: 'runner0' },
                { key: 'runner1' },
                { key: 'runner2' },
                { key: 'runner3' },
                { key: 'runner4' }
            ],
            frameRate: 5,
            repeat: -1
        });
        

        this.createMultiple({
            frameQuantity: 10,
            key: 'walker',
            active: false,
            visible: false,
            setXY : {x: -100,y:-35},
            classType: Walker
        });

        

        // for(let i=0; i<30; i++){
        //     this.add(new Walker(scene,0,-100, this).setActive(false).setVisible(false))
        // }
    }

    createWalkers(num, x, y){
        let walker;
        for(let i=0; i<num; i++){
            walker = this.getFirstDead(false)
            if(walker){
                walker.parentGrp = this;
                walker.body.reset(500 +i*40,300)
                walker.setActive(true).setVisible(true)
                walker.play({key:'walk',startFrame:0})
                walker.setPushable(false);
                //this.setVelocityY(2)
            }
            
        }
        //let a = grp.children
    }

    /**
     * при попадании в одного из персов группы, вся остальная группа переходит
     * с ходьбы на бег со стрельбой по тачке
     */
    runShoot(){
        if(this.enemyState == 'walk'){
            this.children.iterate((entry) =>{
                if(entry.active){
                    (entry as Phaser.GameObjects.Sprite).play({key:'run',startFrame:0})
                }
                return true
            })
        }
        this.enemyState = 'run'
    }

    /**
     * обрабатывает срабатывание таймера для совершения каких-либо действий,
     * к примеру, стрельбы по тачке
     */
    handleDelay(x:number,y:number){
        if(this.enemyState == 'run'){
            this.children.iterate((item) =>{
                let myItem = item as Phaser.GameObjects.Sprite;
                if(myItem.active){
                    if(Phaser.Math.RND.integerInRange(1,5) == 1){
                    let bullet = this.myScene.physics.add.
                        image(myItem.x,myItem.y-15,'circleBullet');
                    this.myScene.physics.moveTo(bullet,x,y,250);
                    }
                }
                return true;
            })
        }
    }
}

export class Walker extends Phaser.Physics.Arcade.Sprite
{
    parentGrp:Walkers
    constructor (scene, x, y, parentGrp:Walkers)
    {
        super(scene, x, y, 'walker0');
        this.parentGrp = parentGrp;
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.x <= -0)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}