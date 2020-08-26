const fs = require('fs');
const Paint = require('./paint');

module.exports = class Grid {

    constructor(path) {
        this.grid = JSON.parse(fs.readFileSync(path));
        console.log(`Grid Definition: ${JSON.stringify(this.grid.viewspaces)}`);
    }

    paint(img) {
        for (const view of this.grid.viewspaces) {
            console.log(`Painting view ${JSON.stringify(view)}`);
            console.log(`x: ${view.position.pos_x}`);
            console.log(`y: ${view.position.pos_y}`);
            console.log(`width: ${view.dimension.width}`);
            console.log(`height: ${view.dimension.height}`);
            console.log(`inverse: ${view.inverse}`);
            img = Paint.viewSpace(img, view.position.pos_x, view.position.pos_y, view.dimension.width, view.dimension.height, view.topic, view.inverse);
        }
        return img;
    };
}
