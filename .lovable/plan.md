

## Problem Analysis

Two issues visible in the screenshot:

1. **Light mode embed**: Instagram's embed iframe renders with a white background. Instagram does NOT offer a native dark mode parameter for embeds. The `colorScheme: "dark"` CSS property only affects browser chrome, not the iframe content served by Instagram.

2. **"Profile may be broken" error**: The current embed URL uses the `/embed/` endpoint which shows a profile-style embed. For accounts with 0 posts, Instagram's embed sometimes shows a misleading error message. This is an Instagram-side behavior, not a bug in the Frosh code.

## Plan

### 1. Force dark mode on the Instagram embed using CSS `filter: invert(1) hue-rotate(180deg)`

This is the standard technique for forcing dark mode on third-party iframes that don't support it natively. It inverts all colors (white becomes black, black becomes white) and then rotates hues 180 degrees to restore the original color palette. Images inside get double-inverted to look correct.

**Changes to `InstagramSection.tsx`:**
- Apply `filter: invert(1) hue-rotate(180deg)` and `opacity: 0.95` to the iframe wrapper
- Remove the ineffective `colorScheme: "dark"` property
- Fix the React warning: change `allowTransparency` to the lowercase DOM attribute `allowTransparency={undefined}` or remove it entirely

### 2. Improve the embed URL and error handling

- Simplify the embed URL to just `https://www.instagram.com/{handle}/embed/` (remove unnecessary query params that may cause issues)
- For accounts with 0 posts that show the "broken profile" message: detect this via the iframe loading successfully but showing the error, and after a short delay check the iframe's rendered height. If it's suspiciously small, trigger the fallback.
- Reduce timeout from 8s to 6s for snappier UX

### 3. Improve the fallback card for failed/empty embeds

- Keep the existing dark fallback card (already looks good)
- Make it the immediate default if embed fails, rather than showing a broken white box

### 4. Fix React warning

- Remove `allowTransparency` prop (non-standard, causes React warning) or use the correct lowercase `allowtransparency` as a string attribute

### Files to modify

- **`src/components/InstagramSection.tsx`** — All changes are in this single shared component, automatically applied to all 100+ school pages

