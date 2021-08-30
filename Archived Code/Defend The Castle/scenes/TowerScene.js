class TowerScene extends Phaser.Scene {
    constructor(){
        super("TowerScene");
        // Handle signals between scenes
        this.signals = SignalManager.get();
        // Background of the menu
        this.background = null;
    }
    
    create(){
        this.background = this.add.rectangle(225, 400, 350, 700, 0x0000FF, 0.6);
        this.createCloseButton();
    }

    createCloseButton(){
        // Create a button to close the menu
        let button = this.add.circle(400,50, 22, 0xFF0000);
        button.setInteractive();
        button.on('pointerdown', ()=>{
            // Let the other scenes know that we are closing
            this.signals.emit('tower-menu-closed', 'DUMMY DATA');
            // Stop this scene
            this.scene.stop("TowerScene");
        });
    }
}