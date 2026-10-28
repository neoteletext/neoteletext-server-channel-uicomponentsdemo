# Deploying neoteletext-server-channel-uicomponentsdemo

The channel is live at <https://app.neottx.com/uicomponentsdemo/>. The
NeoTeletext server in the `neoteletext` container on crowdwaveaudio runs
it as its `uicomponentsdemo` channel, from this repository's copy at
`/opt/neoteletext/current/neoteletext-server-channel-uicomponentsdemo`,
with `--pictures /opt/neoteletext/pictures`.

`scripts/deploy.sh` deploys this channel on its own. The server, the
other channels, the channels file and the pictures are deployed with
neoteletext-app-server's `deploy/ionos/deploy.sh` (see "What this deploy
leaves alone").

## Deploy

1. **Commit, and push.** The pre-push hook runs `scripts/check.sh full`,
   the stage here and on the Linux host, on the commit being pushed.
2. **Run `scripts/deploy.sh`.** It deploys the commit at HEAD and checks
   that the channel came back.

It refuses a tree with changes that are not committed, and a HEAD that is
not the pushed upstream: what goes live is a commit that passed the full
gate. Then it:

1. keeps the live copy as `~/uicomponentsdemo.bak-DATE` on the host
   (`/opt/neoteletext` is root's; the channel's user is `ubuntu`);
2. copies the commit's files, exported with `git archive`, over the live
   copy, deleting what the commit no longer has. The tree's ignored files
   (`tmp`, `.env`) are never copied; the host's own `node_modules` is
   kept;
3. writes the commit to `.deployed-commit` beside the code;
4. runs `npm ci --omit=dev --ignore-scripts --no-audit --no-fund`, which
   installs the two libraries from `vendor/` and none of the development
   tools;
5. stops this channel's program only. The server starts it again at once;
   the demo site and Hackaday keep running;
6. waits, up to 30 s, for the new program to declare its pages, checks it
   is still running 3 s later, and prints its journal lines, among them
   how many pages and pictures it has;
7. checks the server's readiness (`ready`), that
   `https://app.neottx.com/uicomponentsdemo/contents.txt` lists the pages,
   and prints the commit now live.

Any step that fails stops the deploy with `FAILED:` and the reason.

## Roll back

    scripts/deploy.sh rollback [BACKUP]

puts back a backup, the newest when none is named, then restarts and
checks the channel as a deploy does. The copy it replaces is kept as a
backup too, so a second `rollback` undoes the first. Backups are never
removed by the script; to see them:

    ssh neoteletext 'ls -d ~/uicomponentsdemo.bak-*'

## What the host needs

- **Node 22.18 or later**, which runs the `.ts` files as they are. The
  container has 24.21.
- **ffmpeg with libopus**, on the service's `PATH`: every sound and stream
  is encoded as Opus with it (the component library's 4.0.0). The
  container has `/usr/bin/ffmpeg` with libopus (checked on 28 October
  2026).
- **For the deploy:** the `neoteletext` ssh alias (`~/.ssh/config`,
  through crowdwaveaudio), and `sudo` without a password for
  `journalctl` there.

## What this deploy leaves alone

neoteletext-app-server's `deploy/ionos/deploy.sh` deploys the whole
service: the server binary, all three channels, the home page, the
channels file `/opt/neoteletext/channels.json`, the pictures and Caddy.
It copies each channel's working tree as it is, committed or not, so run
it only when every channel's tree is ready to go live. The channels file
names this channel:

    {"folder":"uicomponentsdemo","name":"NeoTeletext UI components demo","command":["node","src/main.ts","--pictures","/opt/neoteletext/pictures"],"directory":"current/neoteletext-server-channel-uicomponentsdemo"}

The pictures are never in git. `/opt/neoteletext/pictures`, which the
demo site reads too, is a copy of neoteletext-server-channels'
`tmp/pictures` (its `scripts/pictures.py` makes them). That deploy moves
it into place from the host's `~/incoming`, once a transfer has put it
there and written `~/incoming/.complete`.

## The test host

neoteletext-app-server's `scripts/deploy.sh` deploys the server and every
channel neoteletext-server-channels' `channels.json` names to the Linux
test host, `foundintelquiet4060`, as a systemd user service. That is not
the live site.

## The journal

    ssh neoteletext 'sudo journalctl -u neoteletext --no-pager -n 50 -o cat' | grep '"channel":"uicomponentsdemo"'

## A new release of a library

`BUILD.md`, "What is needed": the release goes into `vendor/`,
`package.json` names it, the gates run, and the commit is pushed and
deployed as above.
