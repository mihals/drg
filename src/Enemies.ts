import * as Phaser from 'phaser';
import {Demo} from './game';
import { Bullet } from './game';
import { GameState } from './enums';
//import { currentGameState } from './game';

/**класс, содержащий и управляющий группами диверсов и БМПешек */
export class Enemies
{
    myScene:Demo; 
    enemiesReserve:Reserve;
    /** массив, каждый элемент которого - Phaser.Group, содержащий группу
     * диверсов, движущихся в одну колонну 
     */
    oneColumnArr:Array<OneColumn>
    delayCounter:number = 0;
    rwExplode:Phaser.GameObjects.Sprite
    /** первый добравшийся до ж\д станции диверсант */
    firstWalker:Phaser.GameObjects.Sprite
    /**группа БМПешек */
    bmpGroup:Phaser.Physics.Arcade.Group
    stayStrArray:Array<string>

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

        this.stayStrArray=['standStay','sitStay','handStay','stepStay','gunStay' ]

        this.enemiesReserve = new Reserve(scene);
        this.oneColumnArr = [];
    }

    createGroup(kind: string, numEnemies: number, x: number, y: number) {
        if (kind == 'oneColumn') {
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,450,20,6).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,550,60,5).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,480,100,4).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,530,140,3).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,510,180,2).
                setVelocityX(-6))
                this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,220,220,1).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,420,220,1).
                setVelocityX(-6))

            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,950,60,7).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,880,100,6).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,930,140,5).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,910,180,4).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,820,220,3).
                setVelocityX(-6))

            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,1350,60,4).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,1280,100,4).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,1330,140,4).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,1310,180,5).
                setVelocityX(-6))
            this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,1320,20,4).
                setVelocityX(-6))
        }
        if(kind == 'bmpGroup'){
            this.bmpGroup = this.myScene.physics.add.group()
            this.bmpGroup.create(700,24,'bmp').setDepth(2).setPushable(false).
                setBodySize(103,24).setState(4)
            this.bmpGroup.create(950,104,'bmp').setDepth(5).setPushable(false).
                setBodySize(103,24).setState(4)
            this.bmpGroup.create(700,104,'bmp').setDepth(9).setPushable(false).
                setBodySize(103,24).setState(4)
            this.bmpGroup.add(new BMP(this.myScene,500,104),true)

            this.myScene.physics.add.collider(this.myScene.bulletsGrp,
                this.bmpGroup,(bullet:Bullet, bmp:BMP) =>{
                    bullet.body.reset(0,-32);
                    bullet.setActive(false).setVisible(false);
                    if(bmp.state > 1){
                        let state = (bmp.state as number) - 1;
                        let txtr = 'bmp'+state
                        bmp.setState(state)
                        bmp.setTexture(txtr)
                    }
                    if(bmp.state == 1){
                        bmp.body.reset(bmp.x,bmp.y)
                    }
                    
                })
            this.bmpGroup.setVelocityX(-10)
        }
    }

    /**обрабатывает событие таймера - перемещает группы, добавляет новые,
     * проверяет закончена ли игра: если какой-то волкер дошёл до цистерн
     * возвращает GameState.Lost, если уничтожены все диверсы GameState.Win
     */
    handleUpdate(): GameState {
        let ret: GameState = this.myScene.currentGameState;
        if(this.enemiesReserve.countActive() == 0){
            return GameState.Win
        }

        this.oneColumnArr.forEach((item, index, array) => {
            //console.log(index)
            if (ret == GameState.Gone) {
                if (item.countActive() != 0) {
                    let falX = item.getFirstAlive()
                    //console.log(falX.x)
                    if (item.getFirstAlive().x < 95) {
                        this.firstWalker = item.getFirstAlive()
                        ret = GameState.Lost;
                        return GameState.Lost
                    }
                }
            }
        })
        return ret;
    }

    /**вызывается из update класса game как только gameIsGone становится false,
     * останавливает анимацию волкеров, первый дошедший до цистерн волкер
     * бросает гранату
     */
    stopEnemies(result: GameState): Phaser.Geom.Point {
        if (result == GameState.Lost) {
            this.oneColumnArr.forEach((column, ind, arr) => {
                column.setVelocityX(0)
                column.getChildren().forEach((enemy: Phaser.GameObjects.Sprite, ind, arr) => {
                    enemy.anims.stop()
                    let num = Phaser.Math.RND.integerInRange(0, 4)
                    enemy.setTexture(this.stayStrArray[num])
                })
            })
            this.firstWalker.setTexture('granade')
            return new Phaser.Geom.Point(this.firstWalker.x, this.firstWalker.y)
        }
        if (result == GameState.Win){
            return null;
        }
    }

    /** очищает всё поле от диверсов, удаляет коллайдеры  */
    clearEnemies(){
        this.oneColumnArr.forEach((oneColumn:OneColumn, ind:number, arr) =>{
            //oneColumn.bulletEnemyCollider.destroy()
            oneColumn.getChildren().forEach((enemy:Enemy, enemyInd:number) => {
                enemy.body.reset(-100, 0);
                enemy.setActive(false).setVisible(false);
                enemy.state = '';
                //oneColumn.remove(enemy);
            })
            oneColumn.clear()
            //oneColumn.destroy()
            //let cld = this.myScene.physics.world.colliders
        })
        this.oneColumnArr.length = 0
    }

    getNumKilledEnemies(){
        console.log("killedEnemies " + this.enemiesReserve.countActive())
        return (68 - this.enemiesReserve.countActive())
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
    //bulletEnemyCollider:Phaser.Physics.Arcade.Collider;

    constructor(scene:Demo,reserve:Reserve,x,y,numEnemies){
        super(scene.physics.world,scene);
        
        let depth:number
        switch(y){
            case 20:
                depth = 0
                break;
            case 60:
                depth = 4
                break;
            case 100:
                depth = 6
                break;
            case 140:
                depth = 7
            break;
            case 180:
                depth = 9
                break;
            case 220:
                depth = 11
                break;
        }

        for(let i=0;i<numEnemies;i++){
            //let enemy = reserve.getFirstDead(true,x+i*32,y,'walker0');
            let enemy = reserve.getFirstDead(false);
            
            if(enemy){
                //layer.add(enemy)
                enemy.x = x+i*24;
                enemy.y = y;
                enemy.state = 'walk';
                enemy.setActive(true).setVisible(true)
                enemy.play({key:'walk',startFrame:0})
                enemy.setPushable(false);
                enemy.parentGrp = this;
                enemy.setBodySize(16,16);
                enemy.setDepth(depth)
                this.add(enemy)
            }
        }
        //this.bulletEnemyCollider = 
        scene.physics.add.collider(this as Phaser.Types.Physics.Arcade.ArcadeColliderType,
            scene.bulletsGrp as Phaser.Types.Physics.Arcade.ArcadeColliderType,(enemy:Enemy, bullet:Bullet) => {
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
                    let hasActive = reserve.countActive()
                    console.log(hasActive)
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

class BMP extends Phaser.Physics.Arcade.Sprite{
    constructor(scene:Demo, x:number, y:number){
        super(scene,x,y,'bmp')
        this.setState(4)
    }
    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if(this.state==0){
            this.setActive(false);
            this.setVisible(false);
        }
    }
}