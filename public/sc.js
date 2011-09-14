var color_distance, get_cursor_position, get_pixel, grayscale_from_pixel, grayscale_from_rgb, hue_from_pixel, hue_from_rgb, hue_map_from_pixels, reset_image, select_color, selective_color, set_pixel, start, to_grayscale;
hue_from_rgb = function(r, g, b) {
  if (r === b && b === g) {
    return 0;
  } else {
    return 180 / Math.PI * Math.atan2((2 * r) - g - b, Math.sqrt(3) * (g - b)) - 90;
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
color_distance = function(pixel, poxel) {
  var a, b;
  a = (360 + (hue_from_pixel(pixel) - hue_from_pixel(poxel))) % 360;
  b = (360 + (hue_from_pixel(poxel) - hue_from_pixel(pixel))) % 360;
  return Math.min(a, b);
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
set_pixel = function(pixels, pos, value) {
  pos = pos * 4;
  pixels[pos] = value[0];
  pixels[pos + 1] = value[1];
  return pixels[pos + 2] = value[2];
};
get_pixel = function(pixels, pos) {
  pos = pos * 4;
  return [pixels[pos], pixels[pos + 1], pixels[pos + 2], pixels[pos + 3]];
};
to_grayscale = function(canvas) {
  var context, i, image_data, out, pixels, _ref;
  context = canvas.getContext("2d");
  image_data = context.getImageData(0, 0, canvas.width, canvas.height);
  pixels = image_data.data;
  out = [];
  for (i = 0, _ref = pixels.length / 4; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
    set_pixel(pixels, i, grayscale_from_pixel(get_pixel(pixels, i)));
  }
  return context.putImageData(image_data, 0, 0);
};
selective_color = function(canvas, color, delta) {
  var context, current_pixel, distance, i, image_data, out, pixels, _ref;
  context = canvas.getContext("2d");
  image_data = context.getImageData(0, 0, canvas.width, canvas.height);
  pixels = image_data.data;
  out = [];
  for (i = 0, _ref = pixels.length / 4; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
    current_pixel = get_pixel(pixels, i);
    distance = color_distance(current_pixel, color);
    if (distance > delta) {
      set_pixel(pixels, i, grayscale_from_pixel(get_pixel(pixels, i)));
    }
  }
  return context.putImageData(image_data, 0, 0);
};
reset_image = function() {
  var canvas, context, source, _ref;
  canvas = document.getElementById("sc");
  source = document.getElementById("source");
  _ref = [source.width, source.height], canvas.width = _ref[0], canvas.height = _ref[1];
  context = canvas.getContext("2d");
  return context.drawImage(source, 0, 0);
};
get_cursor_position = function(e, obj) {
  var x, y;
  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  x -= obj.offsetLeft;
  y -= obj.offsetTop;
  return [x, y];
};
select_color = function(event) {
  var canvas, color, context, image_data, pixels, pos, x, y, _ref;
  reset_image();
  canvas = this;
  _ref = get_cursor_position(event, canvas), x = _ref[0], y = _ref[1];
  pos = x + y * canvas.width;
  context = canvas.getContext("2d");
  image_data = context.getImageData(0, 0, canvas.width, canvas.height);
  pixels = image_data.data;
  color = get_pixel(pixels, pos);
  return selective_color(canvas, color, 14);
};
start = function() {
  var canvas;
  reset_image();
  canvas = document.getElementById("sc");
  selective_color(canvas, [0, 124, 209], 14);
  return canvas.onclick = select_color;
};
window.onload = start;