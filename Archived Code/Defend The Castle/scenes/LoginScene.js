class LoginScene extends Phaser.Scene {
    constructor(){
        super("LoginScene");
    }
    
    preload(){
        this.load.image('google', './assets/google.png');
    }

    create(){
        this.add.image(225, 400, 'google');    
    }
}