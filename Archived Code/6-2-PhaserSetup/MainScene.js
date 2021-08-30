class MainScene extends Phaser.Scene {

    // This is where we define data members
    constructor(){
        super("MainScene");
        this.hp = 5;
        this.hpText = null;
    }

    // Runs before entering the scene, LOAD IMAGES AND SOUND HERE
    preload() {
        this.load.image('kraken', './assets/kraken.png');
    }

    // Runs when we first enter this scene
    create() {
        // Create a image of kraken at position x:225,y:400
        let kraken = this.add.image(225, 400, 'kraken');
        // Set the size of the kraken
        kraken.setScale(24);
        // Make the kraken clickable
        kraken.setInteractive();
        // Handler/callback for the 'pointer down' event
        kraken.on('pointerdown', ()=>{
            // Lower HP
            this.hp -= 1;
            // Check if monster is dead
            if(this.hp == 0){
                console.log("You killed the kraken!");
                this.hp = 5;
            }
        });

        // Create hp text
        this.hpText = this.add.text(225, 700, "5");
    }

    // Runs every frame
    update() {
        this.hpText.setText(`${this.hp}`);
    }
}