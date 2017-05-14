/*jshint esversion: 6 */
class TileMap {
    constructor(width, height) {
        this.map = [];

        // Generate maps with all grass tiles
        for (var i = 0; i < width; i++) {
            this.map[i] = [];
            for (var j = 0; j < height; j++) {
                this.map[i][j] = 0;
            }
        }
    }

    getMap (){
        return this.map;
    }

    setMap(map) {
        this.map = map;
    }

    updateTile(x, y, value) {
        this.map[x][y] = value;
    }
}

module.exports = TileMap;