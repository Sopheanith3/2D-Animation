(function () {
    "use strict";

    const TILE_SIZE = 125;
    const MOVEMENT_SPEED = 2.0; // Increased speed for faster movement
    const FPS = 60;
    const FRAME_TIME = 1000 / FPS;

    // Animation prototype
    const Animation = function (frame_set, delay = 10) { // Decreased delay for faster animation
        this.count = 0;
        this.delay = delay;
        this.frame = frame_set[0];
        this.frame_index = 0;
        this.frame_set = frame_set;
    };

    Animation.prototype = {
        /**
         * Changes the current animation frame set.
         * @param {Array} frame_set - The new set of animation frames.
         * @param {number} [delay=10] - Delay between frame changes.
         */
        change: function (frame_set, delay = 10) {
            if (this.frame_set !== frame_set) {
                this.count = 0;
                this.delay = delay;
                this.frame_index = 0;
                this.frame_set = frame_set;
                this.frame = this.frame_set[this.frame_index];
            }
        },

        

        /**
         * Updates the current animation frame.
         */
        update: function () {
            this.count++;
            if (this.count >= this.delay) {
                this.count = 0;
                this.frame_index = (this.frame_index === this.frame_set.length - 1) ? 0 : this.frame_index + 1;
                this.frame = this.frame_set[this.frame_index];
            }
        }
    };

    const buffer = document.createElement("canvas").getContext("2d", { alpha: false });
    const canvas = document.querySelector("canvas").getContext("2d", { alpha: false });

    const controls = {
        jump: { active: false, state: false },
        handleKeyEvent: function (event) {
            const isKeyDown = event.type === "keydown";
            switch (event.keyCode) {
                case 38: // Up arrow (Jump)
                    controls.jump.state = isKeyDown;
                    controls.jump.active = isKeyDown;
                    break;
            }
        },
    };

    const player = {
        animation: new Animation([0], 10), // Even faster animation with reduced delay
        isJumping: false,
        height: TILE_SIZE,
        width: TILE_SIZE,
        x: 100,
        y: 150,
        xVelocity: MOVEMENT_SPEED,
        yVelocity: 0,
        direction: 1,
        isMoving: true,
    };

    const spriteSheet = {
        animations: {
            idle: [0],
            walk: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        },
        image: new Image(),
    };

    let lastTime = performance.now();
    let accumulator = 0;

    const gameLoop = function (timestamp) {
        let deltaTime = timestamp - lastTime;
        deltaTime = Math.min(deltaTime, 32);
        lastTime = timestamp;

        accumulator += deltaTime;

        while (accumulator >= FRAME_TIME) {
            if (controls.jump.active && !player.isJumping) {
                player.isJumping = true;
                player.yVelocity = -15;
            }

            if (player.isMoving) {
                player.animation.change(spriteSheet.animations.walk, 10); // Even faster animation
            }

            player.yVelocity += 0.8; // Gravity
            player.x += player.xVelocity;
            player.y += player.yVelocity;

            if (player.y + player.height > buffer.canvas.height - 2) {
                player.isJumping = false;
                player.y = buffer.canvas.height - 2 - player.height;
                player.yVelocity = 0;
            }

            if (player.x + player.width < 0) {
                player.x = buffer.canvas.width;
            } else if (player.x > buffer.canvas.width) {
                player.x = -player.width;
            }

            player.animation.update();
            accumulator -= FRAME_TIME;
        }

        draw();
        window.requestAnimationFrame(gameLoop);
    };

    const draw = function () {
        buffer.fillStyle = "#7ec0ff";
        buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);

        buffer.fillStyle = "#009900";
        buffer.fillRect(0, buffer.canvas.height - 2, buffer.canvas.width, 4);

        const drawX = Math.floor(player.x);
        const drawY = Math.floor(player.y);

        buffer.save();
        if (player.direction === -1) {
            buffer.translate(drawX + TILE_SIZE, drawY);
            buffer.scale(-1, 1);
        } else {
            buffer.translate(drawX, drawY);
        }

        buffer.drawImage(
            spriteSheet.image,
            player.animation.frame * TILE_SIZE, 0,
            TILE_SIZE, TILE_SIZE,
            0, 0,
            TILE_SIZE, TILE_SIZE
        );

        buffer.restore();

        canvas.imageSmoothingEnabled = false;
        canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
        canvas.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, canvas.canvas.width, canvas.canvas.height);
    };

    const adjustCanvasSize = function () {
        canvas.canvas.width = document.documentElement.clientWidth - 32;
        if (canvas.canvas.width > document.documentElement.clientHeight) {
            canvas.canvas.width = document.documentElement.clientHeight;
        }
        canvas.canvas.height = canvas.canvas.width * 0.5;
        canvas.imageSmoothingEnabled = false;
    };

    buffer.canvas.width = 550;
    buffer.canvas.height = 300;

    window.addEventListener("resize", adjustCanvasSize);
    window.addEventListener("keydown", controls.handleKeyEvent);
    window.addEventListener("keyup", controls.handleKeyEvent);

    adjustCanvasSize();

    spriteSheet.image.addEventListener("load", function () {
        player.animation.change(spriteSheet.animations.walk, 10); // Even faster animation on load
        window.requestAnimationFrame(gameLoop);
    });

    spriteSheet.image.src = "Walk.png";
})();
