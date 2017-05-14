(function () {
    function Sprite(options) {
        var that = {},
            frameIndex = 0,
            tickCount = 0;

        that.ticksPerFrame = options.ticksPerFrame;
        that.numberOfFrames = options.numberOfFrames;
        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;
        that.x = options.x;
        that.y = options.y;

        that.update = function () {
            tickCount += 1;

            if (tickCount > that.ticksPerFrame) {
                tickCount = 0;
                //If the current frame index is in range
                if (frameIndex < that.numberOfFrames - 1) {
                    // Go to next frame
                    frameIndex += 1;
                } else {
                    frameIndex = 0;
                }
            }
        };

        that.render = function () {
            // Draw the animation
            that.context.drawImage(
                that.image,
                frameIndex * that.width / that.numberOfFrames,
                0,
                that.width / that.numberOfFrames,
                that.height,
                that.x,
                that.y,
                that.width / that.numberOfFrames,
                that.height);
        };
        return that;
    }

    module.exports = Sprite;
})();