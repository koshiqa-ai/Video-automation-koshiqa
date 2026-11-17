#!/usr/bin/env bash
# Joins out/HV-VoiceSample-1..3.mp4 into out/voice-sample.mp4, each preceded by a 2 s black card "Option N"
# (white Poppins Bold, centred, silent). Render and mix the three compositions first.
set -euo pipefail
cd "$(dirname "$0")/.."
FONT=public/fonts/Poppins-Bold.ttf
inputs=(); filt=""; k=0
for n in 1 2 3; do
  inputs+=(-f lavfi -t 2 -i "color=c=black:s=1080x1920:r=30" -f lavfi -t 2 -i "anullsrc=r=48000:cl=stereo" -i "out/HV-VoiceSample-$n.mp4")
  filt+="[$k:v]drawtext=fontfile=$FONT:text='Option $n':fontsize=110:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2,format=yuv420p,setsar=1[c$n];"
  filt+="[$((k+2)):v]fps=30,format=yuv420p,setsar=1[v$n];[$((k+2)):a]aresample=48000,aformat=channel_layouts=stereo[a$n];"
  k=$((k+3))
done
filt+="[c1][1:a][v1][a1][c2][4:a][v2][a2][c3][7:a][v3][a3]concat=n=6:v=1:a=1[v][a]"
ffmpeg -v error -y "${inputs[@]}" -filter_complex "$filt" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset medium -c:a aac -b:a 192k -movflags +faststart out/voice-sample.mp4
echo "out/voice-sample.mp4"
