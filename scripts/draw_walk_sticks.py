"""Draw an 8-pose side-view walk cycle mannequin sheet."""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(r"C:\Users\samar\.cursor\projects\c-Users-samar-Desktop-New-folder-portfolio\assets")
W, H = 1920, 720
PANEL = 220
GAP = 16
MARGIN_Y = 80

# Each pose: hip-relative limb endpoints (x right, y down). Hip at origin.
# Units are pixels from hip. Walking RIGHT.
# contact A, down A, pass A, high A, contact B, down B, pass B, high B
POSES = [
    # 1 contact A: right foot fwd, left back; left arm fwd, right arm back
    dict(head=(8, -118), neck=(4, -88),
         l_sh=(-12, -78), r_sh=(14, -78),
         l_hand=(62, -8), r_hand=(-58, 8),
         l_hip=(-10, 8), r_hip=(10, 8),
         l_knee=(-38, 58), r_knee=(42, 52),
         l_foot=(-70, 118), r_foot=(78, 118)),
    # 2 recoil A: weight on right, left lifting
    dict(head=(6, -114), neck=(2, -84),
         l_sh=(-12, -74), r_sh=(14, -74),
         l_hand=(48, 4), r_hand=(-44, 12),
         l_hip=(-8, 10), r_hip=(10, 10),
         l_knee=(-18, 50), r_knee=(28, 58),
         l_foot=(-36, 96), r_foot=(40, 118)),
    # 3 passing A: left swinging through, right support
    dict(head=(4, -118), neck=(2, -88),
         l_sh=(-10, -78), r_sh=(12, -78),
         l_hand=(18, 10), r_hand=(-16, 12),
         l_hip=(-8, 8), r_hip=(8, 8),
         l_knee=(22, 48), r_knee=(8, 62),
         l_foot=(28, 78), r_foot=(6, 118)),
    # 4 high A: left reaching forward, right toe-off
    dict(head=(8, -118), neck=(4, -88),
         l_sh=(-10, -78), r_sh=(14, -78),
         l_hand=(-40, 6), r_hand=(54, -4),
         l_hip=(-8, 8), r_hip=(10, 8),
         l_knee=(48, 42), r_knee=(-18, 58),
         l_foot=(74, 88), r_foot=(-42, 110)),
    # 5 contact B: LEFT foot fwd, RIGHT back; right arm fwd, left arm back
    dict(head=(8, -118), neck=(4, -88),
         l_sh=(-12, -78), r_sh=(14, -78),
         l_hand=(-58, 8), r_hand=(62, -8),
         l_hip=(-10, 8), r_hip=(10, 8),
         l_knee=(42, 52), r_knee=(-38, 58),
         l_foot=(78, 118), r_foot=(-70, 118)),
    # 6 recoil B: weight on left, right lifting
    dict(head=(6, -114), neck=(2, -84),
         l_sh=(-12, -74), r_sh=(14, -74),
         l_hand=(-44, 12), r_hand=(48, 4),
         l_hip=(-8, 10), r_hip=(10, 10),
         l_knee=(28, 58), r_knee=(-18, 50),
         l_foot=(40, 118), r_foot=(-36, 96)),
    # 7 passing B: right swinging through, left support
    dict(head=(4, -118), neck=(2, -88),
         l_sh=(-10, -78), r_sh=(12, -78),
         l_hand=(-16, 12), r_hand=(18, 10),
         l_hip=(-8, 8), r_hip=(8, 8),
         l_knee=(8, 62), r_knee=(22, 48),
         l_foot=(6, 118), r_foot=(28, 78)),
    # 8 high B: right reaching forward, left toe-off
    dict(head=(8, -118), neck=(4, -88),
         l_sh=(-10, -78), r_sh=(14, -78),
         l_hand=(54, -4), r_hand=(-40, 6),
         l_hip=(-8, 8), r_hip=(10, 8),
         l_knee=(-18, 58), r_knee=(48, 42),
         l_foot=(-42, 110), r_foot=(74, 88)),
]


def draw_pose(d: ImageDraw.ImageDraw, ox: int, oy: int, pose: dict) -> None:
    def p(key: str) -> tuple[int, int]:
        x, y = pose[key]
        return ox + x, oy + y

    hip = p("l_hip")[0] // 2 + p("r_hip")[0] // 2, (p("l_hip")[1] + p("r_hip")[1]) // 2
    # torso
    d.line([p("neck"), hip], fill=(30, 30, 30), width=14)
    d.line([p("l_sh"), p("r_sh")], fill=(30, 30, 30), width=12)
    # head
    hx, hy = p("head")
    d.ellipse((hx - 22, hy - 26, hx + 22, hy + 26), fill=(220, 160, 110), outline=(20, 20, 20), width=3)
    # left arm (camera) yellow, right arm orange
    d.line([p("l_sh"), p("l_hand")], fill=(240, 200, 40), width=10)
    d.line([p("r_sh"), p("r_hand")], fill=(230, 120, 40), width=10)
    d.ellipse((p("l_hand")[0] - 8, p("l_hand")[1] - 8, p("l_hand")[0] + 8, p("l_hand")[1] + 8), fill=(240, 200, 40))
    d.ellipse((p("r_hand")[0] - 8, p("r_hand")[1] - 8, p("r_hand")[0] + 8, p("r_hand")[1] + 8), fill=(230, 120, 40))
    # left leg green, right leg blue
    d.line([p("l_hip"), p("l_knee"), p("l_foot")], fill=(30, 170, 70), width=12)
    d.line([p("r_hip"), p("r_knee"), p("r_foot")], fill=(40, 90, 220), width=12)
    d.ellipse((p("l_foot")[0] - 16, p("l_foot")[1] - 10, p("l_foot")[0] + 22, p("l_foot")[1] + 12), fill=(30, 170, 70))
    d.ellipse((p("r_foot")[0] - 16, p("r_foot")[1] - 10, p("r_foot")[0] + 22, p("r_foot")[1] + 12), fill=(40, 90, 220))
    # ground line
    d.line([(ox - 90, oy + 120), (ox + 90, oy + 120)], fill=(80, 0, 80), width=3)


def main() -> None:
    img = Image.new("RGB", (W, H), (255, 0, 255))
    d = ImageDraw.Draw(img)
    origin_y = 360
    for i, pose in enumerate(POSES):
        ox = 120 + i * (PANEL + GAP)
        draw_pose(d, ox, origin_y, pose)
    dest = OUT / "walk-sticks-8.png"
    img.save(dest)
    print("wrote", dest)


if __name__ == "__main__":
    main()
