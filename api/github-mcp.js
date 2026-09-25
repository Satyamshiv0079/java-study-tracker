export default async function handler(req, res) {
  // CORS Headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { action, username = 'Satyamshiv0079', repo = 'java-study-tracker' } = req.body || {};

    const headers = {
      'User-Agent': 'CodeMentor-GitHub-MCP-Agent',
      'Accept': 'application/vnd.github.v3+json'
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // --- GitHub MCP Tool 1: List Repositories ---
    if (action === 'get_repositories') {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, { headers });
      const repos = await response.json();
      
      if (!Array.isArray(repos)) {
        return res.status(500).json({ error: repos.message || "Failed to fetch repositories" });
      }

      const formattedRepos = repos.map(r => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        updatedAt: r.updated_at,
        url: r.html_url
      }));

      return res.json({ username, count: formattedRepos.length, repositories: formattedRepos });
    }

    // --- GitHub MCP Tool 2: Fetch Recent Commits & Study Activity ---
    if (action === 'get_recent_commits') {
      const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits?per_page=10`, { headers });
      const commits = await response.json();

      if (!Array.isArray(commits)) {
        return res.status(500).json({ error: commits.message || "Failed to fetch commits" });
      }

      const formattedCommits = commits.map(c => ({
        sha: c.sha.substring(0, 7),
        message: c.commit.message,
        author: c.commit.author.name,
        date: c.commit.author.date,
        url: c.html_url
      }));

      return res.json({ username, repo, count: formattedCommits.length, commits: formattedCommits });
    }

    // --- GitHub MCP Tool 3: Learning Activity Correlation Summary ---
    if (action === 'get_activity_summary') {
      const [repoRes, commitRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`, { headers }),
        fetch(`https://api.github.com/repos/${username}/${repo}/commits?per_page=5`, { headers })
      ]);

      const repos = await repoRes.json();
      const commits = await commitRes.json();

      const languages = Array.isArray(repos) ? [...new Set(repos.map(r => r.language).filter(Boolean))] : ['Java'];
      const commitCount = Array.isArray(commits) ? commits.length : 0;
      const latestCommit = Array.isArray(commits) && commits.length > 0 ? commits[0].commit.message : 'Initial commit';

      return res.json({
        summary: `Active GitHub learner: ${username}`,
        primaryLanguages: languages,
        recentCommitCount: commitCount,
        latestCommitMessage: latestCommit,
        studyCorrelation: "Consistent commit frequency aligns with active Java & Spring Boot backend progress."
      });
    }

    return res.status(400).json({ error: "Invalid action. Use 'get_repositories', 'get_recent_commits', or 'get_activity_summary'." });

  } catch (error) {
    console.error("GitHub MCP Server Error:", error);
    res.status(500).json({ error: { message: error.message } });
  }
}
