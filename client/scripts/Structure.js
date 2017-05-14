(function() {
    /**
     * Structure object modelling all structures to place in the map
     * including building blocks.
     */
    function Structure(x, y, image, health) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.health = health;
    }

    module.exports = Structure;
})();