#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "========================================="
echo "EduTrack Database Migration Script"
echo "========================================="

# 1. Configuration variables
# Modify these values if your setup differs
SUPABASE_HOST="aws-1-ap-northeast-1.pooler.supabase.com"
SUPABASE_PORT="5432"
SUPABASE_USER="postgres.bivafymwpctapaumpuhy"
SUPABASE_DB="postgres"

VPS_DB_NAME="edutrack"
VPS_DB_USER="postgres"
VPS_DB_PASSWORD="password_vps_anda"  # Change this to your desired database password

BACKUP_FILE="supabase_backup.sql"

# Check if pg_dump is installed
if ! command -v pg_dump &> /dev/null; then
    echo "pg_dump could not be found. Installing postgresql-client..."
    sudo apt-get update && sudo apt-get install -y postgresql-client
fi

# 2. Backup database from Supabase
echo "--> 1. Backing up Supabase database..."
echo "Please enter your Supabase Database Password when prompted."
pg_dump -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -F p -v -f "$BACKUP_FILE"

echo "--> Backup completed successfully: $BACKUP_FILE"

# 3. Setup local PostgreSQL DB on VPS
echo "--> 2. Setting up PostgreSQL on VPS (Docker)..."
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Installing docker-compose..."
    sudo apt-get install -y docker-compose-plugin
fi

# Create docker-compose.yml
cat <<EOF > docker-compose.db.yml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    container_name: edutrack-db
    restart: always
    environment:
      POSTGRES_USER: ${VPS_DB_USER}
      POSTGRES_PASSWORD: ${VPS_DB_PASSWORD}
      POSTGRES_DB: ${VPS_DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
EOF

echo "--> Starting PostgreSQL container..."
docker compose -f docker-compose.db.yml up -d

echo "--> Waiting for PostgreSQL to be ready..."
sleep 5

# 4. Restore database into VPS Docker Container
echo "--> 3. Restoring backup into VPS PostgreSQL database..."
docker exec -i edutrack-db psql -U "$VPS_DB_USER" -d "$VPS_DB_NAME" < "$BACKUP_FILE"

echo "========================================="
echo "Migration Completed Successfully! 🎉"
echo "========================================="
echo "Your new VPS connection details:"
echo "DATABASE_URL=\"postgresql://${VPS_DB_USER}:${VPS_DB_PASSWORD}@<IP_VPS_ANDA>:5432/${VPS_DB_NAME}?schema=public&connection_limit=5\""
echo "DIRECT_URL=\"postgresql://${VPS_DB_USER}:${VPS_DB_PASSWORD}@<IP_VPS_ANDA>:5432/${VPS_DB_NAME}?schema=public\""
echo "========================================="
