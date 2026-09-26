# Netlify deployment (required for TripSpark link analysis)

This project uses server-side Gemini calls. A plain drag-and-drop static deploy will only publish the React UI and `/api/analyze-link` will not exist.

## Recommended: Netlify + Git repository

1. Put this project in a GitHub repository.
2. In Netlify choose **Add new project → Import an existing project**.
3. Select the repository. `netlify.toml` already provides:
   - build command: `npm run build:web`
   - publish directory: `dist`
   - functions directory: `netlify/functions`
4. In **Site configuration → Environment variables**, add:
   - `GEMINI_API_KEY` = your Google Gemini API key
   - make it available to **Functions** (or all scopes).
5. Redeploy.
6. Open `https://YOUR-SITE.netlify.app/api/health`.
   You should see JSON containing:
   - `"status":"ok"`
   - `"hasGeminiKey":true`
   - `"runtime":"netlify-functions"`
7. Test a **public** YouTube or YouTube Shorts URL in TripSpark.

## Important

- Public YouTube videos/Shorts can be sent directly to Gemini for video understanding.
- Private/unlisted videos are not supported for direct YouTube URL analysis.
- Instagram/TikTok pasted links often do not expose their full video to the backend. In those cases TripSpark asks for a screenshot or short upload instead of inventing a destination.
- Netlify Functions have a request-size limit, so large video-file uploads may fail. Screenshots and YouTube URLs are the most reliable demo inputs.

## If you deploy from the command line instead of GitHub

From this project folder:

```bash
npm install
npx netlify-cli login
npx netlify-cli deploy --build --prod
```

Then add `GEMINI_API_KEY` in the Netlify site environment variables and redeploy.
