import * as Phaser from 'phaser';
import Demo from './game';
import { Bullet } from './game';

/**класс, содержащий и управляющий группами диверсов */
export class Enemies
{
    myScene:Demo; 
    enemiesReserve:Reserve;
    oneColumnArr:Array<OneColumn>
    delayCounter:number = 0;
    rwExplode:Phaser.GameObjects.Sprite

    constructor(scene:Demo){
        this.myScene = scene;

        scene.anims.create({
            key: 'rwExplode',
            frames: [
                { key: 'explode1' },
                { key: 'explode2' },
                { key: 'explode3' },
                { key: 'explode4' },
                { key: 'explode5' },
                { key: 'explode6' },
                { key: 'explode7' },
                { key: 'explode8' },
                { key: 'explode9' },
                { key: 'explode10' },
                { key: 'explode11' },
                { key: 'explode12' },
                { key: 'explode13' },
                { key: 'explode14' },
                { key: 'explode15' },
                { key: 'explode16' },
                { key: 'explode17' },
                { key: 'explode18' },
                { key: 'explode19' },
                { key: 'explode20' },
                { key: 'explode21' },
                { key: 'explode22' },
                { key: 'explode23' }
            ],
            frameRate: 5,
        });

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
        scene.anims.create({
            key: 'fallen',
            frames: [
                { key: 'failed0' },
                { key: 'failed1' },
                { key: 'empty' }
            ],
            frameRate: 5
        });

        this.enemiesReserve = new Reserve(scene);
        this.oneColumnArr = [];
        this.rwExplode = scene.add.sprite(43,225,'explode1');
    }

    createGroup(kind:string, numEnemies:number, x:number, y:number){
        switch(kind){
            case'oneColumn':
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,x,y,numEnemies));
            // this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,600,50,8))
            // this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,700,75,3))
            // this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,700,300,7))
            // this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,900,200,4))
            break;
        }
    }

    /**обрабатывает событие таймера - перемещает группы, добавляет новые */
    handleUpdate(){
        this.oneColumnArr.forEach((item,index,array) => {
            item.incX(-4);
            //let grp = array[index];
            //grp.incX(-2);
        })
        this.delayCounter++;
        if(this.delayCounter==10){
            //this.rwExplode.setTexture('virusOff');
            this.myScene.rwExplode.play({key:'rwExplode',startFrame:0});
            this.myScene.rwExplode.on(Phaser.Animations.Events.ANIMATION_COMPLETE,() =>{
                this.myScene.railway.setTexture('blackRailway');
                this.myScene.explodeTween.play();
            })
            //this.rwExplode.play({key:'rwExplode',startFrame:0});
            //this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,600,200,5));
        }

        if(this.delayCounter==26){
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,300,300,2));
        }

        if(this.delayCounter==36){
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,300,300,5));
        }
    }
}

/**Класс группа, содержащая неактивные невидимые спрайты, служащий резервом
 * из которого они добавляются в создаваемые группы диверсов
 */
class Reserve extends Phaser.Physics.Arcade.Group
{
    constructor(scene){
        super(scene.physics.world,scene);
        this.createMultiple({
            frameQuantity: 100,
            key: 'walker',
            active: false,
            visible: false,
            setXY : {x:-100,y:0},
            classType: Enemy
        });
    }

    
}

/**Группа numEnemies диверсов, движущихся в одну колонну */
class OneColumn extends Phaser.Physics.Arcade.Group
{
    constructor(scene:Demo,reserve:Reserve,x,y,numEnemies){
        super(scene.physics.world,scene);
        for(let i=0;i<numEnemies;i++){
            //let enemy = reserve.getFirstDead(true,x+i*32,y,'walker0');
            let enemy = reserve.getFirstDead(false);
            if(enemy){
                enemy.x = x+i*24;
                enemy.y = y;
                enemy.state = 'walk';
                enemy.setActive(true).setVisible(true)
                enemy.play({key:'walk',startFrame:0})
                enemy.setPushable(false);
                enemy.parentGrp = this;
                enemy.setBodySize(16,16);
                this.add(enemy)
            }
        }
        scene.physics.add.collider(this,scene.bulletsGrp,(enemy:Enemy, bullet:Bullet) => {
            bullet.body.reset(0,-32);
            bullet.setActive(false).setVisible(false);
            if (enemy.state != 'falling') {
                
                enemy.state = 'falling'
                enemy.play({ key: "fallen", startFrame: 0 });
                enemy.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    enemy.body.reset(-100, 0);
                    enemy.setActive(false).setVisible(false);
                    enemy.state = '';
                    this.remove(enemy);
                }, this);
            }
        })
    }
} 

/** Объект-диверс, который берётся из группы Reserve и состоит в двух
 * группах до удаления, при удалении исключается из группы OneColumn или
 * другой группы
 */
class Enemy extends Phaser.Physics.Arcade.Sprite
{
    /**ссылка на группу, в которой этот объект состоит */
    parentGrp:Phaser.Physics.Arcade.Group
    constructor (scene:Demo, x:number, y:number,
         parentGrp:Phaser.Physics.Arcade.Group)
    {
        super(scene, x, y, 'walker0');
        this.parentGrp = parentGrp;
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