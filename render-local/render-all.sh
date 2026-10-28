#!/bin/bash
# Renders all five compositions locally (2 at a time), then mixes audio.
cd "$(dirname "$0")/.."
ids=(FAQ1-StepsNotSyncing FAQ2-JoinContest FAQ3-CorporateLogin FAQ4-RedeemKoins FAQ5-MedalDelivery)
run() { node render-local/render.mjs "$1" && tsx render-local/mix-audio.ts "$1"; }
run ${ids[0]} & run ${ids[1]} & wait
run ${ids[2]} & run ${ids[3]} & wait
run ${ids[4]}
echo ALL_DONE
