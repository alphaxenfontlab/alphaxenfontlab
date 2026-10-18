#!/usr/bin/env python3
"""
Extracts genuine demo character glyphs and metadata from 'all fonts/'
without exposing or linking the proprietary .otf files.
Generates:
- public/demo_glyphs/<font-id>/<codepoint>.png (for color/texture fonts)
- public/demo_glyphs/<font-id>/<codepoint>.svg (for vector fonts)
- public/foundry_data/catalog.json
- public/foundry_data/<font-id>.json
"""

import os
import sys
import json
import re
import base64
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FONTS_DIR = 'all fonts'
OUTPUT_GLYPHS_DIR = 'public/demo_glyphs'
OUTPUT_DATA_DIR = 'public/foundry_data'

os.makedirs(OUTPUT_GLYPHS_DIR, exist_ok=True)
os.makedirs(OUTPUT_DATA_DIR, exist_ok=True)

# Curated font profiles matching each font in 'all fonts/'
FONT_PROFILES = {
    'Alphaxen Dragon.otf': {
        'id': 'alphaxen-dragon',
        'name': 'Alphaxen Dragon',
        'category': 'chromatic',
        'subCategory': 'Fantasy & Mythic',
        'theme': 'Dragon Scales & Golden Flame',
        'accent': '#eab308',
        'badge': 'FLAGSHIP CHROMATIC',
        'description': 'A monumental fantasy display typeface embedded with photorealistic scaled armor, golden highlights, and fiery dragon hide textures. Every glyph is an artwork.',
        'specimenWords': ['DRAGON', 'WYVERN', 'LEGEND', 'FIREBORN', 'EMPIRE'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'Alphaxen enofloma.otf': {
        'id': 'alphaxen-enofloma',
        'name': 'Alphaxen Enofloma',
        'category': 'chromatic',
        'subCategory': 'Bio-Luminescent',
        'theme': 'Exotic Flora & Luminous Petals',
        'accent': '#ec4899',
        'badge': 'ORGANIC CHROMATIC',
        'description': 'Bio-luminescent chromatic typography sculpted from rare alien flora, velvety petals, and vibrant neon organic lighting.',
        'specimenWords': ['FLORA', 'BLOOM', 'ORGANIC', 'LUMINOUS', 'PETALS'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'Alphaxen Future.otf': {
        'id': 'alphaxen-future',
        'name': 'Alphaxen Future',
        'category': 'chromatic',
        'subCategory': 'Sci-Fi & Cyber',
        'theme': 'Neon Cyberpunk Hologram',
        'accent': '#06b6d4',
        'badge': 'CYBER CHROMATIC',
        'description': 'Ultra-futuristic cybernetic typography with high-voltage neon glow, layered circuit depth, and holographic surface reflections.',
        'specimenWords': ['FUTURE', 'CYBERNETIC', 'NEO-TOKYO', 'SYNTHESIS', 'HOLOGRAM'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'Alphaxen Galaxy Pro.otf': {
        'id': 'alphaxen-galaxy-pro',
        'name': 'Alphaxen Galaxy Pro',
        'category': 'chromatic',
        'subCategory': 'Sci-Fi & Cosmic',
        'theme': 'Deep Space Nebula & Starlight',
        'accent': '#8b5cf6',
        'badge': 'COSMIC CHROMATIC',
        'description': 'Deep space celestial typography infused with swirling interstellar dust clouds, vibrant nebula purples, and radiant distant stars.',
        'specimenWords': ['GALAXY', 'NEBULA', 'COSMOS', 'INTERSTELLAR', 'STARLIGHT'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'Alphaxen Honey.otf': {
        'id': 'alphaxen-honey',
        'name': 'Alphaxen Honey',
        'category': 'chromatic',
        'subCategory': 'Organic & Fluid',
        'theme': 'Golden Viscous Honey & Droplets',
        'accent': '#f59e0b',
        'badge': 'ORGANIC CHROMATIC',
        'description': 'Warm golden liquid honey frozen in mid-flow, featuring realistic refraction, microscopic bubbles, and luscious dripping curves.',
        'specimenWords': ['HONEY', 'NECTAR', 'LIQUID GOLD', 'SWEETNESS', 'VISCOUS'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'Alphaxen Honey2.otf': {
        'id': 'alphaxen-honey-2',
        'name': 'Alphaxen Honey II',
        'category': 'chromatic',
        'subCategory': 'Organic & Fluid',
        'theme': 'Amber Crystallized Honey Texture',
        'accent': '#d97706',
        'badge': 'ORGANIC CHROMATIC',
        'description': 'Rich crystallized amber honey edition with deeper molasses tones, facet reflections, and tactile viscous character shapes.',
        'specimenWords': ['AMBER', 'MOLASSES', 'HONEYCOMB', 'CRYSTAL', 'ORGANIC'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'Alphaxen Jellyfish.otf': {
        'id': 'alphaxen-jellyfish',
        'name': 'Alphaxen Jellyfish',
        'category': 'chromatic',
        'subCategory': 'Oceanic & Abyssal',
        'theme': 'Bioluminescent Deep Sea Tentacles',
        'accent': '#3b82f6',
        'badge': 'ABYSSAL CHROMATIC',
        'description': 'Translucent deep-ocean creature typography radiating with bioluminescent cyan and violet pulses, fluid membrane tentacles, and watery caustics.',
        'specimenWords': ['JELLYFISH', 'BIOLUMINESCENT', 'ABYSS', 'AQUATIC', 'GLOW'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'Alphaxen Lion.otf': {
        'id': 'alphaxen-lion',
        'name': 'Alphaxen Lion',
        'category': 'chromatic',
        'subCategory': 'Wild & Beast',
        'theme': 'Majestic Lion Mane & Golden Fur',
        'accent': '#ea580c',
        'badge': 'BEAST CHROMATIC',
        'description': 'Primal apex-predator typography sculpted from thick golden savannah mane, sunlight-catching hair filaments, and commanding posture.',
        'specimenWords': ['LION', 'MAJESTY', 'SAVANNAH', 'MONARCH', 'ROAR'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'Alphaxen Lionel.otf': {
        'id': 'alphaxen-lionel',
        'name': 'Alphaxen Lionel',
        'category': 'chromatic',
        'subCategory': 'Luxury & Regal',
        'theme': 'Gilded Royal Lion Crest',
        'accent': '#ca8a04',
        'badge': 'REGAL CHROMATIC',
        'description': 'Aristocratic royal edition featuring gilded crest textures, heraldic lion filigree, and polished yellow gold reflections.',
        'specimenWords': ['LIONEL', 'HERALDIC', 'SOVEREIGN', 'CROWN', 'DYNASTY'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'Alphaxen Ocean Monster.otf': {
        'id': 'alphaxen-ocean-monster',
        'name': 'Alphaxen Ocean Monster',
        'category': 'chromatic',
        'subCategory': 'Oceanic & Abyssal',
        'theme': 'Kraken Deep-Sea Monster Scales',
        'accent': '#0284c7',
        'badge': 'ABYSSAL CHROMATIC',
        'description': 'Mythical abyssal behemoth typography with damp serpent scales, barnacle-encrusted ridges, and deep trench bioluminescence.',
        'specimenWords': ['MONSTER', 'LEVIATHAN', 'TRENCH', 'KRAKEN', 'DEPTHS'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'Alphaxen Orca.otf': {
        'id': 'alphaxen-orca',
        'name': 'Alphaxen Orca',
        'category': 'chromatic',
        'subCategory': 'Oceanic & Beast',
        'theme': 'Glossy Killer Whale Texture',
        'accent': '#38bdf8',
        'badge': 'BEAST CHROMATIC',
        'description': 'High-gloss obsidian and arctic white marine predator typography modeled after the hydrodynamic elegance and speed of the killer whale.',
        'specimenWords': ['ORCA', 'OCEANIC', 'PREDATOR', 'ARCTIC', 'SPEED'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'Alphaxen Perfume.otf': {
        'id': 'alphaxen-perfume',
        'name': 'Alphaxen Perfume',
        'category': 'chromatic',
        'subCategory': 'Luxury & Crystal',
        'theme': 'Crystal Flacon & Prismatic Glass',
        'accent': '#a855f7',
        'badge': 'LUXURY CHROMATIC',
        'description': 'Haute-parfumerie typography evoking hand-blown crystal flacons, refracted lilac and amber scents, and luxurious French editorial poise.',
        'specimenWords': ['PERFUME', 'ESSENCE', 'HAUTE COUTURE', 'CRYSTAL', 'FRAGRANCE'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'AlphaxenMoltenLava-Regular.otf': {
        'id': 'alphaxen-molten-lava',
        'name': 'Alphaxen Molten Lava',
        'category': 'chromatic',
        'subCategory': 'Elemental & Volcanic',
        'theme': 'Cracked Basalt & Glowing Magma',
        'accent': '#ef4444',
        'badge': 'ELEMENTAL CHROMATIC',
        'description': 'Incandescent volcanic typography forged from cooling black basalt rock cracked open by glowing 1200-degree liquid magma veins.',
        'specimenWords': ['MOLTEN', 'VOLCANO', 'MAGMA', 'CRACKED', 'INFERNO'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'AlphaxenNextron-Regular.otf': {
        'id': 'alphaxen-nextron',
        'name': 'Alphaxen Nextron',
        'category': 'vector',
        'subCategory': 'Cyber & Modernist',
        'theme': 'Futuristic Tech Minimalist Grid',
        'accent': '#10b981',
        'badge': 'VECTOR CYBER',
        'description': 'Pure modular tech typeface built on a precision isometric grid with chamfered joints and futuristic aerospace aesthetic.',
        'specimenWords': ['NEXTRON', 'ISOMETRIC', 'GRID', 'MODULAR', 'AEROSPACE'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'AlphaxenOctopus.otf': {
        'id': 'alphaxen-octopus',
        'name': 'Alphaxen Octopus',
        'category': 'chromatic',
        'subCategory': 'Oceanic & Creature',
        'theme': 'Deep Ocean Color Specimen',
        'accent': '#0ea5e9',
        'badge': 'CHROMATIC DISPLAY',
        'description': 'Deep oceanic edition of the Octopus suite, highlighting the anatomical nuance and muscular flexibility of marine mollusks.',
        'specimenWords': ['OCTOPUS', 'AQUATIC', 'FLEXIBLE', 'MARINE', 'MOTION'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'AlphaxenPeacock-Regular.otf': {
        'id': 'alphaxen-peacock',
        'name': 'Alphaxen Peacock',
        'category': 'chromatic',
        'subCategory': 'Nature & Iridescent',
        'theme': 'Iridescent Feather Eye Textures',
        'accent': '#14b8a6',
        'badge': 'NATURE CHROMATIC',
        'description': 'Exquisite avian display typeface dressed in royal peacock plumage, iridescent emerald-cyan barbules, and hypnotic feather eyes.',
        'specimenWords': ['PEACOCK', 'PLUMAGE', 'IRIDESCENT', 'FEATHERS', 'ROYAL'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'AlphaxenPenguin.otf': {
        'id': 'alphaxen-penguin',
        'name': 'Alphaxen Penguin',
        'category': 'chromatic',
        'subCategory': 'Arctic & Polar',
        'theme': 'Antarctic Emperor Penguin Texture',
        'accent': '#38bdf8',
        'badge': 'POLAR CHROMATIC',
        'description': 'Charming yet commanding Antarctic typography inspired by the waterproof plumage, golden auricular flashes, and resilience of the emperor penguin.',
        'specimenWords': ['PENGUIN', 'ANTARCTIC', 'EMPEROR', 'BLIZZARD', 'COLONY'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
    'AlphaxenPenguin2.otf': {
        'id': 'alphaxen-penguin-2',
        'name': 'Alphaxen Penguin II',
        'category': 'chromatic',
        'subCategory': 'Arctic & Polar',
        'theme': 'Glacial Frost & Ice Penguin Texture',
        'accent': '#0284c7',
        'badge': 'POLAR CHROMATIC',
        'description': 'Glacial frost edition with crystalline ice riming, cool cobalt shadows, and crisp polar lighting.',
        'specimenWords': ['GLACIAL', 'FROST', 'ICEBERG', 'ARCTIC', 'CRYSTAL'],
        'designer': 'Alphaxen Type Foundry',
        'releaseYear': 2026,
    },
}

def process_all_fonts():
    catalog = []
    
    for filename, profile in FONT_PROFILES.items():
        font_path = os.path.join(FONTS_DIR, filename)
        if not os.path.exists(font_path):
            print(f"Warning: {font_path} not found, skipping.")
            continue
            
        print(f"Processing: {filename} -> {profile['name']}...")
        font = TTFont(font_path)
        cmap = font.getBestCmap() or {}
        order = font.getGlyphOrder()
        inv_cmap = {v: k for k, v in cmap.items()}
        hmtx = font.get('hmtx')
        head = font.get('head')
        units_per_em = head.unitsPerEm if head else 1000
        
        # Directory for this font's demo glyphs
        font_glyph_dir = os.path.join(OUTPUT_GLYPHS_DIR, profile['id'])
        os.makedirs(font_glyph_dir, exist_ok=True)
        
        glyphs_data = {}
        sample_chars = []
        
        # 1. Color / Texture fonts (SVG table)
        if 'SVG ' in font:
            svg_table = font['SVG ']
            for doc, start_id, end_id in svg_table.docList:
                gname = order[start_id]
                code = inv_cmap.get(gname)
                if not code:
                    continue
                char = chr(code)
                
                # Extract PNG data
                m = re.search(r'data:image/png;base64,([A-Za-z0-9+/=]+)', doc)
                if m:
                    png_bytes = base64.b64decode(m.group(1))
                    png_filename = f"{code}.png"
                    png_path = os.path.join(font_glyph_dir, png_filename)
                    with open(png_path, 'wb') as img_out:
                        img_out.write(png_bytes)
                    
                    # Advance width
                    adv, lsb = hmtx.metrics[gname] if (hmtx and hasattr(hmtx, 'metrics') and gname in hmtx.metrics) else (int(units_per_em * 0.6), 0)
                    
                    glyphs_data[str(code)] = {
                        'code': code,
                        'char': char,
                        'name': gname,
                        'type': 'image',
                        'src': f"/demo_glyphs/{profile['id']}/{png_filename}",
                        'advance': int(adv),
                        'lsb': int(lsb),
                    }
                    if char.isalnum() and len(sample_chars) < 12:
                        sample_chars.append(char)
                        
        # 2. Vector fonts (CFF table)
        elif 'CFF ' in font:
            glyph_set = font.getGlyphSet()
            for code, gname in cmap.items():
                if gname not in glyph_set:
                    continue
                char = chr(code)
                adv, lsb = hmtx.metrics[gname] if (hmtx and hasattr(hmtx, 'metrics') and gname in hmtx.metrics) else (int(units_per_em * 0.6), 0)
                
                pen = SVGPathPen(glyph_set)
                # Flip y-axis to match standard SVG top-left origin: (x -> x, y -> 800 - y)
                tpen = TransformPen(pen, (1, 0, 0, -1, 0, 800))
                glyph = glyph_set[gname]
                glyph.draw(tpen)
                path_d = pen.getCommands()
                
                if path_d:
                    svg_filename = f"{code}.svg"
                    svg_path = os.path.join(font_glyph_dir, svg_filename)
                    svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {adv} {units_per_em}"><path d="{path_d}" fill="currentColor"/></svg>'
                    with open(svg_path, 'w', encoding='utf-8') as svg_out:
                        svg_out.write(svg_content)
                    
                    glyphs_data[str(code)] = {
                        'code': code,
                        'char': char,
                        'name': gname,
                        'type': 'vector',
                        'src': f"/demo_glyphs/{profile['id']}/{svg_filename}",
                        'path': path_d,
                        'advance': int(adv),
                        'lsb': int(lsb),
                    }
                    if char.isalnum() and len(sample_chars) < 12:
                        sample_chars.append(char)
                        
        # Space character metrics
        space_code = 32
        space_gname = cmap.get(space_code)
        space_adv = int(hmtx.metrics[space_gname][0]) if (space_gname and hmtx and hasattr(hmtx, 'metrics') and space_gname in hmtx.metrics) else 400
        glyphs_data[str(space_code)] = {
            'code': space_code,
            'char': ' ',
            'name': 'space',
            'type': 'space',
            'advance': space_adv,
            'lsb': 0,
        }
        
        # Save font detail JSON
        font_record = {
            **profile,
            'unitsPerEm': units_per_em,
            'glyphCount': len(glyphs_data),
            'sampleChars': sample_chars,
            'spaceAdvance': space_adv,
            'glyphs': glyphs_data,
        }
        
        font_json_path = os.path.join(OUTPUT_DATA_DIR, f"{profile['id']}.json")
        with open(font_json_path, 'w', encoding='utf-8') as fj:
            json.dump(font_record, fj, indent=2)
            
        # Catalog summary (lightweight, without all path/glyph details)
        catalog_summary = {
            **profile,
            'unitsPerEm': units_per_em,
            'glyphCount': len(glyphs_data),
            'sampleChars': sample_chars[:8],
            'spaceAdvance': space_adv,
            'previewGlyphs': [
                glyphs_data[str(ord(c))] for c in ['A', 'B', 'C', 'X', '1', '2'] if str(ord(c)) in glyphs_data
            ]
        }
        catalog.append(catalog_summary)
        print(f"  -> Extracted {len(glyphs_data)} glyphs for {profile['name']}.")

    # Save master catalog
    catalog_path = os.path.join(OUTPUT_DATA_DIR, 'catalog.json')
    with open(catalog_path, 'w', encoding='utf-8') as cj:
        json.dump(catalog, cj, indent=2)
    print(f"\nCompleted! Generated catalog with {len(catalog)} fonts.")

if __name__ == '__main__':
    process_all_fonts()
