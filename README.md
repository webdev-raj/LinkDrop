# LinkDrop

Free link-in-bio builder with short slug URLs. No account required.

Pages save to **Supabase**. Background GIFs/images upload to **Cloudinary**.

## Run locally

```bash
npm install
cp .env.example .env   # fill in Supabase + Cloudinary keys
npm start
```

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the SQL Editor
3. **Project Settings → API** — copy **Project URL** and **anon public** key
4. Add to `.env`:

```
REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...
```

## Cloudinary setup (backgrounds)

1. [cloudinary.com](https://cloudinary.com) → **Settings → Upload → Add preset** (unsigned, name: `linkdrop`)
2. Dashboard **Home** → copy **Cloud name** (not the preset name)
3. Add to `.env`:

```
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=linkdrop
```

## Deploy to Vercel

1. Push to GitHub and import on Vercel
2. Add all four `REACT_APP_*` env vars
3. Deploy

## How URLs work

**Generate my link** saves your page to Supabase and returns:

```
https://yoursite.vercel.app/p/maya-x7k2
```

The `/p/:slug` route loads page data from the database. View counts increment automatically.

## Studio routes

| URL | Page |
|-----|------|
| `/` | Marketing landing |
| `/create` | Builder studio |
| `/p/:slug` | Published link page |
