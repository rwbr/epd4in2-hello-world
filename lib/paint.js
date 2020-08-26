const epd7x5 = require("epd7x5");

const black = 0xffffff;
const white = 0;

const grid_unit = 32;

// Maximum values
const screen_width = 640;
const screen_height = 384;

const max_grid_x = screen_width / grid_unit - 1; // 19
const max_grid_y = screen_height / grid_unit - 1; // 11

// const font = '/usr/share/fonts/truetype/amiga4ever/amiga4ever.ttf';
const font = '/usr/share/fonts/truetype/freepixel/FreePixel.ttf';

module.exports = {
  black,
  white,
  
  triangle(img, x, y, size, direction = "DOWN", filled = true, color = black) {
    console.log(
      `*** Drawing triangle at ${x},${y} with size: ${size}, dir: ${direction} and color: ${color}`
    );
    if (typeof size === "string") {
      if (size === "S") {
        size = 40;
      } else if (size === "M") {
        size = 70;
      } else {
        size = 100;
      }
    }
    
    let points = [];
    if (direction.toUpperCase() === "DOWN") {
      // Draw a triangle pointing down
      points = [
        { x: x, y: y },
        { x: x + size, y: y },
        { x: x + size / 2, y: y + size }
      ];
    } else {
      // Draw a triangle pointing up
      points = [
        { x: x + size / 2, y: y },
        { x: x + size, y: y + size },
        { x: x, y: y + size }
      ];
    }
    if (filled) {
      img.filledPolygon(points, color);
    } else {
      img.polygon(points, color);
    }
    return img;
  },
  
  rectangle(img, x, y, size_x, size_y, filled = true, color = black) {
    console.log(
      `*** Drawing rectangle at ${x},${y} with size: ${size_x}, ${size_y}, filled: ${filled} and color: ${color}`
    );

    if (x + size_x >= screen_width) {
      size_x = screen_width - 1 - x;
    }
    if (y + size_y >= screen_height) {
      size_y = screen_height - 1 - y;
    }

    if (filled) {
      img.filledRectangle(x, y, x + size_x, y + size_y, color);
    } else {
      img.rectangle(x, y, x + size_x, y + size_y, color);
    }
    return img;
  },
  
  square(img, x, y, size, filled, color = black) {
    return this.rectangle(img, x, y, size, size, filled, color);
  },
  
  circle(img, x, y, diameter, filled = true, color = black) {
    console.log(
      `*** Drawing circle at ${x},${y} with diameter: ${diameter}, filled: ${filled} and color: ${color}`
    );
    if (filled) {
      img.filledArc(x, y, diameter, diameter, 0, 360, color, 0);
    } else {
      img.arc(x, y, diameter, diameter, 0, 360, color);
    }
    return img;
  },
  
  warning_sign(img, x, y, size, color) {
    let inverse = 0;
    (color === black) ? inverse = white : inverse = black;
    img = this.triangle(img, x, y, size, 'UP', true, color);
    let width = Math.round(size / 10);
    let heigth = Math.round(size * 0.4);
    let pos_x = Math.round(x + size / 2 - width / 2);
    let pos_y = Math.round(y + heigth / 1.5);
    img = this.rectangle(img, pos_x , pos_y, width, heigth, true, inverse);
    let diameter = Math.round(size / 7);
    pos_x = Math.round(x + size / 2);
    pos_y = Math.round(y + size - diameter);
    return this.circle(img, pos_x, pos_y, diameter, true, inverse);
  },
  
  line(img, x1, y1, x2, y2, solid = true, color = black) {
    if (solid) {
      return img.line(x1, y1, x2, y2, color);
    } else {
      return img.dashedLine(x1, y1, x2, y2, color);
    }
  },
  
  text(img, x, y, string, color = black) {
    console.log(
      `*** Drawing text ${string} at ${x},${y} color: ${color}`
    );
    const fontSize = 12;
    const angle = -0.0;
    // const font = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';

    return img.stringFT(color, font, fontSize, angle, x + 1, y + 12, string.toUpperCase());
  },

  viewSpace(img, grid_position_x, grid_position_y, grid_width, grid_height, topic = "Topic", inverse = false) {
    if (grid_position_x > max_grid_x) {
      console.log('grid_position_x > max_grid_x');
      return img;
    }
    if (grid_position_y > max_grid_y) {
      console.log('grid_position_y > max_grid_y');
      return img;
    }
    if (grid_position_x + grid_width > max_grid_x+1) {
      console.log('grid_position_x + grid_width > max_grid_x+1');
      return img;
    }
    if (grid_position_y + grid_height > max_grid_y+1) {
      console.log('grid_position_y + grid_height > max_grid_y+1');
      return img;
    }

    const abs_x = grid_position_x * grid_unit;
    const abs_y = grid_position_y * grid_unit;
    const abs_width = grid_width * grid_unit;
    const abs_heigth = grid_height * grid_unit;
    const fontSize = 12;
    const angle = -0.0;
    
    console.log(`viewSpace ${abs_x, abs_y}`);
    let bbox = img.stringFTBBox(black, font, fontSize, angle, abs_x, abs_y, topic.toUpperCase());

    // Topic string too long?
    // xlr - xul
    let bboxWidth = bbox[2] - bbox[0];
    // yll - yul
    let bboxHeight = bbox[1] - bbox[7];
    if (bboxWidth > grid_width * grid_unit) {
      bboxWidth = grid_width * grid_unit;
    }
    if (bboxHeight > grid_height * grid_unit) {
      bboxHeight = grid_height * grid_unit;
    }

    if (inverse) {
      console.log('Pain inverse box');
      img = this.rectangle(img, abs_x, abs_y, abs_width, abs_heigth, true, epd7x5.black);
      img = this.rectangle(img, abs_x, abs_y, bboxWidth, bboxHeight, true, epd7x5.white);
      img = this.rectangle(img, abs_x, abs_y, bboxWidth, bboxHeight, false, epd7x5.black);
      img = this.text(img, abs_x, abs_y, topic, epd7x5.black);
    } else {
      console.log('Pain normal box');
      img = this.rectangle(img, abs_x, abs_y, abs_width, abs_heigth, false, epd7x5.black);
      img = this.rectangle(img, abs_x, abs_y, bboxWidth, bboxHeight, true, epd7x5.black);
      img = this.text(img, abs_x, abs_y, topic, epd7x5.white);
    }
    return img;
  }
};
