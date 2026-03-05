

## Plan: Clean Up Post Routes & Point Everything to `/post`

### 1. Update SchoolCampusHub.tsx
- Change `handleGetFeatured` (line 159) from `/${school}/guest-post-to-insta` to `/${school}/post`
- Verify the "Post to {school}" button uses this handler

### 2. Remove Old Routes from App.tsx
Delete these 4 routes (lines 76-79):
- `/post-to-insta`
- `/guest-post-to-insta`
- `/:school/guest-post-to-insta`
- `/instagram-submission`

Remove their imports (lines 25, 29-30): `PostToInstagram`, `GuestInstagramPost`, `InstagramSubmission`

### 3. Delete Old Page Files
- `src/pages/PostToInstagram.tsx`
- `src/pages/GuestInstagramPost.tsx`
- `src/pages/InstagramSubmission.tsx`
- `src/components/InstagramSubmissionForm.tsx`

### 4. Fix Other References
- `src/pages/ProfileSuccess.tsx` line 58: change `/post-to-insta?profileId=...` link to `/post`
- `src/pages/SchoolDashboard.tsx`: update `handleGuestInstagramPost` to navigate to `/post` instead of showing the old flow

