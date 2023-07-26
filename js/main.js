var game;
var gameOptions = {
    slices: 12,
    slicePrizes: [
        "🎉 YOU WON 2,00,000 Rs",
        "🎉 YOU WON 1,00,000 Rs",
        "🎉 YOU WON 50,000 Rs",
        "🎉 YOU WON 10,000 Rs",
        "🎉 YOU WON 5000 Rs",
        "🎉 YOU WON 2000 Rs",
        "🎉 YOU WON 1000 Rs",
        "🎉 YOU WON 500 Rs",
        "🎉 YOU WON 100 Rs",
        "🎉 YOU WON 50 Rs",
        "🎉 YOU WON 20 Rs",
        "🎉 YOU WON 10 Rs"
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
        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");
        this.pin.setOrigin(0.5);
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
            document.getElementById("pyro").style.display = "none";
    
            var targetSlice = Phaser.Math.Between(0, gameOptions.slices - 1);
    
            var rounds = Phaser.Math.Between(4, 6);
            var degrees = Phaser.Math.Between(0, 360 / gameOptions.slices);
            var totalDegrees = 360 * rounds + degrees;
            var sliceOffset = (360 / gameOptions.slices) / 2;
            var extraDegrees = sliceOffset + (360 / gameOptions.slices) * targetSlice;
            totalDegrees += extraDegrees;
    
            this.canSpin = false;
            var rotationTime = Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max);
    
            this.tweens.add({
                targets: [this.wheel],
                angle: totalDegrees,
                duration: rotationTime,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function (tween) {
                    var prize = gameOptions.slicePrizes[targetSlice];
                    this.prizeText.setText(prize);
                    this.canSpin = true;
                    document.getElementById("pyro").style.display = "block";
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