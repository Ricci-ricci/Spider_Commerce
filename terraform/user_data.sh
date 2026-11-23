#!/bin/bash
set -e
apt-get update
apt-get install -y docker.io docker-compose-plugin
systemctl enable --now docker