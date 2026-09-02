#!/bin/bash
set -euxo pipefail

# Add 1GB swap space (prevents OOM issues under memory pressure)
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Disable snapd - not needed for this project, frees up RAM
systemctl stop snapd.service snapd.socket || true
systemctl disable snapd.service snapd.socket || true

# Install k3s (lightweight Kubernetes) as a single-node cluster
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --write-kubeconfig-mode 644" sh -

echo "k3s bootstrap complete" > /var/log/idp-bootstrap.log