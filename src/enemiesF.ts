import * as Phaser from 'phaser';


export class EnemiesF extends Phaser.Physics.Arcade.Group
{
    myScene: Phaser.Scene
    blankShot:Phaser.Physics.Arcade.Sprite

    constructor (scene:Phaser.Scene)
    {
        super(scene.physics.world, scene);

        this.scene.anims.create({
            key : 'walkF',
            frames : [
                {key:"atlas1", frame: 'walkerF1' },
                {key:"atlas1", frame: 'walkerF2' },
                {key:"atlas1", frame: 'walkerF3' },
                {key:"atlas1", frame: 'walkerF4' },
                {key:"atlas1", frame: 'walkerF5' },
                {key:"atlas1", frame: 'walkerF4' },
                {key:"atlas1", frame: 'walkerF3' },
                {key:"atlas1", frame: 'walkerF2' }
            ],
            frameRate: 5,
            repeat: -1
        })
        
        this.createMultiple({
            frameQuantity: 60,
            key: 'enemyF',
            setXY: {x:-100,y: 0},
            active: false,
            visible: false,
            classType: EnemyF
        });

        this.getChildren().forEach((enemy) => {
            (enemy as Phaser.Physics.Arcade.Sprite).setSize(16,16)
        })
    }

    issueEnemy (enemiesArr: Array<{x:number, y:number}>)
    {
        let walkerF:EnemyF
        let alpha:number
        let tmpArr:Array<EnemyF>=[]

        for(let i=0; i<enemiesArr.length; i++){
            walkerF = this.getFirstDead(false);
            walkerF.setPushable(false)
            walkerF.body.reset(enemiesArr[i].x,enemiesArr[i].y)
            walkerF.setActive(true)
            walkerF.setVisible(true)
            alpha = Math.atan((400 - walkerF.x)/(450 - walkerF.y))
            walkerF.setRotation(-alpha)
            walkerF.setData('offSide', true);
            walkerF.alpha = 0;
            walkerF.play('walkF')
            walkerF.state = ''
            this.scene.physics.moveTo(walkerF,400,450,5)
            this.scene.tweens.add({
                targets:walkerF,
                alpha: { value: 1 },
                duration: 2000,
                // onComplete: () => {
                //     walkerF.setData('offSide', false);
                //     walkerF.play('walkF')
                    
                // }
            })
            //tmpArr.push(walkerF)
            
        }

        // tmpArr.forEach((enemyF) => {
        //     this.scene.tweens.add({
        //         targets:enemyF,
        //         alpha: { value: 1 },
        //         duration: 2000,
        //         onComplete: () => {
        //             enemyF.setData('offSide', false);
        //             enemyF.play('walkF')
        //             this.scene.physics.moveTo(enemyF,400,450,5)
        //         }
        //     })
        // })
    }

    stopEnemies(){
        let activeEnemyArr:Array<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> = 
            this.getMatching("active",true);
        activeEnemyArr.forEach(
            (enemy:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
                enemy.body.setVelocity(0);
                enemy.anims.stop();
        })
    }

    clearEnemies(){
        let activeEnemyArr:Array<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> = 
            this.getMatching("active",true);
        activeEnemyArr.forEach(
            (enemy:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
                enemy.setActive(false).setVisible(false);
                enemy.state = ''
                enemy.body.reset(-100,0)
        })
    }

    fireBlank(x, y, velocityX){
        this.blankShot.body.reset(x-3,y-10)
        this.blankShot.play({key:'blankShoot',startFrame:0})
        this.blankShot.setVelocityX(velocityX)
    }
}

export class EnemyF extends Phaser.Physics.Arcade.Sprite
{
    /**ссылка на группу, в которой этот объект состоит */
    parentGrp:Phaser.Physics.Arcade.Group
    constructor (scene, x:number, y:number,
         parentGrp:Phaser.Physics.Arcade.Group)
    {
        super(scene, x, y, 'walkerF1');
        //this.parentGrp = parentGrp;
        //this.setSize(28,16).setOffset(-2,-16)
        //this.state = state;
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.y <= -0)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}