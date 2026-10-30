#!/bin/sh
# Renders the parent-log detail view for ALL bank items at 390px and asserts 4 options, a marked key, and no raw HTML.
# usage: tests/run-parent-log-test.sh [URL]   (default: local server of dist at http://localhost:8766/gifted-prep/)
set -e; cd "$(dirname "$0")"
npx esbuild bank-ids.mts --bundle --platform=node --format=esm --outfile=/tmp/ids.mjs --log-level=error
node /tmp/ids.mjs > /tmp/ids.json
python3 parent_log_all_items.py "${1:-http://localhost:8766/gifted-prep/}"
