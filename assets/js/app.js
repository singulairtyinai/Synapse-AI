// Synapse AI — Main Application Orchestrator

document.addEventListener('DOMContentLoaded', () => {
  const app = new SynapseApp();
  app.init();
});

class SynapseApp {
  constructor() {
    this.graph = null;
    this.currentNode = null;
    this.isPlayingTimeline = false;
    this.timelineInterval = null;
    
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
    this.setupEventListeners();
    this.setupTimeline();
    this.setupCompareModal();

    // Select a default featured node on startup
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

  // --- Category Chips ---
  renderCategoryChips() {
    const container = document.getElementById('category-filter-chips');
    if (!container) return;

    let html = `
      <button class="chip active" data-cat="all" style="--chip-color: var(--c-models)">
        <span class="chip-dot"></span> All Domains (9)
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
      });
    });
  }

  // --- Event Listeners ---
  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.graph.setSearchQuery(e.target.value);
        this.updateNodeCounter();
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
            this.graph.focusOnNode(targetId);
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
    // Optional hover feedback in toolbar readout
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
