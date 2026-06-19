<p align="center">
    <a href="https://github.com/SuhrobKholmurodov/committerstop-tj"><img src="https://img.shields.io/badge/status-active-brightgreen.svg"></a>
    <a href="https://github.com/SuhrobKholmurodov/committerstop-tj/graphs/contributors"><img src="https://img.shields.io/github/contributors/SuhrobKholmurodov/committerstop-tj?color=blue"></a>
    <a href="https://github.com/SuhrobKholmurodov/committerstop-tj/stargazers"><img src="https://img.shields.io/github/stars/SuhrobKholmurodov/committerstop-tj.svg?logo=github"></a>
    <a href="https://github.com/SuhrobKholmurodov/committerstop-tj/network/members"><img src="https://img.shields.io/github/forks/SuhrobKholmurodov/committerstop-tj.svg?color=blue&logo=github"></a>
    <img src="https://visitor-badge.laobi.icu/badge?page_id=SuhrobKholmurodov.committerstop-tj" alt="visitors"/>   
</p>

![Banner](https://capsule-render.vercel.app/api?type=venom&height=200&color=0:ff6b6b,100:4ecdc4&text=%20TajikGitHub&textBg=false&desc=(Top%20Active%20Developers%20in%20Tajikistan)&descAlign=79&fontAlign=50&descAlignY=70&fontColor=f7f5f5)

<p align="center">
TajikGitHub is a responsive web application that displays the most active GitHub users in Tajikistan, ranked by commits, contributions, or overall activity. The frontend is built with React and TypeScript, using Redux Toolkit Query for data fetching and state management.
</p>


<br>

<h2 id=tech>🛠 Tech Stack</h2>

**Frontend**

![technologies](https://skillicons.dev/icons?i=react,js,ts,tailwind,html,css,vite&perline=10)

**State Management**

![technologies](https://skillicons.dev/icons?i=redux&perline=10)

**Tools & Platforms**

![technologies](https://skillicons.dev/icons?i=github,vscode&perline=10)

<h2>🚀Features</h2>

- 📊 View rankings of top active GitHub users
- 🔄 Switch between Commits, Contributions, and All tabs
- 🔍 Search users by username
- 🖼 View user details and avatars
- ⚡ Data updates dynamically with loading indicators
- 🌙 Toggle dark/light mode
- 🔔 Toast notifications for user interactions

<h2 id=setup>Quick Start</h2>

### Prerequisites

- Node.js 18+
- pnpm or npm
- GitHub Personal Access Token (optional)

## 📥 Setup and Installation

### Frontend

1. Navigate to the project directory:
   ```bash
   cd committerstop-tj
   ```

2. Install the required npm packages:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

<h2>📡 Data Fetching</h2>

- **Committers Data**  
  Scraped live from [committers.top](https://committers.top) using Redux Toolkit Query.  
  Fetches HTML via `https://api.allorigins.win/raw?url=...` to bypass CORS and parses it to extract rankings.

- **GitHub User Details**  
  Pulled directly from the GitHub REST API.  
  Uses an optional `VITE_GITHUB_TOKEN` to increase API rate limits.

<h2 id=contributing>🤝 Contributing</h2>

If you have any ideas, suggestions, or improvements, feel free to contribute by opening issues or submitting pull requests. Your help is always welcome!

<h2 id=license>License</h2>

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

<h2 id=contact>Support</h2>

<div align="left">
    <a href="mailto:suhrob.kholmurodov@gmail.com"><img src="https://img.shields.io/badge/Email-30302f?style=flat-square&logo=gmail" alt="Email"></a>
    <a href="https://github.com/SuhrobKholmurodov/committerstop-tj"><img src="https://img.shields.io/badge/View%20on%20GitHub-30302f?style=flat-square&logo=github" alt="GitHub"></a>
</div>
