class ControlsScene extends Phaser.Scene {
    constructor() {
        super("ControlsScene");
        this.signals = SignalManager.get();
        this.joystick = null;
    }

    create() {
        // Joystick to control the character
        this.joystick = new VirtualJoystick(this, GAME_WIDTH / 2, GAME_HEIGHT - 100, 50);
    }

    update(){
        // Send the joystick data to the game every update
        this.signals.emit('joystick', this.joystick);
    }
}