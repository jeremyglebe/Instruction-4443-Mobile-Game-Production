class PlatformScene extends Phaser.Scene {
    constructor(){
        super("PlatformScene");
        // Shortcuts
        this.cam = null;
        this.ptr = null;
        this.Distance = Phaser.Math.Distance;
        // Tilemap stuff
        this.tilemap = null;
        this.tileset = null;
        this.tileLayers = {};
        this.mapObjects = [];
        // Character
        this.clown = null;
    }

    preload(){
        this.load.image('clown', './assets/clown.png');
        this.load.image('platform-set', './assets/platformer.png');
        this.load.tilemapTiledJSON('platform-map', './assets/platformer.json');
    }

    create(){
        // Shortcuts
        this.cam = this.cameras.main;
        this.ptr = this.input.activePointer;
        // Create things
        this.createTilemap();
        this.createPlayer();
        // Collision handlers
        this.setCollisions();
        // Set the camera
        this.cam.startFollow(this.clown);
        this.cam.setZoom(5);
    }

    createTilemap() {
        this.tilemap = this.add.tilemap('platform-map');
        this.tileset = this.tilemap
            .addTilesetImage('platform-set', 'platform-set');
        let background = this.tilemap
            .createLayer('background', this.tileset, 0, 0);
        background.setDepth(0);
        let foreground = this.tilemap
            .createLayer('foreground', this.tileset, 0, 0);
        foreground.setDepth(1);
        let overhead = this.tilemap
            .createLayer('overhead', this.tileset, 0, 0);
        overhead.setDepth(2);
        // Add the layers to layer object
        this.tileLayers = {
            background: background,
            foreground: foreground,
            overhead: overhead
        }
        // Process objects
        let objectLayer = this.tilemap.getObjectLayer('objects');
        this.mapObjects = objectLayer.objects;
    }

    createPlayer(){
        let playerObject = this.mapObjects.filter((obj)=>{
            return obj.name == "player";
        })[0];
        this.clown = this.physics.add.image(playerObject.x, playerObject.y, 'clown');
        this.clown.setVelocity(70, 0);
        setInterval(()=>{
            this.clown.setVelocityY(-70);
        }, 3000);

    }

    setCollisions(){
        // Collision
        this.tileLayers.foreground.setCollisionBetween(0, 10000, true);
        this.physics.add.collider(this.tileLayers.foreground, this.clown);
    }
}