var game;
        var gameOptions = {
            slices: 12,
            slicePrizes: [
                "🎉 YOU WON 10 Rs",
                "🎉 YOU WON 100 Rs",
                "🎉 YOU WON 200 Rs",
                "🎉 YOU WON 500 Rs",
                "🎉 YOU WON 1000 Rs",
                "🎉 YOU WON 2000 Rs",
                "🎉 YOU WON 4000 Rs",
                "🎉 YOU WON 10000 Rs",
                "🎉 YOU WON 20000 Rs",
                "🎉 YOU WON 50000 Rs",
                "🎉 YOU WON 100000 Rs",
                "🎉 YOU WON 200000 Rs"
            ],
            rotationTimeRange: {
                min: 5000,
                max: 10000
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
                this.prizeText = this.add.bitmapText(game.config.width / 2, game.config.height - 35, "Rajdhani", "SPIN TO WIN", 64);
                this.prizeText.setOrigin(0.5);
                this.canSpin = true;
                this.input.on("pointerdown", this.spinWheel, this);
            }
            spinWheel() {
                if (this.canSpin) {
                    this.prizeText.setText("");
                    var rounds = Phaser.Math.Between(4, 6);
                    var degrees = Phaser.Math.Between(0, 360);
                    var totalDegrees = 360 * rounds + degrees;
                    var prize = gameOptions.slices - 1 - Math.floor((totalDegrees % 360) / (360 / gameOptions.slices));
                    this.canSpin = false;
                    var rotationTime = Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max);
                    this.tweens.add({
                        targets: [this.wheel],
                        angle: 360 * rounds + degrees,
                        duration: rotationTime,
                        ease: "Cubic.easeOut",
                        callbackScope: this,
                        onComplete: function (tween) {
                            this.prizeText.setText(gameOptions.slicePrizes[prize]);
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