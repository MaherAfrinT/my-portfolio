from PIL import Image

img = Image.open('src/assets/cyber-cat-sprite.png').convert('L')
width, height = img.size
pixels = img.load()

# Find non-empty rows
non_empty_rows = []
for y in range(height):
    row_sum = 0
    for x in range(width):
        if pixels[x, y] > 50:
            row_sum += 1
            break # Just need to know if it's not empty
    if row_sum > 0:
        non_empty_rows.append(y)

if len(non_empty_rows) > 0:
    bounds = []
    # group contiguous non-empty rows
    start = non_empty_rows[0]
    prev = start
    for r in non_empty_rows[1:]:
        if r - prev > 5: # Gap of > 5 pixels means new row
            bounds.append((start, prev))
            start = r
        prev = r
    bounds.append((start, prev))
    print("Row bounding boxes (top, bottom):")
    for b in bounds:
        print(b)
else:
    print("Empty image?")
