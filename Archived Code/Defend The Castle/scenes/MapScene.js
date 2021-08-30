class MapScene extends Phaser.Scene {
    constructor() {
        super("MapScene");
        // Handle signals between scenes
        this.signals = SignalManager.get();
        // Name of the level, defined in config
        this.name = "";
        // Path as defined in the config
        this.path = [];
        // Game Objects
        // Object representing the path in game
        this.pathObj = null;
    }

    init(data) {
        // Read data from config
        this.name = data.name;
        this.path = data.path;
    }

    create() {
        // Create a path object which starts with a single point (the first one)
        this.pathObj = new Phaser.Curves.Path(this.path[0].x, this.path[0].y);
        // For every point after the first (1 to length)
        for (let i = 1; i < this.path.length; i++) {
            // Create a line on the path connecting to the given point
            this.pathObj.lineTo(this.path[i].x, this.path[i].y);
        }
        // Add button for tower menu
        this.createMenuButtons();
        // Draw path (for testing)
        this.drawPath();
    }

    createMenuButtons(){
        // Create a button to open tower menu
        let towerBtn = this.add.rectangle(400, 50, 40, 40, 0x0000FF);
        towerBtn.setInteractive();
        towerBtn.on('pointerdown', ()=>{
            // Disable this button
            towerBtn.setAlpha(0);
            // Launch the menu
            this.scene.launch("TowerScene");
        });
        // Listen for when the tower menu closes
        this.signals.on('tower-menu-closed', (data)=>{
            console.log(data);
            towerBtn.setAlpha(1);
        });
    }

    drawPath(){
        // Create a graphics object for drawing lines or shapes
        let graphics = this.add.graphics();
        // Defines the styling of the graphics object (color, etc)
        graphics.lineStyle(3, 0x00FF00, 0.5);
        // Tell the path to draw itself using the graphics object
        this.pathObj.draw(graphics);
    }
}