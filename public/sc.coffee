hue_from_rgb = (r, g, b) ->
  if r == b and b == g 
    0
  else
    ((180 / Math.PI * Math.atan2((2 * r) - g - b, Math.sqrt(3) * (g - b))) - 90) % 360

hue_from_pixel = (pixel) ->
  hue_from_rgb(pixel[0], pixel[1], pixel[2])

hue_map_from_pixels = (pixels) ->
  hues = []
  for i in [0...pixels.length / 4 ]
    pos = 4 * i
    hues.push hue_from_pixel(pixels[pos..pos+3])
  hues

grayscale_from_pixel = (pixel) ->
  grayscale_from_rgb(pixel[0], pixel[1], pixel[2])

grayscale_from_rgb = (r, g, b) ->
  luminance = r * 0.3 + g * 0.59 + b * 0.11
  luminance = Math.floor(luminance)
  [luminance, luminance, luminance, 0] 

to_grayscale = (canvas) ->
  context = canvas.getContext("2d")
  pixels = context.getImageData(0,0,context.width, context.height)
  gray = []
  for i in [0...pixels.length / 4]
    pos = 4 * i
    gray_pixel = grayscale_from_pixel(pixels[pos..pos+3])
    gray = concat(gray, gray_pixel)
  context.putImageData(gray, 0, 0)


start = () -> 
  canvas = document.getElementById("sc")
  source = document.getElementById("source")
  [canvas.width, canvas.height] = [source.width, source.height]
  context = canvas.getContext("2d")
  context.drawImage(source,0,0)
  to_grayscale(canvas)

window.onload = start

