class Game {
    constructor(save=null) {
        // todo load from file
        this.world = new World(save);
        this.player = new Player(this.world, save);
        this.playerScreenPos = new AVector(canvas.width/2, canvas.height/2);
    }

    update(delta) {
        const T = delta / timeUnit;

        this.world.update(T);  // todo add list (in world class?) that knows blocks that have particles active, and update those (in world.update?)
        this.player.update(T);

        this.setPlayerScreenPos();

        // mouse interaction
        if (mouse.lmb) {
            let blockUnderMouse = new AVector(Math.floor(this.player.pos.x + (mouse.pos.x - this.playerScreenPos.x) / blockSize), Math.floor(this.player.pos.y + (mouse.pos.y - this.playerScreenPos.y) / blockSize));  // equation solved for i (see block drawing above): SCREEN_DRAW_POS.x = this.playerScreenPos.x + (i - this.player.pos.x) * blockSize
            if (this.world.blockGrid[blockUnderMouse.x][blockUnderMouse.y].id !== 0) {
                this.world.blockGrid[blockUnderMouse.x][blockUnderMouse.y].break(500 * T);
            }
        } else if (mouse.mmb) {
            let blockUnderMouse = new AVector(Math.floor(this.player.pos.x + (mouse.pos.x - this.playerScreenPos.x) / blockSize), Math.floor(this.player.pos.y + (mouse.pos.y - this.playerScreenPos.y) / blockSize));
            if (this.world.blockGrid[blockUnderMouse.x][blockUnderMouse.y].id === 0) {
                // TODO dont place on player
                if (Math.floor(this.player.pos.x % 2) === 0) {
                    this.world.blockGrid[blockUnderMouse.x][blockUnderMouse.y].turnToBlock(2);
                }
            }
        }
    }

    setPlayerScreenPos() {
        this.playerScreenPos.set(canvas.width/2, canvas.height/2);
        // x world border on screen
        if (this.player.pos.x < canvas.width/2 / blockSize) {
            this.playerScreenPos.add(this.player.pos.x * blockSize - canvas.width/2, 0);
        } else if (this.player.pos.x > worldSize.x - canvas.width/2 / blockSize) {
            this.playerScreenPos.add((this.player.pos.x - (worldSize.x - canvas.width/2 / blockSize)) * blockSize, 0);
        }
        // y world border on screen
        if (this.player.pos.y < canvas.height/2 / blockSize) {
            this.playerScreenPos.add(0, this.player.pos.y * blockSize - canvas.height/2);
        } else if (this.player.pos.y > worldSize.y - canvas.height/2 / blockSize) {
            this.playerScreenPos.add(0, (this.player.pos.y - (worldSize.y - canvas.height/2 / blockSize)) * blockSize);
        }
    }

    draw() {
        cx.fillStyle = this.world.background;
        cx.fillRect(0, 0, canvas.width, canvas.height);

        // draw world that is on screen
        for (let i = Math.max(0, Math.floor(this.player.pos.x - this.playerScreenPos.x/blockSize));
             i <= Math.min(worldSize.x-1, Math.floor(this.player.pos.x + (canvas.width-this.playerScreenPos.x)/blockSize)); i++) {
            for (let j = Math.max(0, Math.floor(this.player.pos.y - this.playerScreenPos.y/blockSize));
                 j <= Math.min(worldSize.y-1, Math.floor(this.player.pos.y + (canvas.height-this.playerScreenPos.y)/blockSize)); j++) {
                if (this.world.blockGrid[i][j].id !== 0) {
                    cx.drawImage(this.world.blockSprites[this.world.blockGrid[i][j].id - 1], this.playerScreenPos.x + (i - this.player.pos.x) * blockSize, this.playerScreenPos.y + (j - this.player.pos.y) * blockSize, blockSize, blockSize);
                    if (this.world.blockGrid[i][j].broken > 0) {
                        cx.drawImage(this.world.blockDestructionSprites[Math.ceil(this.world.blockGrid[i][j].broken / this.world.blockDestructionSprites.length) - 1], this.playerScreenPos.x + (i - this.player.pos.x) * blockSize, this.playerScreenPos.y + (j - this.player.pos.y) * blockSize, blockSize, blockSize);
                    }
                }
            }
        }

        // todo dev
//        if (mouse.lmb) {
//            cx.lineWidth = sc(2);
//            cx.strokeStyle = "black";
//            cx.beginPath();
//            cx.moveTo(this.playerScreenPos.x, this.playerScreenPos.y);
//            cx.lineTo(mouse.pos.x, mouse.pos.y);
//            cx.stroke();
//        }

        cx.fillStyle = this.player.color;
        cx.beginPath();
        cx.arc(this.playerScreenPos.x, this.playerScreenPos.y, this.player.radius * blockSize, 0, 2*Math.PI);
        cx.fill();

        // lighting overlay
        //cx.save();
        //cx.globalAlpha = 0.4;
        //cx.fillStyle = "rgb(13,31,79)";
        //cx.fillRect(0, 0, canvas.width, canvas.height);
        //cx.globalAlpha = 0.1;
        //cx.fillStyle = "rgb(188,82,11)";
        //cx.fillRect(0, 0, canvas.width, canvas.height);
        //cx.restore();
    }
}