#!/bin/bash
# Renders every composition one after another (parallel runs can crash Chromium here).
cd "$(dirname "$0")/.."
for id in FAQ1-StepsNotSyncing FAQ2-JoinContest FAQ3-CorporateLogin FAQ4-RedeemKoins FAQ5-MedalDelivery FAQ6-StepsStuckHindi; do
  node render-local/render.mjs "$id" && tsx render-local/mix-audio.ts "$id" || { echo "FAILED $id"; exit 1; }
done
node render-local/render.mjs TortyShowcase && mv out/TortyShowcase.silent.mp4 out/TortyShowcase.mp4
echo ALL_DONE
