# Deploying neoteletext-server-channel-uicomponentsdemo

The channel runs on the deploy host as a program the server starts from
neoteletext-server-channels' `channels.json`. teletext-server's
`scripts/deploy.sh` deploys it with the server: there is no deploy of
this repository on its own.

## What the host needs

- **ffmpeg with libopus**, on the service's `PATH`: every sound and stream
  is encoded as Opus with it (the component library's 4.0.0).
  `foundintelquiet4060` has it (`/usr/bin/ffmpeg`, checked on 28 October
  2026).

## What the deploy does

- **The entry.** neoteletext-server-channels' `channels.json` names the
  channel, with folder `uicomponentsdemo` and this repository beside it:

      {"folder":"uicomponentsdemo","name":"NeoTeletext UI components demo","command":["node","src/main.ts","--pictures","../neoteletext-server-channels/tmp/pictures"],"directory":"../neoteletext-server-channel-uicomponentsdemo"}

  A relative `directory` is taken from `channels.json`'s own folder.
- **The copy.** `deploy.sh` copies every repository a `channels.json`
  entry names as `../NAME` to the host's `~/NAME`, here
  `~/neoteletext-server-channel-uicomponentsdemo`, leaving out `.git`,
  `tmp` and `node_modules`, and then runs there

      npm ci --omit=dev --ignore-scripts --no-audit --no-fund

  which installs the two libraries from `vendor/` and none of the
  development tools.
- **The pictures.** The `--pictures` folder is neoteletext-server-channels'
  `tmp/pictures`. The pictures are never in git: `deploy.sh` makes them
  there if they are missing and copies them to the host's
  `~/neoteletext-server-channels/tmp/pictures`.
- **The restart.** `deploy.sh` copies `channels.json` and restarts the
  service, which starts the channel.

## Deploy

1. **Check the commit:** push it, or run `scripts/check.sh full` on a
   clean tree at it. That runs the stage here and on the Linux host.
2. **Deploy the server** with teletext-server's `scripts/deploy.sh`.

On start the program writes to the service's journal how many pages and
pictures it has:

    ssh foundintelquiet4060 journalctl --user -u teletext-server --no-pager -n 20 -o cat

## A new release of a library

`BUILD.md`, "What is needed": the release goes into `vendor/`,
`package.json` names it, the gates run, and the commit is deployed as
above.
