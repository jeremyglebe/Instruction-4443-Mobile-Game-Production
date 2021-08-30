class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene");
    }

    create() {
        // Create start game button
        let startBtn = this.add.rectangle(225, 400, 350, 100, 0x0000FF);
        startBtn.setInteractive();
        // Listener to continue to level select
        startBtn.on('pointerdown', () => {
            this.scene.start("MapScene", game_levels[0]);
        });
        // Create some prompt text
        let text = this.add.text(225, 400, "Tap to play", {
            fontSize: '36px',
            fontFamily: 'Courier New',
            color: 'white'
        });
        text.setOrigin(0.5);
        this.tweens.add({
            targets: [text],
            duration: 1000,
            alpha: 0,
            yoyo: true,
            repeat: -1
        });
    }
}