// Synapse AI — Main Application Orchestrator

document.addEventListener('DOMContentLoaded', () => {
  const app = new SynapseApp();
  app.init();
});

class SynapseApp {
  constructor() {
    this.graph = null;
    this.currentNode = null;
    this.viewMode = 'graph'; // 'graph' or 'feed'

    this.isPlayingTimeline = false;
    this.timelineInterval = null;
    this.liveFetcher = null;

    // Timeline timestamps (Jan 2022 to Dec 2026)
    this.minTime = new Date('2022-01-01').getTime();
    this.maxTime = new Date('2026-12-31').getTime();
    this.currentTime = this.maxTime;

    // Node selection for comparison
    this.compareNodeA = null;
    this.compareNodeB = null;
  }

  init() {
    this.initGraph();
    this.renderCategoryChips();
    this.setupViewSwitcher();
    this.setupEventListeners();
    this.setupTimeline();
    this.setupCompareModal();
    this.renderMonitoringFeed();

    // Initialize live fetcher
    if (typeof LiveFeedFetcher !== 'undefined') {
      this.liveFetcher = new LiveFeedFetcher(this);
    }

    // Select default featured node
    const defaultFeatured = SYNAPSE_DATA.nodes.find(n => n.id === 'claude-3-7-sonnet') || SYNAPSE_DATA.nodes[0];
    if (defaultFeatured) {
      setTimeout(() => {
        this.graph.selectNode(defaultFeatured);
      }, 500);
    }
  }

  initGraph() {
    const canvas = document.getElementById('constellation-canvas');
    this.graph = new ConstellationGraph(canvas, SYNAPSE_DATA, {
      onNodeSelect: (node) => this.onNodeSelected(node),
      onNodeHover: (node) => this.onNodeHovered(node)
    });

    this.updateNodeCounter();
  }

  // --- View Switcher Mode Toggle ---
  setupViewSwitcher() {
    const btnGraph = document.getElementById('btn-mode-graph');
    const btnFeed = document.getElementById('btn-mode-feed');
    const canvasContainer = document.getElementById('canvas-container');
    const feedContainer = document.getElementById('feed-container');

    if (!btnGraph || !btnFeed) return;

    const setMode = (mode) => {
      this.viewMode = mode;
      if (mode === 'graph') {
        btnGraph.classList.add('active');
        btnFeed.classList.remove('active');
        canvasContainer.classList.remove('hidden');
        feedContainer.classList.add('hidden');
        if (this.graph) this.graph.resizeCanvas();
      } else {
        btnFeed.classList.add('active');
        btnGraph.classList.remove('active');
        feedContainer.classList.remove('hidden');
        canvasContainer.classList.add('hidden');
        this.renderMonitoringFeed();
      }
    };

    btnGraph.addEventListener('click', () => setMode('graph'));
    btnFeed.addEventListener('click', () => setMode('feed'));
  }

  // --- Category Chips ---
  renderCategoryChips() {
    const container = document.getElementById('category-filter-chips');
    if (!container) return;

    let html = `
      <button class="chip active" data-cat="all" style="--chip-color: var(--c-models)">
        <span class="chip-dot"></span> All Channels (9)
      </button>
    `;

    for (const [key, meta] of Object.entries(DOMAIN_CATEGORIES)) {
      html += `
        <button class="chip" data-cat="${key}" style="--chip-color: ${meta.color}">
          <span class="chip-dot"></span> ${meta.icon} ${meta.label}
        </button>
      `;
    }

    container.innerHTML = html;

    // Chip click listeners
    container.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-cat');
        this.graph.setCategory(cat);
        this.updateNodeCounter();

        if (this.viewMode === 'feed') {
          this.renderMonitoringFeed();
        }
      });
    });
  }

  // --- Event Listeners ---
  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        this.graph.setSearchQuery(query);
        this.updateNodeCounter();

        if (this.viewMode === 'feed') {
          this.renderMonitoringFeed();
        }
      });
    }

    // Live Fetch Button
    const btnFetchLive = document.getElementById('btn-fetch-live');
    if (btnFetchLive) {
      btnFetchLive.addEventListener('click', () => {
        if (this.liveFetcher) {
          this.liveFetcher.fetchAllLiveFeeds();
        }
      });
    }

    // HUD close button
    const closeHudBtn = document.getElementById('close-hud');
    if (closeHudBtn) {
      closeHudBtn.addEventListener('click', () => {
        document.getElementById('hud-inspector').classList.remove('open');
      });
    }

    // Viewport controls (Zoom +, Zoom -, Reset)
    const zoomInBtn = document.getElementById('btn-zoom-in');
    const zoomOutBtn = document.getElementById('btn-zoom-out');
    const resetViewBtn = document.getElementById('btn-reset-view');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        this.graph.transform.scale = Math.min(3.0, this.graph.transform.scale * 1.2);
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        this.graph.transform.scale = Math.max(0.3, this.graph.transform.scale / 1.2);
      });
    }
    if (resetViewBtn) {
      resetViewBtn.addEventListener('click', () => {
        this.graph.transform.x = this.graph.width / 2;
        this.graph.transform.y = this.graph.height / 2;
        this.graph.transform.scale = 1.0;
      });
    }

    // Open Compare Button
    const openCompareBtn = document.getElementById('btn-open-compare');
    if (openCompareBtn) {
      openCompareBtn.addEventListener('click', () => {
        this.openCompareModal(this.currentNode);
      });
    }
  }

  // --- Monitoring Station Multi-Column Grid Renderer (ai-dev-dashboard) ---
  renderMonitoringFeed() {
    const container = document.getElementById('feed-container');
    if (!container) return;

    let columnsHtml = '';

    for (const [catKey, meta] of Object.entries(DOMAIN_CATEGORIES)) {
      if (this.graph.activeCategory !== 'all' && this.graph.activeCategory !== catKey) {
        continue;
      }

      const items = SYNAPSE_DATA.nodes.filter(n => {
        if (n.category !== catKey) return false;
        return this.graph.isNodeVisible(n);
      });

      const signalBarsHtml = this.generateSignalBars(items.length);
      const sparklineSvg = this.generateSparklineSvg(items.length, meta.color);

      let itemsListHtml = '';
      if (items.length === 0) {
        itemsListHtml = `<li style="font-size:11px; color:var(--text-muted); padding:12px; text-align:center;">No items match current filters.</li>`;
      } else {
        itemsListHtml = items.map(item => `
          <li class="feed-item-card" data-node-id="${item.id}" style="--channel-color:${meta.color}">
            <div class="feed-item-title-row">
              <div class="feed-item-title">${this.escapeHtml(item.title)}</div>
              <div class="feed-item-meta">
                <span>${this.escapeHtml(item.company || '')}</span>
                <span>${this.timeAgo(item.date)}</span>
              </div>
            </div>
            <div class="feed-item-preview">${this.escapeHtml(item.tldr)}</div>
          </li>
        `).join('');
      }

      columnsHtml += `
        <div class="channel-column" style="--channel-color:${meta.color}">
          <div class="channel-card-head">
            <div class="channel-title-group">
              <span class="channel-icon">${meta.icon}</span>
              <span class="channel-title">${meta.label}</span>
              <span class="channel-item-count">${items.length}</span>
            </div>
            ${signalBarsHtml}
          </div>
          <div class="channel-sparkline-row">
            <span style="font-size:10px; font-family:var(--font-mono); color:var(--text-muted); text-transform:uppercase">Activity Signal</span>
            ${sparklineSvg}
          </div>
          <ul class="channel-item-list">
            ${itemsListHtml}
          </ul>
        </div>
      `;
    }

    container.innerHTML = columnsHtml;

    // Attach card click handlers for expand & HUD inspect
    container.querySelectorAll('.feed-item-card').forEach(card => {
      card.addEventListener('click', (e) => {
        card.classList.toggle('is-expanded');

        const nodeId = card.getAttribute('data-node-id');
        const node = SYNAPSE_DATA.nodes.find(n => n.id === nodeId);
        if (node) {
          this.onNodeSelected(node);
        }
      });
    });
  }

  generateSignalBars(count) {
    const lit = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4;
    let html = '<div class="signal-bars">';
    for (let i = 0; i < 4; i++) {
      html += `<span style="opacity:${i < lit ? 1 : 0.2}"></span>`;
    }
    return html + '</div>';
  }

  generateSparklineSvg(count, color) {
    const points = [
      Math.max(1, count - 3),
      Math.max(2, count - 1),
      Math.max(1, count - 2),
      count,
      count + 1
    ];
    const max = Math.max(...points, 5);
    const min = Math.min(...points, 0);
    const range = Math.max(max - min, 1);
    const w = 90, h = 20, pad = 2;
    const step = (w - pad * 2) / (points.length - 1);

    const ptsStr = points.map((c, i) => {
      const x = pad + i * step;
      const y = h - pad - ((c - min) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return `
      <svg class="sparkline-svg" viewBox="0 0 90 20">
        <polyline points="${ptsStr}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
      </svg>
    `;
  }

  timeAgo(dateStr) {
    if (!dateStr) return '';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days < 1) return 'today';
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // --- HUD Inspector ---
  onNodeSelected(node) {
    this.currentNode = node;
    const inspector = document.getElementById('hud-inspector');
    if (!inspector || !node) {
      if (inspector) inspector.classList.remove('open');
      return;
    }

    const catMeta = DOMAIN_CATEGORIES[node.category] || { label: node.category, color: '#F2B155', icon: '🌌' };

    // Update HUD Content
    inspector.style.setProperty('--cat-color', catMeta.color);

    document.getElementById('hud-cat-badge').innerHTML = `${catMeta.icon} ${catMeta.label}`;
    document.getElementById('hud-title').textContent = node.title;
    
    // Impact badge
    const impactEl = document.getElementById('hud-impact-badge');
    impactEl.textContent = `IMPACT: ${node.impact}`;
    impactEl.className = `impact-badge impact-${node.impact.toLowerCase()}`;

    // Specs
    document.getElementById('hud-company').textContent = node.company || 'N/A';
    document.getElementById('hud-date').textContent = node.date || 'N/A';

    // TL;DR & Details
    document.getElementById('hud-tldr').textContent = node.tldr || '';
    document.getElementById('hud-details').textContent = node.details || '';

    // Specs Grid
    const specsGrid = document.getElementById('hud-specs-grid');
    if (specsGrid && node.specs) {
      let specsHtml = '';
      for (const [k, v] of Object.entries(node.specs)) {
        specsHtml += `
          <div class="spec-card">
            <div class="spec-key">${k}</div>
            <div class="spec-val">${v}</div>
          </div>
        `;
      }
      specsGrid.innerHTML = specsHtml;
    }

    // Tags
    const tagsWrap = document.getElementById('hud-tags');
    if (tagsWrap) {
      tagsWrap.innerHTML = (node.tags || []).map(t => `<span class="tag-chip">${t}</span>`).join('');
      tagsWrap.querySelectorAll('.tag-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const searchInput = document.getElementById('search-input');
          if (searchInput) {
            searchInput.value = chip.textContent.replace('#', '');
            this.graph.setSearchQuery(searchInput.value);
            if (this.viewMode === 'feed') this.renderMonitoringFeed();
          }
        });
      });
    }

    // Related Connected Nodes Links
    const relatedContainer = document.getElementById('hud-related-links');
    if (relatedContainer) {
      const connectedLinks = SYNAPSE_DATA.links.filter(l => l.source === node.id || l.target === node.id);
      if (connectedLinks.length > 0) {
        let relHtml = '<div class="hud-section-label" style="margin-top:12px">Synaptic Connections</div><ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:6px;">';
        connectedLinks.forEach(l => {
          const otherId = l.source === node.id ? l.target : l.source;
          const otherNode = SYNAPSE_DATA.nodes.find(n => n.id === otherId);
          if (otherNode) {
            relHtml += `
              <li style="font-size:11px; cursor:pointer; color:var(--c-models); display:flex; justify-content:space-between; background:var(--bg-panel-raised); padding:6px 10px; border-radius:4px;" data-node-id="${otherNode.id}">
                <span>⚡ ${otherNode.title}</span>
                <span style="font-family:var(--font-mono); color:var(--text-muted); font-size:9px">${l.label}</span>
              </li>
            `;
          }
        });
        relHtml += '</ul>';
        relatedContainer.innerHTML = relHtml;

        relatedContainer.querySelectorAll('li').forEach(li => {
          li.addEventListener('click', () => {
            const targetId = li.getAttribute('data-node-id');
            const targetNode = SYNAPSE_DATA.nodes.find(n => n.id === targetId);
            if (targetNode) {
              if (this.viewMode === 'graph') {
                this.graph.focusOnNode(targetId);
              } else {
                this.onNodeSelected(targetNode);
              }
            }
          });
        });
      } else {
        relatedContainer.innerHTML = '';
      }
    }

    // Primary Source Button
    const sourceBtn = document.getElementById('hud-source-btn');
    if (sourceBtn) {
      sourceBtn.href = node.sourceUrl || '#';
      sourceBtn.target = '_blank';
    }

    // Compare button in HUD
    const compareHudBtn = document.getElementById('hud-compare-btn');
    if (compareHudBtn) {
      compareHudBtn.onclick = () => this.openCompareModal(node);
    }

    // Open Drawer
    inspector.classList.add('open');
  }

  onNodeHovered(node) {
    // Optional hover callback
  }

  updateNodeCounter() {
    const visibleCount = this.graph.nodes.filter(n => this.graph.isNodeVisible(n)).length;
    const totalCount = this.graph.nodes.length;
    const counterEl = document.getElementById('visible-count');
    if (counterEl) {
      counterEl.textContent = `${visibleCount} / ${totalCount}`;
    }
  }

  // --- Timeline Controller ("Chronos") ---
  setupTimeline() {
    const slider = document.getElementById('timeline-slider');
    const readout = document.getElementById('timeline-date-readout');
    const playBtn = document.getElementById('play-timeline-btn');

    if (!slider) return;

    slider.min = this.minTime;
    slider.max = this.maxTime;
    slider.value = this.maxTime;

    const updateTimelineView = (timeVal) => {
      this.currentTime = parseInt(timeVal, 10);
      this.graph.setMaxDate(this.currentTime);
      
      const d = new Date(this.currentTime);
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      if (readout) {
        readout.textContent = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      }
      this.updateNodeCounter();

      if (this.viewMode === 'feed') {
        this.renderMonitoringFeed();
      }
    };

    slider.addEventListener('input', (e) => updateTimelineView(e.target.value));

    // Play/Pause button
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.isPlayingTimeline = !this.isPlayingTimeline;
        playBtn.textContent = this.isPlayingTimeline ? '⏸' : '▶';

        if (this.isPlayingTimeline) {
          if (this.currentTime >= this.maxTime) {
            this.currentTime = this.minTime;
          }
          const stepMs = (this.maxTime - this.minTime) / 120; // 120 steps across time range

          this.timelineInterval = setInterval(() => {
            this.currentTime += stepMs;
            if (this.currentTime >= this.maxTime) {
              this.currentTime = this.maxTime;
              this.isPlayingTimeline = false;
              playBtn.textContent = '▶';
              clearInterval(this.timelineInterval);
            }
            slider.value = this.currentTime;
            updateTimelineView(this.currentTime);
          }, 80);
        } else {
          clearInterval(this.timelineInterval);
        }
      });
    }
  }

  // --- Nexus Chamber Comparison Modal ---
  setupCompareModal() {
    const modal = document.getElementById('compare-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const selectA = document.getElementById('select-node-a');
    const selectB = document.getElementById('select-node-b');

    if (!modal) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });

    // Populate selects
    const populateSelects = () => {
      const optionsHtml = SYNAPSE_DATA.nodes.map(n => `<option value="${n.id}">${n.title} (${n.company})</option>`).join('');
      if (selectA) selectA.innerHTML = optionsHtml;
      if (selectB) selectB.innerHTML = optionsHtml;
    };

    populateSelects();

    if (selectA) {
      selectA.addEventListener('change', (e) => {
        this.compareNodeA = SYNAPSE_DATA.nodes.find(n => n.id === e.target.value);
        this.renderCompareCards();
      });
    }
    if (selectB) {
      selectB.addEventListener('change', (e) => {
        this.compareNodeB = SYNAPSE_DATA.nodes.find(n => n.id === e.target.value);
        this.renderCompareCards();
      });
    }
  }

  openCompareModal(initialNode) {
    const modal = document.getElementById('compare-modal');
    if (!modal) return;

    this.compareNodeA = initialNode || SYNAPSE_DATA.nodes[0];
    this.compareNodeB = SYNAPSE_DATA.nodes.find(n => n.id !== this.compareNodeA.id) || SYNAPSE_DATA.nodes[1];

    const selectA = document.getElementById('select-node-a');
    const selectB = document.getElementById('select-node-b');

    if (selectA) selectA.value = this.compareNodeA.id;
    if (selectB) selectB.value = this.compareNodeB.id;

    this.renderCompareCards();
    modal.classList.add('open');
  }

  renderCompareCards() {
    const renderCardContent = (node, containerId) => {
      const el = document.getElementById(containerId);
      if (!el || !node) return;

      const catMeta = DOMAIN_CATEGORIES[node.category] || { label: node.category, color: '#F2B155' };

      let specsHtml = '';
      if (node.specs) {
        for (const [k, v] of Object.entries(node.specs)) {
          specsHtml += `<div style="font-size:11px; font-family:var(--font-mono); color:var(--text-secondary);"><strong style="color:var(--text-primary)">${k}:</strong> ${v}</div>`;
        }
      }

      el.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="hud-category-badge" style="--cat-color:${catMeta.color}">${catMeta.icon} ${catMeta.label}</span>
          <span class="impact-badge impact-${node.impact.toLowerCase()}">${node.impact}</span>
        </div>
        <h3 style="font-family:var(--font-display); font-size:16px; font-weight:700;">${node.title}</h3>
        <div style="font-family:var(--font-mono); font-size:11px; color:var(--text-muted)">${node.company} · ${node.date}</div>
        <div class="hud-tldr" style="--cat-color:${catMeta.color}; font-size:12px; margin-top:8px;">${node.tldr}</div>
        <div style="display:flex; flex-direction:column; gap:4px; background:var(--bg-panel-raised); padding:10px; border-radius:6px;">
          ${specsHtml}
        </div>
      `;
    };

    renderCardContent(this.compareNodeA, 'compare-card-a');
    renderCardContent(this.compareNodeB, 'compare-card-b');
  }
}
