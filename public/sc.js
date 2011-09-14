var grayscale_from_pixel, grayscale_from_rgb, hue_from_pixel, hue_from_rgb, hue_map_from_pixels, start, to_grayscale;
hue_from_rgb = function(r, g, b) {
  if (r === b && b === g) {
    return 0;
  } else {
    return ((180 / Math.PI * Math.atan2((2 * r) - g - b, Math.sqrt(3) * (g - b))) - 90) % 360;
  }
};
hue_from_pixel = function(pixel) {
  return hue_from_rgb(pixel[0], pixel[1], pixel[2]);
};
hue_map_from_pixels = function(pixels) {
  var hues, i, pos, _ref;
  hues = [];
  for (i = 0, _ref = pixels.length / 4; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
    pos = 4 * i;
    hues.push(hue_from_pixel(pixels.slice(pos, (pos + 3 + 1) || 9e9)));
  }
  return hues;
};
grayscale_from_pixel = function(pixel) {
  return grayscale_from_rgb(pixel[0], pixel[1], pixel[2]);
};
grayscale_from_rgb = function(r, g, b) {
  var luminance;
  luminance = r * 0.3 + g * 0.59 + b * 0.11;
  luminance = Math.floor(luminance);
  return [luminance, luminance, luminance, 0];
};
to_grayscale = function(canvas) {
  var context, gray, gray_pixel, i, pixels, pos, _ref;
  context = canvas.getContext("2d");
  pixels = context.getImageData(0, 0, context.width, context.height);
  gray = [];
  for (i = 0, _ref = pixels.length / 4; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
    pos = 4 * i;
    gray_pixel = grayscale_from_pixel(pixels.slice(pos, (pos + 3 + 1) || 9e9));
    gray = concat(gray, gray_pixel);
  }
  return context.putImageData(gray, 0, 0);
};
start = function() {
  var canvas, context, source, _ref;
  canvas = document.getElementById("sc");
  source = document.getElementById("source");
  _ref = [source.width, source.height], canvas.width = _ref[0], canvas.height = _ref[1];
  context = canvas.getContext("2d");
  context.drawImage(source, 0, 0);
  return to_grayscale(canvas);
};
window.onload = start;