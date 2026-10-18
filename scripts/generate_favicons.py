import os
from PIL import Image

def generate_favicons():
    logo_path = os.path.join("public", "logo.png")
    if not os.path.exists(logo_path):
        logo_path = "logo.png"
    
    print(f"Loading master logo from {logo_path}...")
    img = Image.open(logo_path).convert("RGBA")
    
    # Generate ICO file with multiple sizes (16, 32, 48)
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_images = [img.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]
    
    # Save to public/
    public_dir = "public"
    ico_dest = os.path.join(public_dir, "favicon.ico")
    ico_images[0].save(ico_dest, format="ICO", sizes=ico_sizes)
    print(f"Created {ico_dest}")
    
    # Also save to root
    img.resize((32, 32), Image.Resampling.LANCZOS).save("favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    
    png_targets = {
        os.path.join(public_dir, "favicon.png"): (32, 32),
        os.path.join(public_dir, "favicon-32x32.png"): (32, 32),
        os.path.join(public_dir, "favicon-16x16.png"): (16, 16),
        os.path.join(public_dir, "apple-touch-icon.png"): (180, 180),
        os.path.join(public_dir, "icon-192.png"): (192, 192),
        os.path.join(public_dir, "icon-512.png"): (512, 512),
        os.path.join(public_dir, "icon-512-maskable.png"): (512, 512),
    }
    
    for path, size in png_targets.items():
        resized = img.resize(size, Image.Resampling.LANCZOS)
        resized.save(path, "PNG", optimize=True)
        print(f"Created {path} ({size[0]}x{size[1]})")

    # Also generate public/favicon.svg using circular logo embedding
    import io, base64
    buf = io.BytesIO()
    img.resize((128, 128), Image.Resampling.LANCZOS).save(buf, format="PNG", optimize=True)
    b64_data = base64.b64encode(buf.getvalue()).decode('utf-8')
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <clipPath id="ax-circle-clip">
    <circle cx="64" cy="64" r="62" />
  </clipPath>
  <image href="data:image/png;base64,{b64_data}" x="0" y="0" width="128" height="128" clip-path="url(#ax-circle-clip)" />
</svg>
'''
    with open(os.path.join(public_dir, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)
    with open("favicon.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Created public/favicon.svg and favicon.svg")

    print("All favicons successfully generated from logo.png!")

if __name__ == "__main__":
    generate_favicons()
