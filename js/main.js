var game;
var gameOptions = {
    slices: 12,
    slicePrizes: [
        "🎉 YOU WON 10 Rs",
        "🎉 YOU WON 20 Rs",
        "🎉 YOU WON 50 Rs",
        "🎉 YOU WON 100 Rs",
        "🎉 YOU WON 500 Rs",
        "🎉 YOU WON 1000 Rs",
        "🎉 YOU WON 2000 Rs",
        "🎉 YOU WON 5000 Rs",
        "🎉 YOU WON 10,000 Rs",
        "🎉 YOU WON 50,000 Rs",
        "🎉 YOU WON 1,00,000 Rs",
        "🎉 YOU WON 2,00,000 Rs"
    ],
    rotationTimeRange: {
        min: 7000,
        max: 13000
    }
};

window.onload = function () {
    var gameConfig = {
        type: Phaser.CANVAS,
        width: 850,
        height: 850,
        backgroundColor: 0xffffff,
        scene: [playGame]
    };
    game = new Phaser.Game(gameConfig);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
};

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image("wheel", "images/wheel.png");
        this.load.image("pin", "images/pin.png");
    }
    create() {
        this.wheel = this.add.sprite(game.config.width / 2, game.config.height / 2, "wheel");
        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin"); // Place the pin at the center of the wheel
        this.pin.setOrigin(0.5); // Set the pin's anchor point to the center
        this.prizeText = this.add.text(game.config.width / 2, game.config.height - 35, "SPIN TO WIN", {
            font: "bold 45px Rajdhani",
            align: "center",
            color: "green"
        });
        this.prizeText.setOrigin(0.5);
        this.canSpin = true;
        this.input.on("pointerdown", this.spinWheel, this);
    }
    spinWheel() {
        if (this.canSpin) {
            this.prizeText.setText("");
            var rounds = Phaser.Math.Between(4, 6);
            var degrees = Phaser.Math.Between(0, 360 / gameOptions.slices); // Ensure the pin points to the center of a slice
            var totalDegrees = 360 * rounds + degrees;
            var prizeSlice = gameOptions.slices - 1 - Math.floor((totalDegrees % 360) / (360 / gameOptions.slices));
            this.canSpin = false;
            var rotationTime = Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max);
            var extra_degrees = 5 * 360; // Add extra degrees to ensure that the wheel stops at the center of a slice
            this.tweens.add({
                targets: [this.wheel],
                angle: totalDegrees + extra_degrees, // Ensure the wheel stops at the center of a slice
                duration: rotationTime,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function (tween) {
                    // Calculate the prize based on the landed slice
                    var prize = gameOptions.slicePrizes[prizeSlice];
                    this.prizeText.setText(prize);
                    this.canSpin = true;
                }
            });
        }
    }
}

function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = windowWidth / gameRatio + "px";
    } else {
        canvas.style.width = windowHeight * gameRatio + "px";
        canvas.style.height = windowHeight + "px";
    }
}
