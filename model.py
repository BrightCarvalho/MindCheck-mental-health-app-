from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image

# Load from your local folder
processor = TrOCRProcessor.from_pretrained("./models/models--microsoft--trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("./models/models--microsoft--trocr-base-handwritten")

image = Image.open("example.png").convert("RGB")

# Inference
pixel_values = processor(images=image, return_tensors="pt").pixel_values
generated_ids = model.generate(pixel_values)
generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

print("Predicted text:", generated_text)
