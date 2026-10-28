#!/usr/bin/env bash
# Deploys this channel alone to the live host, app.neottx.com, and checks
# that it came back (DEPLOYMENT.md). The server, the other channels and the
# pictures are untouched.
#   scripts/deploy.sh                    the commit at HEAD, which must be
#                                        pushed: the pre-push hook's full
#                                        gate is what checks it
#   scripts/deploy.sh rollback [BACKUP]  a backup put back, the newest
#                                        when none is named
set -euo pipefail
cd "$(dirname "$0")/.."

# The neoteletext container (~/.ssh/config), its copy of this repository,
# and the channel's folder in the server's channels file.
readonly HOST="${NEOTELETEXT_HOST:-neoteletext}"
readonly LIVE="/opt/neoteletext/current/neoteletext-server-channel-uicomponentsdemo"
readonly CHANNEL="uicomponentsdemo"
readonly ORIGIN="https://app.neottx.com/$CHANNEL"
# The server's readiness check, on its admin address (the service's
# --admin-listen, from neoteletext-app-server's deploy/ionos/deploy.sh).
readonly READY_URL="http://127.0.0.1:9464/readyz"
# /opt/neoteletext is root's, so each live copy is kept under the channel
# user's home before it is replaced: ~/uicomponentsdemo.bak-DATE.
readonly BACKUP_PREFIX="$CHANNEL.bak-"
# The commit a deploy put live, beside the code; never in the repository.
readonly DEPLOYED=".deployed-commit"
# The server starts the program again at once; it declares its pages in
# under a second (measured on 28 October 2026), so this is a ceiling.
readonly COME_BACK_S=30
# How long the new program must stay up to count as running, not crashing.
readonly STEADY_S=3

mode="${1:-deploy}"
# The commit's files, exported for the copy; removed on exit.
exported=""

step() { printf '\n== %s\n' "$*"; }
fail() {
    printf '\nFAILED: %s\n' "$*" >&2
    exit 1
}

# Runs a bash script on the host, its arguments after it.
on_host() {
    local script="$1"
    shift
    # ssh hands the host one command line, so each argument is quoted for it.
    ssh -o BatchMode=yes "$HOST" "bash -s -- $(printf '%q ' "$@")" <<<"$script"
}

# The program the server runs from LIVE stopped, and the one it starts in
# its place waited for: started, its pages declared, and still running.
# shellcheck disable=SC2016 # expanded on the host
readonly RESTART='set -euo pipefail
live=$1 channel=$2 come_back_s=$3 steady_s=$4
program() {
    local pid
    for pid in $(pgrep -f "node src/main.ts" || true); do
        [ "$(readlink "/proc/$pid/cwd" || true)" = "$live" ] && echo "$pid"
    done
    return 0
}
old=$(program)
[ -n "$old" ] || { echo "no program of $channel runs in $live" >&2; exit 1; }
since=$(date +%s)
kill -TERM "$old"
for _ in $(seq "$come_back_s"); do
    sleep 1
    new=$(program)
    [ -n "$new" ] && [ "$new" != "$old" ] || continue
    sudo journalctl -u neoteletext --since "@$since" --no-pager -o cat | grep -F "\"channel\":\"$channel\"" | grep -qF "the program declared its pages" || continue
    sleep "$steady_s"
    [ "$(program)" = "$new" ] || { echo "the new program, $new, did not stay up" >&2; exit 1; }
    sudo journalctl -u neoteletext --since "@$since" --no-pager -o cat | grep -F "\"channel\":\"$channel\"" | grep -vF "\"figures\"" | sed -n "s/.*\"message\":\"\([^\"]*\)\".*/  \1/p" || true
    exit 0
done
echo "$channel did not declare its pages within ${come_back_s}s of the restart" >&2
exit 1'

restart_and_check() {
    step "the restart, of this channel's program only"
    on_host "$RESTART" "$LIVE" "$CHANNEL" "$COME_BACK_S" "$STEADY_S" || fail "the channel did not come back; scripts/deploy.sh rollback puts the last copy back"

    step "the server, and the channel from outside"
    local ready
    # shellcheck disable=SC2016 # expanded on the host
    ready="$(on_host 'curl -fsS "$1"' "$READY_URL")" || fail "the server's readiness check did not answer"
    [[ "$ready" == "ready" ]] || fail "the server says \"$ready\", not ready"
    printf 'server: %s\n' "$ready"
    local listed
    listed="$(curl -fsS "$ORIGIN/contents.txt" | grep -c '^p' || true)"
    [[ "$listed" -gt 0 ]] || fail "$ORIGIN/contents.txt lists no pages"
    printf '%s lists %s pages\n' "$ORIGIN/contents.txt" "$listed"
    # shellcheck disable=SC2016 # expanded on the host
    printf 'live: %s\n' "$(on_host 'cat "$1/$2" 2>/dev/null || echo "a copy no deploy recorded"' "$LIVE" "$DEPLOYED")"
}

backup_live() {
    step "the live copy kept"
    # shellcheck disable=SC2016 # expanded on the host
    on_host 'set -euo pipefail; backup=~/"$2$(date +%Y-%m-%d-%H%M%S)"; cp -a "$1" "$backup"; echo "$backup"' "$LIVE" "$BACKUP_PREFIX"
}

deploy() {
    step "the commit: committed, clean and pushed"
    [[ -z "$(git status --porcelain)" ]] || fail "the tree has changes that are not committed; a deploy is of a commit:
$(git status --porcelain)"
    git fetch --quiet origin
    local head upstream
    head="$(git rev-parse HEAD)"
    upstream="$(git rev-parse '@{upstream}')" || fail "the branch has no upstream to push to"
    [[ "$head" == "$upstream" ]] || fail "HEAD $head is not the pushed $upstream; push it, through the pre-push hook's full gate, first"
    git log -1 --format='%h %s'

    ssh -o BatchMode=yes -o ConnectTimeout=10 "$HOST" true || fail "$HOST is unreachable"

    backup_live

    step "the commit's files onto the host"
    # Exactly the commit's files: never the tree's ignored ones (tmp, .env).
    mkdir -p tmp
    exported="$(mktemp -d tmp/deploy.XXXXXX)"
    trap 'rm -rf "$exported"' EXIT
    git archive HEAD | tar -x -C "$exported"
    printf '%s %s\n' "$(git log -1 --format='%h %s')" "deployed $(date -u +%Y-%m-%dT%H:%M:%SZ)" >"$exported/$DEPLOYED"
    # node_modules is the host's own, installed below from the lockfile.
    rsync -a --delete --exclude node_modules "$exported/" "$HOST:$LIVE/"

    step "the two libraries, from vendor/ (npm ci)"
    # No development tools and no install scripts: the program needs neither.
    # shellcheck disable=SC2016 # expanded on the host
    on_host 'set -euo pipefail; cd "$1"; npm ci --omit=dev --ignore-scripts --no-audit --no-fund --silent' "$LIVE"

    restart_and_check
}

rollback() {
    local backup="${1:-}"
    if [[ -z "$backup" ]]; then
        # shellcheck disable=SC2016 # expanded on the host
        backup="$(on_host 'ls -1d ~/"$1"* 2>/dev/null | sort | tail -n 1' "$BACKUP_PREFIX")"
        [[ -n "$backup" ]] || fail "$HOST keeps no backup of $CHANNEL"
    fi
    # shellcheck disable=SC2016 # expanded on the host
    on_host '[ -d "$1" ] && [ -f "$1/package.json" ]' "$backup" || fail "$backup on $HOST is not a copy of the channel"
    printf 'putting back %s\n' "$backup"

    # The copy being replaced is kept too, so a rollback can be undone.
    backup_live

    step "the backup put back, its node_modules with it"
    # shellcheck disable=SC2016 # expanded on the host
    on_host 'set -euo pipefail; rsync -a --delete "$1/" "$2/"' "$backup" "$LIVE"

    restart_and_check
}

case "$mode" in
deploy) deploy ;;
rollback) rollback "${2:-}" ;;
*) fail "usage: scripts/deploy.sh [rollback [BACKUP]]" ;;
esac

step "Deployed ($mode)"
