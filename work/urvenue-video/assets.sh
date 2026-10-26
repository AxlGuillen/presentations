#!/bin/zsh
# Prepara los clips del deck desde los renders de walkthrough (~/Movies/walkthrough)
# y los adjuntos de UWS-10821 (~/Downloads). Son los mismos archivos que están
# adjuntos en Jira. Uso: zsh urvenue-video/assets.sh
set -e
cd "${0:a:h}/assets"
W=~/Movies/walkthrough
# vertical: nombre, archivo, inicio, duración
v() { ffmpeg -y -v error -ss $3 -t $4 -i "$2" -vf "scale=360:640:flags=lanczos,fps=30" -an -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart clips/$1.mp4
      ffmpeg -y -v error -ss $(( $3 + $4 / 2 )) -i "$2" -frames:v 1 -vf "scale=360:640:flags=lanczos" -q:v 4 clips/$1.jpg; }
# horizontal
h() { ffmpeg -y -v error -ss $3 -t $4 -i "$2" -vf "scale=640:360:flags=lanczos,fps=30" -an -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart clips/$1.mp4
      ffmpeg -y -v error -ss $(( $3 + $4 / 2 )) -i "$2" -frames:v 1 -vf "scale=640:360:flags=lanczos" -q:v 4 clips/$1.jpg; }
v sizzle-a  $W/stripe/sizzle-a/2026-10-21_175440.mp4 2 6
v sizzle-b  $W/stripe/sizzle-b/2026-10-21_175615.mp4 2 6
v sizzle-c  $W/stripe/sizzle-c/2026-10-21_181230.mp4 2 6
v promo-loop ~/Downloads/UWS-10821-A3-music/"A3 - House Vibes (current).mp4" 6 6
h instructivo $W/caesars/itinerary-planner-4-desk/2026-10-20_204307.mp4 10 7
h explicativo $W/gpm/global-v3/2026-10-21_010718.mp4 15 7
h tour $W/guest-portal-microsite/sunset-shores/2026-09-30_131825.mp4 8 7
h antes-despues $W/gpm/sunset-a-before-after/2026-10-12_155620.mp4 0 9
h mapa-3d $W/seating/seating-3d-v2/2026-10-18_161540.mp4 14 7
# el A3 final completo, con audio
ffmpeg -y -v error -i ~/Downloads/UWS-10821-A3-music/"A3 - House Vibes (current).mp4" -vf "scale=540:960:flags=lanczos" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart a3-final.mp4
ffmpeg -y -v error -ss 24 -i ~/Downloads/UWS-10821-A3-music/"A3 - House Vibes (current).mp4" -frames:v 1 -vf "scale=540:960:flags=lanczos" -q:v 3 a3-final.jpg
cp ~/Sites/uws-plugin-local/public/wp-content/plugins/wp-urvenue-webservices/uvcore/assets/images/urvenuelogo-light.svg urvenue-logo.svg
du -sh . clips
