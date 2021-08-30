class ControlsScene extends Phaser.Scene {
    constructor() {
        super("ControlsScene");
        this.signals = SignalManager.get();
        this.joystick = null;
        // Time related stuff
        this.timeLimit = 30000;
        this.startTime = null;
        this.timeText = null;
        // Inventory variables
        this.inventoryObj = null;
        this.inventoryEl = null;
        this.inventory = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    preload() {
        this.load.html('inventory', './assets/inventory.html');
    }

    create() {
        console.log("ControlsScene");
        // Joystick to control the character
        this.joystick = new VirtualJoystick(this, 75, GAME_HEIGHT - 75, 50);
        // Time stuff
        this.startTime = new Date().getTime();
        this.timeText = this.add.text(0, 0, "30.00");
        // Game over listener
        this.signals.on('game-over', () => {
            this.gameOver();
        });
        // Create the inventory menu
        this.createInventory();
        // Create a button
        let button = this.add.circle(GAME_WIDTH - 75, GAME_HEIGHT - 75, 50, 0x8800FF);
        button.setInteractive();
        button.on('pointerdown', ()=>{
            this.signals.emit('jump');
            button.setFillStyle(0x6600DD);
            button.setScale(0.9);
        });
        button.on('pointerup', ()=>{
            button.setFillStyle(0x8800FF);
            button.setScale(1);
        });
        button.on('pointerout', ()=>{
            button.setFillStyle(0x8800FF);
            button.setScale(1);
        });
        // Collected an item listener
        this.signals.on('collected-item', (item) => {
            let placed = false;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    if (!placed) {
                        // Check if there is an empty slot
                        if (this.inventory[r][c] == null) {
                            this.inventory[r][c] = {
                                name: item.name,
                                count: 1,
                                src: item.src
                            }
                            placed = true;
                            this.updateInventorySlot(r, c);
                        }
                        // Check if we already have a stack of that item
                        else if (this.inventory[r][c].name == item.name) {
                            this.inventory[r][c].count++;
                            placed = true;
                            this.updateInventorySlot(r, c);
                        }
                    }
                }
            }
            if (!placed) {
                console.log("INVENTORY IS FULL");
            }
        })
    }

    update() {
        // Send the joystick data to the game every update
        this.signals.emit('joystick', this.joystick);
        // Get the time that has passed
        let elapsed = new Date().getTime() - this.startTime;
        // let remaining = (this.timeLimit - elapsed) / 1000;
        let remaining = (this.timeLimit - elapsed) / 1000;
        if (remaining > 0) {
            // Update the time text
            this.timeText.setText(remaining.toFixed(2));
        } else {
            // Update the time text
            this.timeText.setText('0.00');
            // Signal when time has run out
            this.signals.emit('game-over');
        }
    }

    createInventory() {
        // Inventory GameObject
        this.inventoryObj = this.add.dom(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100).createFromCache('inventory');
        // Inventory Element
        this.inventoryEl = this.inventoryObj.node;
        // Update the inventory element to include items from game
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                this.updateInventorySlot(r, c);
            }
        }
    }

    gameOver() {
        this.signals.off('game-over');
        this.signals.off('collected-item');
        this.inventory = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        this.scene.stop();
    }

    updateInventorySlot(row, col) {
        let grid = this.inventoryEl.querySelector('.grid-container');
        let slots = grid.querySelectorAll('.grid-item');
        let index = (row * 3) + col;
        let item = this.inventory[row][col]
        if (item != null) {
            slots.item(index).innerHTML = `<img src="${item.src}"><br>${item.name}<br>${item.count}`;
        }
        else {
            slots.item(index).innerHTML = "empty";
        }
    }
}