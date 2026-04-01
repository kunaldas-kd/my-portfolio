import cv2
from paddleocr import PaddleOCR, draw_ocr
from PIL import Image
import numpy as np

# 1) Basic preprocessing (optional but often helpful)
def preprocess_image(input_path):
    img = cv2.imread(input_path)
    if img is None:
        raise FileNotFoundError(f"Could not read image: {input_path}")
    # convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # contrast improvement
    gray = cv2.convertScaleAbs(gray, alpha=1.3, beta=10)
    # light denoise
    den = cv2.fastNlMeansDenoising(gray, h=10)
    # adaptive threshold to emphasize strokes (optional)
    thr = cv2.adaptiveThreshold(den, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                cv2.THRESH_BINARY, 31, 10)
    # return both original and binarized; detection sometimes prefers original
    return img, thr

# 2) Initialize OCR
# Set lang to the script you expect; "en" is default. For multilingual try "en" or "ch", etc.
ocr = PaddleOCR(use_angle_cls=True, lang="en")  # download models on first run

# 3) Run OCR
image_path = "handwriting.jpg"  # replace with your path
orig, binarized = preprocess_image(image_path)

# Try detection+recognition on original first (often better for detection)
result = ocr.ocr(orig, cls=True)

# 4) Print text results
lines = []
for page in result:               # result can be paginated
    for det in page:              # each detection
        box, (text, conf) = det
        lines.append((text, conf))
        print(f"{text} (conf={conf:.3f})")

# 5) Optional: visualize detections
image = Image.fromarray(cv2.cvtColor(orig, cv2.COLOR_BGR2RGB))
boxes = [d[0] for d in result[0]] if result else []
txts = [d[1][0] for d in result[0]] if result else []
scores = [d[1][1] for d in result[0]] if result else []
im_show = draw_ocr(image, boxes, txts, scores, font_path=None)
im_show = Image.fromarray(im_show)
im_show.save("handwriting_ocr_vis.jpg")
print("Saved visualization to handwriting_ocr_vis.jpg")
