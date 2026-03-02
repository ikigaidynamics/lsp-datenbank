#!/bin/bash
set -e

BACKUP_DIR="data/backups"
SOURCE="data/lsp.db"
KEEP=30

if [ ! -f "$SOURCE" ]; then
    echo "No database found at $SOURCE"
    exit 1
fi

mkdir -p "$BACKUP_DIR"

FILENAME="lsp_$(date +%Y%m%d).db"
cp "$SOURCE" "$BACKUP_DIR/$FILENAME"
echo "Backup created: $BACKUP_DIR/$FILENAME"

# Remove old backups, keep last $KEEP
cd "$BACKUP_DIR"
ls -t lsp_*.db 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm --
echo "Kept last $KEEP backups."
