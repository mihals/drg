import * as Phaser from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y,'atlas0', 'bullet');
    }

    fire (x, y, velocityX)
    {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocity(velocityX, -300);
        //(this.scene as Demo).numBullets++
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

export class Bullets extends Phaser.Physics.Arcade.Group
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
                {key:"atlas0", frame: 'empty' },
                {key:"atlas0", frame: 'blankShoot' },
                {key:"atlas0", frame: 'blankShoot2' },
                {key:"atlas0", frame: 'empty' }
            ],
            frameRate: 10,
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

export class BulletF extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y,'atlas1', 'bulletF');
    }

    fire (x, y, velocityX, velocityY)
    {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocity(velocityX, velocityY);
        //(this.scene as Demo).numBullets++
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if ((this.y <= -32)||(this.x <= -32))
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

export class BulletsF extends Phaser.Physics.Arcade.Group
{
    myScene: Phaser.Scene
    blankShot:Phaser.Physics.Arcade.Sprite
    constructor (scene:Phaser.Scene)
    {
        super(scene.physics.world, scene);
        //this.myScene
        
        this.createMultiple({
            frameQuantity: 50,
            key: 'bulletF',
            setXY: {x:0,y:-100},
            setDepth: {value: 5},
            active: false,
            visible: false,
            classType: BulletF
        });

        let anim = scene.anims.create({
            key: 'blankShoot',
            frames: [
                {key:"atlas0", frame: 'empty' },
                {key:"atlas0", frame: 'blankShoot' },
                {key:"atlas0", frame: 'blankShoot2' },
                {key:"atlas0", frame: 'empty' }
            ],
            frameRate: 10,
        });
        //console.log(anim)
        this.blankShot = scene.physics.add.sprite(-100,-100,'empty').setDepth(12)
    }

    fireBullet (x, y, velocityX, velocityY)
    {
        const bullet = this.getFirstDead(false);

        if (bullet)
        {
            bullet.fire(x, y, velocityX, velocityY);
        }
    }

    fireBlank(x, y, velocityX){
        this.blankShot.body.reset(x-3,y-10)
        this.blankShot.play({key:'blankShoot',startFrame:0})
        this.blankShot.setVelocityX(velocityX)
    }
}