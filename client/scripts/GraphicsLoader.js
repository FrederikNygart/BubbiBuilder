/*jshint esversion: 6 */

class GraphicsLoader {
    static loadImages(images, onLoaded) {

        // Tutorial Note: As water is loaded first it will be represented by a 0 on the map and land will be a 1.
        var tileGraphicsLoaded = 0;

        for (var i = 0; i < images.length; i++) {

            images[i].onload = imageLoaded;
        }
        function imageLoaded() {
            // Once the image is loaded increment the loaded graphics count and check if all images are ready.
            tileGraphicsLoaded++;
            if (tileGraphicsLoaded === images.length) {
                onLoaded();
            }
        }

    }


}


module.exports = GraphicsLoader;
