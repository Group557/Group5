#!/usr/bin/env python3
"""Generate the PolyFit app icon, Android adaptive icon layers and
splash mark as PNGs, using only the Python standard library.

The mark is the four spoked asterisk from the app wordmark, drawn as
four round capped spokes at 45 degrees.
"""

import math
import struct
import zlib

FOREST = (0x15, 0x47, 0x34)
FOREST_DEEP = (0x0F, 0x37, 0x27)
CREAM = (0xF8, 0xF6, 0xF0)
WHITE = (0xFF, 0xFF, 0xFF)

# Mark geometry, as fractions of the canvas.
SPOKE_LENGTH = 0.255
SPOKE_RADIUS_INNER = 0.014
SPOKE_RADIUS_OUTER = 0.075
SUPERSAMPLE = 1


def write_png(path, width, height, pixels):
    """pixels is a flat list of (r, g, b, a) tuples, row major."""
    raw = bytearray()
    for y in range(height):
        raw.append(0)  # no filter
        for x in range(width):
            r, g, b, a = pixels[y * width + x]
            raw += bytes((r, g, b, a))

    def chunk(tag, data):
        out = struct.pack(">I", len(data)) + tag + data
        return out + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    header = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", header)
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )

    with open(path, "wb") as handle:
        handle.write(png)


def segment_distance(px, py, ax, ay, bx, by):
    vx, vy = bx - ax, by - ay
    wx, wy = px - ax, py - ay
    length_squared = vx * vx + vy * vy
    t = 0.0
    if length_squared > 0:
        t = max(0.0, min(1.0, (wx * vx + wy * vy) / length_squared))
    dx = px - (ax + t * vx)
    dy = py - (ay + t * vy)
    return math.sqrt(dx * dx + dy * dy)


def spoke_distance(px, py, ax, ay, bx, by, radius_inner, radius_outer):
    """Signed distance from a point to a tapered spoke.

    A spoke is thin where it leaves the centre and swells into a
    rounded tip, which is what makes the mark read as a four
    teardrop asterisk rather than a plain cross.
    """
    vx, vy = bx - ax, by - ay
    wx, wy = px - ax, py - ay
    length_squared = vx * vx + vy * vy

    t = 0.0
    if length_squared > 0:
        t = max(0.0, min(1.0, (wx * vx + wy * vy) / length_squared))

    dx = px - (ax + t * vx)
    dy = py - (ay + t * vy)
    distance = math.sqrt(dx * dx + dy * dy)

    radius = radius_inner + (radius_outer - radius_inner) * t
    return radius - distance


def build(size, background, mark_color, mark_scale=1.0, transparent=False):
    """Render the mark and return a flat pixel list."""
    center = size / 2.0
    length = size * SPOKE_LENGTH * mark_scale
    radius_inner = size * SPOKE_RADIUS_INNER * mark_scale
    radius_outer = size * SPOKE_RADIUS_OUTER * mark_scale

    endpoints = []
    for index in range(4):
        angle = math.radians(45 + 90 * index)
        endpoints.append(
            (
                center + length * math.cos(angle),
                center + length * math.sin(angle),
            )
        )

    pixels = []
    step = 1.0 / SUPERSAMPLE
    offset = step / 2.0

    for y in range(size):
        for x in range(size):
            coverage = 0.0

            for sy in range(SUPERSAMPLE):
                for sx in range(SUPERSAMPLE):
                    px = x + offset + sx * step
                    py = y + offset + sy * step

                    # The mark is the union of the four spokes, so
                    # the signed distance of the union is the
                    # largest of the four.
                    field = max(
                        spoke_distance(
                            px,
                            py,
                            center,
                            center,
                            ex,
                            ey,
                            radius_inner,
                            radius_outer,
                        )
                        for ex, ey in endpoints
                    )

                    # Turn the signed distance into coverage, so the
                    # edge is antialiased without supersampling.
                    sample = field + 0.5
                    if sample > 0:
                        coverage += min(1.0, sample)

            coverage /= SUPERSAMPLE * SUPERSAMPLE

            if transparent:
                r = g = b = mark_color[0]
                a = int(round(255 * coverage))
            else:
                # Subtle vertical gradient keeps the mark from
                # floating on a flat slab.
                t = y / max(1, size - 1)
                r = round(
                    FOREST[0] + (FOREST_DEEP[0] - FOREST[0]) * t
                )
                g = round(
                    FOREST[1] + (FOREST_DEEP[1] - FOREST[1]) * t
                )
                b = round(
                    FOREST[2] + (FOREST_DEEP[2] - FOREST[2]) * t
                )
                if coverage > 0:
                    mr, mg, mb = mark_color
                    r = round(r + (mr - r) * coverage)
                    g = round(g + (mg - g) * coverage)
                    b = round(b + (mb - b) * coverage)
                a = 255

            pixels.append((r, g, b, a))

    return pixels


def build_mono(size):
    """Monochrome layer: a white mark on transparency, for the
    Android themed icon."""
    return build(size, None, WHITE, transparent=True)


def build_background(size):
    pixels = []
    for y in range(size):
        t = y / max(1, size - 1)
        r = round(FOREST[0] + (FOREST_DEEP[0] - FOREST[0]) * t)
        g = round(FOREST[1] + (FOREST_DEEP[1] - FOREST[1]) * t)
        b = round(FOREST[2] + (FOREST_DEEP[2] - FOREST[2]) * t)
        for _ in range(size):
            pixels.append((r, g, b, 255))
    return pixels


if __name__ == "__main__":
    import sys

    out = sys.argv[1] if len(sys.argv) > 1 else "."

    # Full app icon.
    write_png(f"{out}/icon.png", 1024, 1024, build(1024, FOREST, CREAM))

    # Android adaptive layers. The foreground is scaled down because
    # the system crops and masks it.
    write_png(
        f"{out}/android-icon-foreground.png",
        512,
        512,
        build(512, FOREST, CREAM, mark_scale=0.72, transparent=True),
    )
    write_png(
        f"{out}/android-icon-background.png", 512, 512, build_background(512)
    )
    write_png(
        f"{out}/android-icon-monochrome.png",
        432,
        432,
        build_mono(432),
    )

    # Web favicon and the splash mark. The splash sits on the cream
    # canvas, so its mark is the forest green one.
    write_png(f"{out}/favicon.png", 48, 48, build(48, FOREST, CREAM))
    write_png(
        f"{out}/splash-icon.png",
        512,
        512,
        build(
            512, FOREST, FOREST, mark_scale=0.78, transparent=True
        ),
    )

    print("icons written")
