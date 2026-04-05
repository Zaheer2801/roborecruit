from PIL import Image
import sys

def make_transparent(img_path, output_path):
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    # Identify near-white logic + antialiasing edges (Tolerance)
    for item in datas:
        # If pixels are basically white
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

make_transparent("public/intro-logo.png", "public/intro-logo-transparent.png")
