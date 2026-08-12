// Synapse AI — Client-Side Real-Time Live Feed Fetcher Engine

class LiveFeedFetcher {
  constructor(appInstance) {
    this.app = appInstance;
    this.isFetching = false;
    this.pollIntervalMs = 4 * 60 * 60 * 1000; // 4 Hours (14,400,000 ms)
    this.timer = null;

    this.startAutoPolling();
  }

  // Start 4-Hour Background Polling Timer
  startAutoPolling() {
    if (this.timer) clearInterval(this.timer);
    
    // Automatically poll every 4 hours
    this.timer = setInterval(() => {
      console.log('[+] 4-Hour Polling Interval Reached: Triggering live news fetch...');
      this.fetchAllLiveFeeds(true);
    }, this.pollIntervalMs);
  }

  async fetchAllLiveFeeds(isBackground = false) {
    if (this.isFetching) return;
    this.isFetching = true;

    if (!isBackground) {
      this.updateButtonState(true, '⚡ Fetching live signals...');
    }

    try {
      const newNodes = [];

      // 1. Fetch arXiv CS.AI Latest Research Papers
      const arxivNodes = await this.fetchArxivPapers();
      newNodes.push(...arxivNodes);

      // 2. Fetch GitHub Trending Open Source AI Repos
      const githubNodes = await this.fetchGithubAIRepos();
      newNodes.push(...githubNodes);

      // 3. Fetch HackerNews AI Stories
      const hnNodes = await this.fetchHackerNewsAI();
      newNodes.push(...hnNodes);

      if (newNodes.length > 0) {
        this.mergeNewNodes(newNodes);
        this.updateButtonState(false, `✅ Added ${newNodes.length} Fresh Signals!`);
      } else {
        this.updateButtonState(false, '✅ All Feeds Up-to-Date');
      }

      setTimeout(() => {
        this.updateButtonState(false, '⚡ Fetch Live News');
      }, 4000);

    } catch (err) {
      console.warn('Live fetch error:', err);
      this.updateButtonState(false, '⚠️ Fetch Error (Retry)');
      setTimeout(() => {
        this.updateButtonState(false, '⚡ Fetch Live News');
      }, 3000);
    } finally {
      this.isFetching = false;
    }
  }

  // --- arXiv Papers (Research & Overall AI) ---
  async fetchArxivPapers() {
    const nodes = [];
    try {
      const url = 'https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.CL&sortBy=submittedDate&sortOrder=descending&max_results=8';
      const res = await fetch(url);
      const xmlText = await res.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const entries = xmlDoc.querySelectorAll('entry');

      entries.forEach((entry, i) => {
        const title = (entry.querySelector('title')?.textContent || '').replace(/\n/g, ' ').trim();
        const summary = (entry.querySelector('summary')?.textContent || '').replace(/\n/g, ' ').trim();
        const published = (entry.querySelector('published')?.textContent || '').substring(0, 10);
        const link = entry.querySelector('id')?.textContent || 'https://arxiv.org';

        if (title) {
          nodes.push({
            id: `arxiv-live-${Date.now()}-${i}`,
            title: title.length > 90 ? title.substring(0, 88) + '…' : title,
            category: title.toLowerCase().includes('agent') ? 'agentic_ai' : 'overall',
            date: published || new Date().toISOString().substring(0, 10),
            impact: 'HIGH',
            company: 'arXiv CS.AI',
            tldr: summary.substring(0, 170) + '…',
            specs: { type: 'Research Paper', arxivId: link.split('/abs/')[1] || 'Live' },
            tags: ['#arXiv', '#Research', '#Paper', '#CS.AI'],
            sourceUrl: link,
            details: summary
          });
        }
      });
    } catch (e) {
      console.warn('arXiv fetch warning:', e);
    }
    return nodes;
  }

  // --- GitHub AI Repos (Developer Tools & Agentic AI) ---
  async fetchGithubAIRepos() {
    const nodes = [];
    try {
      const url = 'https://api.github.com/search/repositories?q=topic:ai+topic:llm+created:>2025-01-01&sort=stars&order=desc&per_page=6';
      const res = await fetch(url);
      if (!res.ok) return nodes;
      const data = await res.json();

      (data.items || []).forEach(repo => {
        const category = repo.description && repo.description.toLowerCase().includes('agent') ? 'agentic_ai' : 'companies';
        nodes.push({
          id: `gh-live-${repo.id}`,
          title: `${repo.name}: ${repo.description || 'Open source AI project'}`,
          category: category,
          date: (repo.updated_at || new Date().toISOString()).substring(0, 10),
          impact: repo.stargazers_count > 5000 ? 'CRITICAL' : 'HIGH',
          company: repo.owner?.login || 'GitHub Community',
          tldr: `Open-source AI repository with ${repo.stargazers_count.toLocaleString()} stars. ${repo.description || ''}`,
          specs: { stars: `⭐ ${repo.stargazers_count.toLocaleString()}`, license: repo.license?.spdx_id || 'Open' },
          tags: ['#GitHub', '#OpenSource', '#DevTools', `#${repo.name}`],
          sourceUrl: repo.html_url,
          details: repo.description || 'Trending open-source AI project.'
        });
      });
    } catch (e) {
      console.warn('GitHub fetch warning:', e);
    }
    return nodes;
  }

  // --- HackerNews Top AI Stories ---
  async fetchHackerNewsAI() {
    const nodes = [];
    try {
      const topRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const storyIds = await topRes.json();
      
      for (const id of storyIds.slice(0, 12)) {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        const item = await itemRes.json();
        
        if (item && item.title && (item.title.toLowerCase().includes('ai') || item.title.toLowerCase().includes('llm') || item.title.toLowerCase().includes('gpt') || item.title.toLowerCase().includes('claude'))) {
          nodes.push({
            id: `hn-live-${item.id}`,
            title: item.title,
            category: 'models',
            date: new Date(item.time * 1000).toISOString().substring(0, 10),
            impact: item.score > 200 ? 'CRITICAL' : 'HIGH',
            company: 'HackerNews Signal',
            tldr: `Top trending discussion with ${item.score} points and ${item.descendants || 0} comments.`,
            specs: { points: `🔥 ${item.score}`, comments: item.descendants || 0 },
            tags: ['#HackerNews', '#AITrends', '#LiveFeed'],
            sourceUrl: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
            details: `Community discussion around ${item.title}`
          });
        }
      }
    } catch (e) {
      console.warn('HN fetch warning:', e);
    }
    return nodes;
  }

  mergeNewNodes(newNodes) {
    const existingIds = new Set(SYNAPSE_DATA.nodes.map(n => n.id));
    const added = [];

    newNodes.forEach(node => {
      if (!existingIds.has(node.id)) {
        existingIds.add(node.id);
        SYNAPSE_DATA.nodes.unshift(node);
        added.push(node);
      }
    });

    if (added.length > 0 && this.app.graph) {
      this.app.graph.setupNodesAndLinks();
      this.app.updateNodeCounter();
      if (this.app.viewMode === 'feed') {
        this.app.renderMonitoringFeed();
      }
    }
  }

  updateButtonState(loading, labelText) {
    const btn = document.getElementById('btn-fetch-live');
    if (!btn) return;

    btn.textContent = labelText;
    if (loading) {
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';
    } else {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    }
  }
}
