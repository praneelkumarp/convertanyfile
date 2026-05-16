# Logo Integration Patch — Apply Steps

## What this patch does

1. **Header** — Replaces the generic Lucide Shield icon with your new PNG shield mark (the one that actually matches your brand kit)
2. **Footer** — Uses the full logo PNG (shield + wordmark + tagline) as the brand splash, with dark/light variants

## Files in this patch

- `Header.tsx` — replaces `src/components/Header.tsx`
- `Footer.tsx` — replaces `src/components/Footer.tsx`

## Steps to apply

### Step 1: Copy the logo PNGs to public/

If you haven't already, extract the **`convertanyfile-logos.zip`** and copy all 9 image files into your project's `public/` folder.

These specifically are needed for header/footer:
- `public/logo-mark-192.png` — header shield
- `public/logo-full-transparent.png` — footer (default)
- `public/logo-full-dark.png` — footer (dark mode)

### Step 2: Copy the two .tsx files

Copy from this patch into your project:

| From this patch | Replace in your project |
|---|---|
| `Header.tsx` | `src/components/Header.tsx` |
| `Footer.tsx` | `src/components/Footer.tsx` |

### Step 3: Restart dev server

```bash
# Stop the dev server (Ctrl+C)
rm -rf node_modules/.vite
bun dev
```

### Step 4: Hard-refresh browser

`Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Step 5: Verify

- **Header**: The icon next to "ConvertAnyFile" is now your actual shield-with-arrows design (not the generic Lucide shield)
- **Footer**: Shows the full logo with tagline as a brand splash on the left
- **Mobile**: Header logo scales down cleanly
- **404 / Not Found**: Still works (unchanged)

## What to expect visually

**Before (current):**
- Header: small purple-blue gradient square with a generic shield outline inside
- Footer: same gradient square repeated + text

**After (with patch):**
- Header: your branded shield with the conversion arrows + "ConvertAnyFile" text
- Footer: full logo splash with tagline ("PRIVACY-FIRST FILE CONVERSION") visible

## Why I'm using PNG in header but only 36px

You asked for the PNG to be the main logo. I'm using `logo-mark-192.png` which is a 192×192 source image displayed at 36×36 pixels — this means it stays sharp on retina/HiDPI screens (the source is 5x the display size, plenty of pixel density).

If you'd prefer the full logo (with tagline) in the header too, just change line 25 in Header.tsx:

Replace:
```tsx
<img
  src="/logo-mark-192.png"
  alt=""
  ...
  className="h-8 w-8 sm:h-9 sm:w-9"
/>
<span className="text-gradient text-lg sm:text-xl">
  ConvertAnyFile
</span>
```

With:
```tsx
<img
  src="/logo-full-transparent.png"
  alt="ConvertAnyFile"
  className="h-9 sm:h-10 w-auto"
/>
```

But I recommend keeping the current setup — full logo in header eats horizontal space and looks too busy on mobile.
