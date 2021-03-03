const worldSize = new AVector(16, 9);
const blockSize = canvas.height / settings.blocksInHeight;

class World {
    constructor(save) {
        if (save == null) {
            this.generate();
        } else {
            this.load();
        }
        this.background = cx.createLinearGradient(0, 0, 0, canvas.height);
        this.background.addColorStop(0, "rgb(157,176,174)");
        this.background.addColorStop(0.4, "rgb(127,140,139)");
        this.background.addColorStop(1, "rgb(103,112,112)");

        this.blockSprite = new Image();  this.blockSprite.src = resPath + "block_1.png";
    }

    update(delta, activeBounds) {

    }

    load() {

    }

    generate() {
        this.blockGrid = new Array(worldSize.x);
        for (let i = 0; i < worldSize.x; i++) {
            this.blockGrid[i] = new Array(worldSize.y);
            for (let j = 0; j < Math.floor(worldSize.y * 0.6); j++) {
                this.blockGrid[i][j] = new Block(0);
            }
            for (let j = Math.floor(worldSize.y * 0.6); j < worldSize.y; j++) {
                this.blockGrid[i][j] = new Block(1);
            }
        }
    }
}