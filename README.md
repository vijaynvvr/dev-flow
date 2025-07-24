# PR Description Generator

An intelligent web application that automatically generates pull request descriptions by analyzing code diffs between branches using AI. Built with Next.js 14, NextAuth.js, and Google's Gemini AI.

## ✨ Features

- 🔐 **GitHub OAuth Authentication** - Secure login with your GitHub account
- 📚 **Repository Access** - Browse all your accessible repositories
- 🌿 **Branch Selection** - Choose base and target branches for comparison
- 🤖 **AI-Powered Analysis** - Uses Google Gemini to analyze code diffs intelligently
- 📝 **Structured PR Descriptions** - Generates descriptions in a consistent format:
  - 🚀 Features
  - 🛠 Fixes
  - 🧼 Refactors
  - 🧹 Clean-up
  - 📝 Docs / Chores
- 📊 **Diff Statistics** - Shows file counts, additions, deletions, and commits
- 🔄 **One-Click PR Creation** - Create pull requests directly from the app
- 💻 **Modern UI** - Clean, responsive interface built with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A GitHub account
- A Google account (for Gemini API access)

### Installation

1. **Clone and setup the project:**

```bash
# Create Next.js project with TypeScript
npx create-next-app@latest dev-flow --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd dev-flow

# Install additional dependencies
npm install next-auth@beta @octokit/rest @google/generative-ai lucide-react class-variance-authority clsx tailwind-merge

# Install dev dependencies
npm install -D @types/node
```

2. **Setup environment variables:**

```bash
# Copy the environment template
cp .env.example .env.local
```

3. **Configure GitHub OAuth App:**
   - Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications/new)
   - Create a new OAuth App with:
     - **Homepage URL:** `http://localhost:3000`
     - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
   - Copy the Client ID and Client Secret to your `.env.local`

4. **Get Gemini API Key:**
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Create a new API key
   - Add it to your `.env.local`

5. **Generate Auth Secret:**

```bash
# Generate a random secret
openssl rand -base64 32
# Add the output to AUTH_SECRET in .env.local
```

6. **Start the development server:**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application

## 🔧 Configuration

### Environment Variables

```bash
# NextAuth.js configuration
AUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth credentials
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret

# Google Gemini API key
GEMINI_API_KEY=your-gemini-api-key
```

### GitHub OAuth Setup

1. Navigate to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications/new)
2. Click "New OAuth App"
3. Fill in the form:
   - **Application name:** PR Description Generator
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and generate a Client Secret
6. Add both to your `.env.local` file

### Required GitHub Permissions

The app requests the following GitHub scopes:

- `read:user` - Read user profile information
- `user:email` - Access user email addresses
- `repo` - Access to repositories (read/write for creating PRs)

## 📖 Usage

1. **Sign in** with your GitHub account
2. **Select a repository** from your accessible repos
3. **Choose branches** - select base and target branches for comparison
4. **Generate description** - click to analyze diffs and generate AI-powered description
5. **Review and edit** - modify the generated title and description as needed
6. **Create PR** - click to create the pull request on GitHub

## 🛠 Technical Details

### Tech Stack

- **Framework:** Next.js 14 with App Router
- **Authentication:** NextAuth.js v5 with GitHub provider
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **GitHub API:** Octokit/rest
- **AI:** Google GenAI (Gemini)
- **TypeScript:** Full type safety

### API Routes

- `/api/auth/[...nextauth]` - NextAuth authentication
- `/api/repos` - Fetch user repositories
- `/api/branches` - Fetch repository branches
- `/api/diff` - Analyze diff and generate description
- `/api/create-pr` - Create pull request

### Project Structure

```
dev-flow/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── repos/route.ts
│   │   │   ├── branches/route.ts
│   │   │   ├── diff/route.ts
│   │   │   └── create-pr/route.ts
│   │   ├── auth/signin/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── types/
│   │   └── next-auth.d.ts
│   ├── auth.ts
│   ├── middleware.ts
└── .env.local
```

## 🔒 Security

- No databases - all operations use GitHub API directly
- Secure OAuth flow with NextAuth.js
- API routes protected with authentication middleware
- Environment variables for sensitive data
- HTTPS required for production deployments

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update `NEXTAUTH_URL` to your production domain
5. Update GitHub OAuth app callback URL

### Environment Variables for Production

Make sure to update these for production:

- `NEXTAUTH_URL` - Your production domain
- `AUTH_SECRET` - A secure random string
- Update GitHub OAuth app settings with production URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**GitHub OAuth errors:**

- Verify callback URL matches exactly
- Check that Client ID and Secret are correct
- Ensure the OAuth app is not suspended

**Gemini API errors:**

- Verify API key is correct and active
- Check API quota and billing settings
- Ensure the API is enabled in Google Cloud Console

**Build errors:**

- Clear `.next` folder and node_modules, then reinstall
- Check all environment variables are set
- Verify all dependencies are installed

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Google AI Studio](https://makersuite.google.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
