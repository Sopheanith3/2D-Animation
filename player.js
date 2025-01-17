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
        this.x = 0;
        this.y = 100;
        this.scale = 1.6; 
    }

    update() {
        this.x += this.speed * this.game.clockTick;
        if (this.x > this.game.ctx.canvas.width) {
            this.x = 0;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.scale(this.scale, this.scale);
        this.animator.drawFrame(this.game.clockTick, ctx, this.x / this.scale, this.y / this.scale);
        ctx.restore();
    }
}