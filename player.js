class Player {
    constructor(game) {
        this.game = game;
        this.slowness = 0;
        this.animator = new Animator(ASSET_MANAGER.getAsset("./assets/Walk.png"),
            0,
            0,
            128,
            128,
            8,
            0.15
        );
        this.speed = 25;
        this.x = 128;
        this.y = 155;
        // Add scale factor
        this.scale = 2.5; // Adjust this value to make the sprite larger or smaller
    }

    update() {
        this.x += this.speed * this.game.clockTick;
        if (this.x > this.game.ctx.canvas.width) {
            this.x = 0;
        }
    }

    draw(ctx) {
        //console.log(`Drawing at: (${this.x}, ${this.y})`);
        ctx.save();
        ctx.scale(this.scale, this.scale);
        this.animator.drawFrame(this.game.clockTick, ctx, this.x / this.scale, this.y / this.scale);
        ctx.restore();
    }
}