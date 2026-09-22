# The Circuit

Personal restaurant field book. Cloudflare Worker + PWA.

## Architecture

```
GitHub (jcs11382/circuit)
        ↓ push to main
Cloudflare Worker
        ↓
https://circuit.<your-subdomain>.workers.dev
        ↓
Safari → Add to Home Screen
```

The Worker serves the PWA and the API.

- `GET /` PWA
- `POST /api/login` passphrase → HttpOnly session cookie
- `GET /api/places` rooms
- `GET|PUT /api/marks` eaten / booked / notes in KV
- `GET /api/drive-times` OSRM from the Worker
- Monday cron writes a heartbeat to KV

Secrets live in Cloudflare. Never in this repo.

- `APP_PASSPHRASE`
- `SESSION_SECRET`

## First deploy

1. Cloudflare dashboard → Workers & Pages → Create Worker named `circuit`
2. Workers → circuit → Settings → Bindings → KV namespace `CIRCUIT_KV`
3. Settings → Variables → Add secrets `APP_PASSPHRASE` and `SESSION_SECRET`
4. Settings → Builds → Connect GitHub repo `jcs11382/circuit`
5. Put the KV namespace id into `wrangler.toml`
6. Push to `main` deploys

Then open the workers.dev URL. Sign in. Share → Add to Home Screen.
