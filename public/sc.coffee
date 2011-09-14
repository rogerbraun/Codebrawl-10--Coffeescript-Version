hue_from_rgb = (r, g, b) ->
  if r == b and b == g 
    0
  else
    (180 / Math.PI * Math.atan2((2 * r) - g - b, Math.sqrt(3) * (g - b)) - 90)

hue_from_pixel = (pixel) ->
  hue_from_rgb(pixel[0], pixel[1], pixel[2])

hue_map_from_pixels = (pixels) ->
  hues = []
  for i in [0...pixels.length / 4 ]
    pos = 4 * i
    hues.push hue_from_pixel(pixels[pos..pos+3])
  hues

color_distance = (pixel, poxel) ->
  a = (360 + (hue_from_pixel(pixel) - hue_from_pixel(poxel))) % 360
  b = (360 + (hue_from_pixel(poxel) - hue_from_pixel(pixel))) % 360
  Math.min(a, b)

grayscale_from_pixel = (pixel) ->
  grayscale_from_rgb(pixel[0], pixel[1], pixel[2])

grayscale_from_rgb = (r, g, b) ->
  luminance = r * 0.3 + g * 0.59 + b * 0.11
  luminance = Math.floor(luminance)
  [luminance, luminance, luminance, 0] 

set_pixel = (pixels, pos, value) ->
  pos = pos * 4
  pixels[pos] = value[0]
  pixels[pos+1] = value[1]
  pixels[pos+2] = value[2]

get_pixel = (pixels, pos) ->
  pos = pos * 4
  [pixels[pos], pixels[pos+1], pixels[pos+2], pixels[pos+3]]
   
to_grayscale = (canvas) ->
  context = canvas.getContext("2d")
  image_data = context.getImageData(0,0,canvas.width, canvas.height)
  pixels = image_data.data
  out = []
  for i in [0...pixels.length / 4]
    set_pixel(pixels, i, grayscale_from_pixel(get_pixel(pixels, i)))
  context.putImageData(image_data , 0, 0)

selective_color = (canvas, color, delta) ->
  context = canvas.getContext("2d")
  image_data = context.getImageData(0,0,canvas.width, canvas.height)
  pixels = image_data.data
  out = []
  for i in [0...pixels.length / 4]
    current_pixel = get_pixel(pixels, i)
    distance = color_distance(current_pixel, color)
    if distance > delta
      set_pixel(pixels, i, grayscale_from_pixel(get_pixel(pixels, i)))
  context.putImageData(image_data , 0, 0)
  
reset_image = () ->
  canvas = document.getElementById("sc")
  source = document.getElementById("source")
  [canvas.width, canvas.height] = [source.width, source.height]
  context = canvas.getContext("2d")
  context.drawImage(source,0,0)

get_cursor_position = (e, obj) ->
  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
  x -= obj.offsetLeft
  y -= obj.offsetTop
  [x,y]
  

select_color = (event) ->
  reset_image()
  canvas = this
  [x, y] = get_cursor_position(event, canvas)
  pos = x + y * canvas.width
  context = canvas.getContext("2d")
  image_data = context.getImageData(0,0,canvas.width, canvas.height)
  pixels = image_data.data
  
  color = get_pixel(pixels, pos)
  selective_color(canvas, color, 14)

start = () -> 
  reset_image()
  canvas = document.getElementById("sc")
  selective_color(canvas, [0,124,209], 14) 
  canvas.onclick = select_color

window.onload = start

