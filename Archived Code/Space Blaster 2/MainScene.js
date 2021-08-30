class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        // Player object
        this.player = null;
        // Speed of the player
        this.plySpd = 400;
        // Joystick object
        this.joystick = null;
        // Shoot on mobile
        this.shootBtn = null;
        // Lists of stuff
        this.enemies = [];
        this.bullets = [];
        this.bulletEnemyCollider = null;
        // Timing of enemy spawns
        this.lastSpawned = 0;
        this.spawnTime = 5000;
        this.minSpawnTime = 100;
    }

    preload() {
        // Spritesheets must also include width and height of frames when loading
        this.load.spritesheet('explosion', './assets/explosion-1.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        // Load the spaceship
        this.load.spritesheet('player', './assets/ship.png', {
            frameWidth: 16,
            frameHeight: 24
        });
        // Load the lasers
        this.load.spritesheet('lasers', './assets/laser-bolts.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        // Loading enemy ships
        this.load.spritesheet('enemy-m', './assets/enemy-medium.png', {
            frameWidth: 32,
            frameHeight: 16
        });
    }

    create() {
        // this.input.on('pointerdown', () => {
        //     let x = this.input.activePointer.x;
        //     let y = this.input.activePointer.y;
        //     // const {x, y} = this.input.activePointer;
        //     this.createExplosion(x, y);
        // });
        // Create player object
        this.player = this.physics.add.sprite(225, 700, 'player');
        this.player.setScale(4);
        // Create aniamtions
        this.generatePlayerAnimations();
        // Collide with world bounds
        this.player.setCollideWorldBounds(true);
        // Start the player in idle
        this.player.anims.play('idle');
        // Handle clicks on left or right side of screen
        // this.input.on('pointerdown', () => {
        //     if (this.input.activePointer.x < 220) {
        //         this.player.anims.play('left');
        //         this.player.setVelocity(-this.plySpd, 0);
        //     }
        //     else if (this.input.activePointer.x > 230) {
        //         this.player.anims.play('right');
        //         this.player.setVelocity(this.plySpd, 0);
        //     }
        // });
        // this.input.on('pointerup', () => {
        //     this.player.anims.play('idle');
        //     this.player.setVelocity(0);
        // });
        this.joystick = new VirtualJoystick(this, 60, 740, 50);
        // Handle shooting on desktop using spacebar
        this.input.keyboard.on('keydown-SPACE', () => {
            console.log("pew pew");
            this.createBullet(this.player.x, this.player.y - 20);
        });
        this.setBulletEnemyCollider();
    }

    update() {
        // Handle player movement
        // this.player.setVelocity(this.joystick.joyX() * this.plySpd,
        //     this.joystick.joyY() * this.plySpd);
        this.player.setVelocity(this.joystick.joyX() * this.plySpd, 0);
        // Check for spawning enemies
        if (this.now() >= this.lastSpawned + this.spawnTime) {
            const x = (Math.random() * 350) + 50;
            this.createEnemy(x, 0);
            this.lastSpawned = this.now();
            this.spawnTime *= .9;
            if (this.spawnTime < this.minSpawnTime) {
                this.spawnTime = this.minSpawnTime;
            }
        }
    }

    setBulletEnemyCollider() {
        // Destroy any existing collider
        if (this.bulletEnemyCollider != null) {
            this.bulletEnemyCollider.destroy();
        }
        // Add collision with all existing bullets
        this.bulletEnemyCollider =
            this.physics.add.overlap(this.enemies, this.bullets,
                (en, bu) => {
                    bu.destroy();
                    en.anims.play('explode');
                    en.setVelocity(0, this.plySpd / 2);
                    this.bullets = this.bullets.filter((b) => {
                        return b !== bu;
                    });
                    this.enemies = this.enemies.filter((e) => {
                        return e !== en;
                    });
                });
    }

    createBullet(x, y) {
        // Creat the sprite object
        let bullet = this.physics.add.sprite(x, y, 'lasers');
        bullet.setScale(4);
        // Create the animation
        bullet.anims.create({
            // Name of the animation
            key: 'bullet',
            // Generate all frame numbers between 0 and 7
            frames: this.anims.generateFrameNumbers('lasers', {
                start: 2,
                end: 3
            }),
            // Animation should be slower than base game framerate
            frameRate: 8,
            repeat: -1
        });
        // Run the animation
        bullet.anims.play('bullet');
        // Set the velocity
        bullet.setVelocity(0, -600);
        bullet.setCollideWorldBounds(true);
        // Turning this on will allow you to listen to the 'worldbounds' event
        bullet.body.onWorldBounds = true;
        // 'worldbounds' event listener
        bullet.body.world.on('worldbounds', (body) => {
            // Check if the body's game object is the sprite you are listening for
            if (body.gameObject === bullet) {
                // Destroy the bullet
                bullet.destroy();
            }
        });
        // Add the bullet to the list of bullets
        this.bullets.push(bullet);
        this.setBulletEnemyCollider();
    }

    createEnemy(x, y) {
        let enemy = this.physics.add.sprite(x, y, 'enemy-m');
        enemy.setScale(4);
        enemy.setVelocity(0, .25 * this.plySpd);
        // Idle animation
        enemy.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('enemy-m', {
                start: 0,
                end: 1
            }),
            frameRate: 8,
            repeat: -1
        });
        // Explosion animation
        enemy.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 7
            }),
            frameRate: 8
        });
        // At the end of explosion, die.
        enemy.on('animationcomplete-explode', () => {
            enemy.destroy();
        });
        // Play idle by default
        enemy.anims.play('idle');
        // Add the bullet to the list of enemies
        this.enemies.push(enemy);
        this.setBulletEnemyCollider();
    }

    createExplosion(x, y) {
        // Creat the sprite object
        let explosion = this.add.sprite(x, y, 'explosion');
        explosion.setScale(4);
        // Create the animation
        explosion.anims.create({
            // Name of the animation
            key: 'boom',
            // Generate all frame numbers between 0 and 7
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 7
            }),
            // Animation should be slower than base game framerate
            frameRate: 8
        });
        // Run the animation
        explosion.anims.play('boom');
        // Create a callback for animation
        explosion.on('animationcomplete-boom', () => {
            explosion.destroy();
        });
    }

    generatePlayerAnimations() {
        // Create the idle animation
        this.player.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [2, 7]
            }),
            frameRate: 12,
            repeat: -1
        });
        // Create left/right animations
        this.player.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [0, 5]
            }),
            frameRate: 12,
            repeat: -1
        });
        this.player.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {
                frames: [4, 9]
            }),
            frameRate: 12,
            repeat: -1
        });
    }

    now() {
        return new Date().getTime();
    }
}