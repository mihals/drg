import * as Phaser from 'phaser';
import Demo from './game';
import { Bullet } from './game';

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
    /**группа БМПешек */
    bmpGroup:Phaser.Physics.Arcade.Group

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
        //this.rwExplode = scene.add.sprite(43,225,'explode1');
        
    }

    createGroup(kind: string, numEnemies: number, x: number, y: number) {
        if (kind == 'oneColumn') {
            // 63 волкера
            // let column: OneColumn = new OneColumn(this.myScene, this.enemiesReserve,
            //      x, y, numEnemies).setVelocityX(-6)
            // this.oneColumnArr.push(column);
            
            // this.createGroup('oneColumn',4,1350,60);
            // this.createGroup('oneColumn',4,1280,100);
            // this.createGroup('oneColumn',4,1330,140);
            // this.createGroup('oneColumn',5,1310,180);
            // this.createGroup('oneColumn',4,120,220);
            
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
            // this.bmpGroup = this.myScene.physics.add.group({
            //     key:'bmp',
            //     frameQuantity: 3,
            //     setXY:{x:300, y:50},
            //     classType: BMP}
            // )
            // let spr = new Phaser.Physics.Arcade.Sprite(this.myScene,300,60,'bmp')
            // spr.setTexture('bmp')
            // this.bmpGroup.add(spr)
            // this.bmpGroup.setVelocityX(-2)
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
                    if(bmp.state>1){
                        let state = (bmp.state as number) - 1;
                        let txtr = 'bmp'+state
                        bmp.setState(state)
                        bmp.setTexture(txtr)
                    }
                    if(bmp.state == 1){
                        //bmp.setImmovable()
                        bmp.body.reset(bmp.x,bmp.y)
                    }
                    
                })
            this.bmpGroup.setVelocityX(-10)
        }
    }

    /**обрабатывает событие таймера - перемещает группы, добавляет новые,
     * проверяет закончена ли игра (если взорваны цисцерны) и, если закончена,
     * возвращает false
     */
    handleUpdate():boolean{
        let gameIsGone = this.myScene.gameIsGone;
        let locX;
        //locX =this.oneColumnArr[0].getChildren()[0].
        this.oneColumnArr.forEach((item,index,array) => {
            //item.incX(-4);
            // let prop;
            // try{(prop = item.getFirstAlive().x)}
            // catch(err){
            //     prop = 0
            // }
            // if(item.countActive()==0){
            //     try{
            //         item.destroy()
            //         array.splice(index,1)
            //     }
            //     catch(err){

            //     }
            //}
            if(gameIsGone && item.countActive()!=0 && item.getFirstAlive().x < 88){
                gameIsGone = false;
                this.myScene.rwExplode.play({key:'rwExplode',startFrame:0});
                this.myScene.rwExplode.on(Phaser.Animations.Events.ANIMATION_COMPLETE,() =>{
                this.myScene.railway.setTexture('blackRailway');
                this.myScene.explodeTween.play();
            })}

            
          
        //     locX = this.bmpGroup.getChildren()[0].x++
         //this.bmpGroup.incX(-0.1)
        //this.bmpGroup.getChildren().forEach((item,index,array) => {

            //if(item.state !=1) 
            //(item as Phaser.Physics.Arcade.Sprite).x-=4
        //});
            
        
            //spr.setDebug(true)
            //let x = spr.x;
            //let grp = array[index];
            //grp.incX(-2);
        })
        // for(let i=0;i< this.oneColumnArr.length;i++){
        //         if(this.oneColumnArr[i].countActive()==0){
        //             this.oneColumnArr[i].destroy()
        //             this.oneColumnArr.splice(i,1)
        //         }
        //     }
        return gameIsGone;

        // this.delayCounter++;
        // if(this.delayCounter==10){
        //     //this.rwExplode.setTexture('virusOff');
        //     this.myScene.rwExplode.play({key:'rwExplode',startFrame:0});
        //     this.myScene.rwExplode.on(Phaser.Animations.Events.ANIMATION_COMPLETE,() =>{
        //         this.myScene.railway.setTexture('blackRailway');
        //         this.myScene.explodeTween.play();
        //     })
            
            //this.rwExplode.play({key:'rwExplode',startFrame:0});
            //this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,600,200,5));

        //if(this.delayCounter==26){
            //this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,300,300,2));
        //}

        //if(this.delayCounter==36){
            //this.oneColumnArr.push(new OneColumn(this.myScene,this.enemiesReserve,300,300,5));
        //}
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

class BMP extends Phaser.Physics.Arcade.Sprite{
    constructor(scene:Demo, x:number, y:number){
        super(scene,x,y,'bmp')
        this.setState(4)
        //this.setTexture('bmp')
        //this.setBodySize(103,30)
        //this.setPushable(false)
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