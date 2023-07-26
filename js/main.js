var game;
var gameOptions = {
    slices: 6,
    slicePrizes: [
        "🎉 CASH OFF ON NEXT PURCHASE",
        "🎉 CASH OFF ON NEXT PURCHASE",
        "🎉 CASH OFF ON NEXT PURCHASE",
        "🎉 CASH OFF ON NEXT PURCHASE",
        "🎉 CASH OFF ON NEXT PURCHASE",
        "🎉 CASH OFF ON NEXT PURCHASE"
    ],
    rotationTime: 6000
};

window.onload = function () {
    var gameConfig = {
        type: Phaser.CANVAS,
        width: 850,
        height: 850,
        backgroundColor: 0x880044,
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
        this.load.image("wheel", "images/wheel.png"); // Removed window.location.href
        this.load.image("pin", "images/pin.png"); // Removed window.location.href
    }

    create() {
        this.wheel = this.add.sprite(game.config.width / 2, game.config.height / 2, "wheel");
        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");
        this.prizeText = this.add.text(game.config.width / 2, game.config.height - 35, "SPIN TO WIN", {
            font: "bold 64px Rajdhani",
            align: "center",
            color: "white"
        });
        this.prizeText.setOrigin(0.5);
        this.canSpin = true;
        this.input.on("pointerdown", this.spinWheel, this);
    }

    spinWheel() {
        if (this.canSpin) {
            this.prizeText.setText("");
            var rounds = Phaser.Math.Between(4, 6);
            var degrees = 360 / gameOptions.slices; // Calculate the degrees per slice
            var extraDegrees = Phaser.Math.Between(0, degrees - 1); // Get a random extra degree within a slice
            var totalDegrees = 360 * rounds + extraDegrees; // Calculate the total degrees to rotate

            this.canSpin = false;
            this.tweens.add({
                targets: [this.wheel],
                angle: totalDegrees,
                duration: gameOptions.rotationTime,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function (tween) {
                    var prizeIndex = gameOptions.slices - 1 - Math.floor(totalDegrees / degrees);
                    this.prizeText.setText(gameOptions.slicePrizes[prizeIndex]);
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
