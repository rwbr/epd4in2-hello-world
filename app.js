const epd = require('epd4in2')

const font = '/home/pi/bauhaus.ttf';
const fontSize = 26

async function refreshDisplay(message) {
  await epd.init();
  let img = await epd.getImageBuffer('landscape');

  img.filledRectangle(
    Math.round(10), Math.round(10),
    Math.round(80), Math.round(20),
    epd.colors.white)

  let [xll, yll, xlr, ylr, xur, yur, xul, yul] = img.stringFTBBox(epd.colors.white, font, fontSize, 0, 0, 0, message)
 
  // Center the message
  img.stringFT(epd.colors.white, font, fontSize, 0,
    Math.round(img.width / 2 - (xur - xul) / 2),
    Math.round(img.height / 2 + (yll - yul) / 2),
    message)

  img.negate()
 
  await epd.displayImageBuffer(img);
  await epd.sleep();
}
 
 
refreshDisplay("Hello World!")

