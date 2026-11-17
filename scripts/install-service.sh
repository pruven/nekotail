#!/usr/bin/env bash
set -euo pipefail
project_dir="$(cd "$(dirname "$0")/.." && pwd)"
bun_binary="$(bun -e 'console.log(process.execPath)')"
unit_dir="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
mkdir -p "$unit_dir"
if [[ -f "$unit_dir/nekotail.service" ]]; then
  cp "$unit_dir/nekotail.service" "$unit_dir/nekotail.service.bak.$(date +%s)"
fi
cat > "$unit_dir/nekotail.service" <<EOF
[Unit]
Description=Nekotail Cat-as-a-Service
After=network.target

[Service]
Type=simple
WorkingDirectory=$project_dir
ExecStart="$bun_binary" "$project_dir/dist/server/entry.mjs"
Environment=HOST=127.0.0.1
Environment=PORT=4321
Environment=TRUST_TAILSCALE_PROXY=1
Restart=on-failure
RestartSec=5
NoNewPrivileges=true

[Install]
WantedBy=default.target
EOF
systemctl --user daemon-reload
systemctl --user enable nekotail.service
systemctl --user restart nekotail.service
echo 'Nekotail is running on localhost:4321. Next: tailscale serve --bg 4321'
