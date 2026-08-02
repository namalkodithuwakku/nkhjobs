# N K Hospitality Jobs

AI-assisted hospitality recruitment for `jobs.nkhotels.lk`.

## Included product surfaces

- Public responsive recruitment website
- Mobile app-style navigation
- Job-seeker dashboard, AI job matches, CV profile and application tracker
- Hotelier dashboard, three-step vacancy builder, candidate matches and payments
- Administrator dashboard, review queue, users, payments and commercial settings
- Free first post and LKR 1,000 subsequent-post logic
- Bank-transfer reference and WhatsApp receipt flow
- Complete Supabase schema, private CV storage and Row Level Security foundation

## Supabase setup

1. Create a new Supabase project.
2. Open SQL Editor and run `supabase/NK_Hospitality_Jobs_Initial_Setup.sql` once.
3. In Authentication, enable Email sign-in. Phone OTP can be added later.
4. Copy `.env.example` to `.env.local` and enter the project URL and keys.
5. Keep `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` server-side only.
6. Replace the WhatsApp number and bank placeholders before launch.

## Required AI server actions

Production AI calls should be made only from protected server routes:

- `extract-cv`: extract structured experience, education, skills and languages
- `review-cv`: find missing information, duplicates and suspicious content
- `review-job`: check relevance, clarity, discrimination, scams and missing requirements
- `generate-matches`: calculate factor scores and a plain-language explanation

Suggested score weighting: role 25%, experience 20%, qualification 15%, skills 15%, location 10%, language 5%, salary 5%, availability 5%.

AI is a pre-check only. Every CV and job remains in `pending_admin_review` until an administrator approves it.

## Launch rules

- One free post per verified hotel, not per user account
- Additional job posts cost LKR 1,000 and remain active for 30 days
- Full access to candidates who directly apply to a hotel’s vacancy
- CV and contact information never public
- Separate badges for Profile Reviewed, Identity Verified and Qualification Verified
- Important edits return an approved profile or job to the review queue

