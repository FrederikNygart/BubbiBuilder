
(function () {
    class IsometricHelper {
        static tileToCanvas(tileX, tileY, offsetX, offsetY, tileWidth, tileHeight) {
            var TILE_WIDTH_HALF = tileWidth / 2;
            var TILE_HEIGHT_HALF = tileHeight / 2;

            return {
                x: (tileX - tileY) * TILE_WIDTH_HALF + offsetX,
                y: (tileX + tileY) * TILE_HEIGHT_HALF + offsetY
            };
        }

        static canvasToTile (canvasX, canvasY, offsetX, offsetY, tileWidth, tileHeight) {
            var TILE_WIDTH_HALF = tileWidth / 2;
            var TILE_HEIGHT_HALF = tileHeight / 2;

            var xWithOffset = canvasX - offsetX;
            var yWithOffset = canvasY - offsetY;

            var calculatedX = Math.floor((xWithOffset / TILE_WIDTH_HALF + yWithOffset / TILE_HEIGHT_HALF) / 2);
            var calculatedY = Math.floor((yWithOffset / TILE_HEIGHT_HALF - xWithOffset / TILE_WIDTH_HALF) / 2);

            return {
                x: calculatedX,
                y: calculatedY
            };
        }
    }

    module.exports = IsometricHelper;
})();