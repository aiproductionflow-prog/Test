#!/usr/bin/env python3
"""
organize_folder.py - Organizes files in a folder by moving them into
subfolders based on their file extension.

Usage:
    python organize_folder.py /path/to/folder          # Move files
    python organize_folder.py /path/to/folder --dry-run  # Preview only
"""

import argparse
import shutil
from pathlib import Path
from collections import defaultdict

EXTENSION_MAP = {
    # Images
    "images": {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp", ".tiff", ".ico"},
    # Videos
    "videos": {".mp4", ".mov", ".avi", ".mkv", ".wmv", ".flv", ".webm", ".m4v"},
    # Audio
    "audio": {".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a", ".wma"},
    # Documents
    "documents": {".pdf", ".doc", ".docx", ".odt", ".txt", ".rtf", ".md", ".tex"},
    # Spreadsheets
    "spreadsheets": {".xls", ".xlsx", ".ods", ".csv"},
    # Presentations
    "presentations": {".ppt", ".pptx", ".odp", ".key"},
    # Archives
    "archives": {".zip", ".tar", ".gz", ".bz2", ".xz", ".7z", ".rar", ".tgz"},
    # Code
    "code": {
        ".py", ".js", ".ts", ".html", ".css", ".java", ".c", ".cpp", ".h",
        ".go", ".rs", ".rb", ".php", ".sh", ".bash", ".zsh", ".sql", ".json",
        ".yaml", ".yml", ".toml", ".xml", ".ini", ".cfg",
    },
    # Executables
    "executables": {".exe", ".msi", ".dmg", ".pkg", ".deb", ".rpm", ".appimage"},
    # Fonts
    "fonts": {".ttf", ".otf", ".woff", ".woff2", ".eot"},
}


def build_reverse_map(extension_map: dict) -> dict:
    """Build a mapping from extension -> folder name."""
    reverse = {}
    for folder, extensions in extension_map.items():
        for ext in extensions:
            reverse[ext] = folder
    return reverse


def get_destination_folder(ext: str, reverse_map: dict) -> str:
    """Return the destination folder name for a given extension."""
    return reverse_map.get(ext.lower(), "misc")


def collect_moves(target_dir: Path, reverse_map: dict) -> list[tuple[Path, Path]]:
    """
    Collect (source, destination) pairs for all files that need to be moved.
    Only considers files directly in target_dir (non-recursive).
    """
    moves = []
    for item in sorted(target_dir.iterdir()):
        if not item.is_file():
            continue
        folder_name = get_destination_folder(item.suffix, reverse_map)
        dest_dir = target_dir / folder_name
        dest_file = dest_dir / item.name
        if dest_file == item:
            continue  # Already in the right place
        moves.append((item, dest_file))
    return moves


def preview_moves(moves: list[tuple[Path, Path]], target_dir: Path) -> None:
    """Print a preview of all planned moves grouped by destination folder."""
    if not moves:
        print("Nothing to organize — folder is already tidy.")
        return

    grouped = defaultdict(list)
    for src, dst in moves:
        grouped[dst.parent.name].append((src.name, dst.name))

    print(f"DRY RUN — {len(moves)} file(s) would be moved:\n")
    for folder in sorted(grouped):
        print(f"  [{folder}/]")
        for src_name, dst_name in grouped[folder]:
            arrow = "→" if src_name == dst_name else f"→ {dst_name}"
            print(f"    {src_name} {arrow}")
    print()
    print("Run without --dry-run to apply these changes.")


def apply_moves(moves: list[tuple[Path, Path]], target_dir: Path) -> None:
    """Execute the moves, creating destination directories as needed."""
    if not moves:
        print("Nothing to organize — folder is already tidy.")
        return

    created_dirs = set()
    moved = 0
    skipped = 0

    for src, dst in moves:
        if dst.exists():
            print(f"  SKIP  {src.name} (conflict: {dst} already exists)")
            skipped += 1
            continue

        if dst.parent not in created_dirs:
            dst.parent.mkdir(parents=True, exist_ok=True)
            created_dirs.add(dst.parent)

        shutil.move(str(src), str(dst))
        print(f"  MOVED {src.name}  →  {dst.parent.name}/{dst.name}")
        moved += 1

    print(f"\nDone. {moved} file(s) moved, {skipped} skipped.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Organize files in a folder into subfolders by extension."
    )
    parser.add_argument("folder", help="Path to the folder to organize")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without moving any files",
    )
    args = parser.parse_args()

    target_dir = Path(args.folder).resolve()

    if not target_dir.exists():
        parser.error(f"Folder not found: {target_dir}")
    if not target_dir.is_dir():
        parser.error(f"Not a directory: {target_dir}")

    reverse_map = build_reverse_map(EXTENSION_MAP)
    moves = collect_moves(target_dir, reverse_map)

    if args.dry_run:
        preview_moves(moves, target_dir)
    else:
        apply_moves(moves, target_dir)


if __name__ == "__main__":
    main()
