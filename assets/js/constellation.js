// Synapse AI — Interactive 2D Canvas Force-Directed Constellation Engine

class ConstellationGraph {
  constructor(canvas, data, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = data;
    this.options = options;

    // Simulation nodes & links internal state
    this.nodes = [];
    this.links = [];
    this.nodeMap = new Map();

    // Viewport transform (Pan & Zoom)
    this.transform = { x: 0, y: 0, scale: 1 };
    this.isDraggingViewport = false;
    this.dragStart = { x: 0, y: 0 };

    // Interaction state
    this.hoveredNode = null;
    this.selectedNode = null;
    this.draggedNode = null;
    this.isNodeDragging = false;
    this.mousePos = { x: 0, y: 0 };

    // Filtering state
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.maxDate = new Date('2026-12-31').getTime();

    // Physics parameters
    this.physics = {
      repulsion: 3800,
      springLength: 140,
      springStiffness: 0.04,
      gravity: 0.025,
      damping: 0.86,
      maxVelocity: 12
    };

    // Flowing link particle animations
    this.particles = [];
    this.animFrameId = null;

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.setupNodesAndLinks();
    this.setupEventListeners();
    this.initLinkParticles();

    // Center viewport initially
    this.transform.x = this.canvas.width / 2;
    this.transform.y = this.canvas.height / 2;

    this.startLoop();
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    this.width = parent.clientWidth;
    this.height = parent.clientHeight;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
  }

  setupNodesAndLinks() {
    const nodeCount = this.data.nodes.length;
    const radiusSpan = Math.min(this.width, this.height) * 0.35;

    this.nodes = this.data.nodes.map((n, i) => {
      const angle = (i / nodeCount) * Math.PI * 2 + (Math.random() * 0.4);
      const dist = 50 + Math.random() * radiusSpan;
      const radius = n.impact === 'CRITICAL' ? 18 : n.impact === 'HIGH' ? 14 : 10;

      const nodeObj = {
        ...n,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: radius,
        timestamp: new Date(n.date).getTime(),
        pulsePhase: Math.random() * Math.PI * 2
      };

      this.nodeMap.set(n.id, nodeObj);
      return nodeObj;
    });

    this.links = this.data.links.map(l => {
      return {
        source: this.nodeMap.get(l.source),
        target: this.nodeMap.get(l.target),
        label: l.label
      };
    }).filter(l => l.source && l.target);
  }

  initLinkParticles() {
    this.particles = [];
    for (let i = 0; i < 40; i++) {
      if (this.links.length === 0) break;
      const link = this.links[Math.floor(Math.random() * this.links.length)];
      this.particles.push({
        link: link,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005
      });
    }
  }

  // --- Filter updates ---
  setCategory(category) {
    this.activeCategory = category;
  }

  setSearchQuery(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
  }

  setMaxDate(dateStringOrTimestamp) {
    this.maxDate = typeof dateStringOrTimestamp === 'number'
      ? dateStringOrTimestamp
      : new Date(dateStringOrTimestamp).getTime();
  }

  selectNode(nodeId) {
    const node = typeof nodeId === 'string' ? this.nodeMap.get(nodeId) : nodeId;
    this.selectedNode = node;
    if (this.options.onNodeSelect) {
      this.options.onNodeSelect(node);
    }
  }

  // --- Physics step ---
  updatePhysics() {
    const visibleNodes = this.nodes.filter(n => this.isNodeVisible(n));

    // Repulsion between visible nodes
    for (let i = 0; i < visibleNodes.length; i++) {
      const nodeA = visibleNodes[i];
      for (let j = i + 1; j < visibleNodes.length; j++) {
        const nodeB = visibleNodes[j];
        let dx = nodeB.x - nodeA.x;
        let dy = nodeB.y - nodeA.y;
        let distSq = dx * dx + dy * dy || 1;
        let dist = Math.sqrt(distSq);

        if (dist < 400) {
          let force = this.physics.repulsion / (distSq + 100);
          let fx = (dx / dist) * force;
          let fy = (dy / dist) * force;

          nodeA.vx -= fx;
          nodeA.vy -= fy;
          nodeB.vx += fx;
          nodeB.vy += fy;
        }
      }
    }

    // Spring attraction along links
    for (const link of this.links) {
      if (!this.isNodeVisible(link.source) || !this.isNodeVisible(link.target)) continue;

      let dx = link.target.x - link.source.x;
      let dy = link.target.y - link.source.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 1;
      let delta = dist - this.physics.springLength;
      let force = delta * this.physics.springStiffness;

      let fx = (dx / dist) * force;
      let fy = (dy / dist) * force;

      link.source.vx += fx;
      link.source.vy += fy;
      link.target.vx -= fx;
      link.target.vy -= fy;
    }

    // Gravity to center & velocity update
    for (const node of visibleNodes) {
      if (node === this.draggedNode) continue;

      // Gravity towards (0,0)
      node.vx -= node.x * this.physics.gravity * 0.1;
      node.vy -= node.y * this.physics.gravity * 0.1;

      // Damping
      node.vx *= this.physics.damping;
      node.vy *= this.physics.damping;

      // Max velocity clamp
      let vMag = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
      if (vMag > this.physics.maxVelocity) {
        node.vx = (node.vx / vMag) * this.physics.maxVelocity;
        node.vy = (node.vy / vMag) * this.physics.maxVelocity;
      }

      node.x += node.vx;
      node.y += node.vy;

      // Pulse animation timestamp
      node.pulsePhase += 0.03;
    }
  }

  isNodeVisible(node) {
    if (node.timestamp > this.maxDate) return false;
    if (this.activeCategory !== 'all' && node.category !== this.activeCategory) return false;
    if (this.searchQuery) {
      const matchTitle = node.title.toLowerCase().includes(this.searchQuery);
      const matchCompany = (node.company || '').toLowerCase().includes(this.searchQuery);
      const matchTags = (node.tags || []).some(t => t.toLowerCase().includes(this.searchQuery));
      if (!matchTitle && !matchCompany && !matchTags) return false;
    }
    return true;
  }

  // --- Rendering ---
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Save context for transform
    this.ctx.save();
    this.ctx.translate(this.transform.x, this.transform.y);
    this.ctx.scale(this.transform.scale, this.transform.scale);

    // 1. Draw Links
    this.drawLinks();

    // 2. Draw Moving Flow Particles
    this.drawLinkParticles();

    // 3. Draw Nodes
    this.drawNodes();

    this.ctx.restore();
  }

  drawLinks() {
    for (const link of this.links) {
      const srcVisible = this.isNodeVisible(link.source);
      const tgtVisible = this.isNodeVisible(link.target);

      if (!srcVisible && !tgtVisible) continue;

      const isHighlighted = (this.hoveredNode && (link.source === this.hoveredNode || link.target === this.hoveredNode)) ||
                            (this.selectedNode && (link.source === this.selectedNode || link.target === this.selectedNode));

      this.ctx.beginPath();
      this.ctx.moveTo(link.source.x, link.source.y);
      this.ctx.lineTo(link.target.x, link.target.y);

      if (isHighlighted) {
        this.ctx.strokeStyle = '#6FC2E0';
        this.ctx.lineWidth = 2.5;
        this.ctx.globalAlpha = 0.9;
      } else if (srcVisible && tgtVisible) {
        this.ctx.strokeStyle = '#232A33';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.4;
      } else {
        this.ctx.strokeStyle = '#171C23';
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = 0.15;
      }

      this.ctx.stroke();
      this.ctx.globalAlpha = 1.0;
    }
  }

  drawLinkParticles() {
    for (const p of this.particles) {
      if (!this.isNodeVisible(p.link.source) || !this.isNodeVisible(p.link.target)) continue;

      p.progress += p.speed;
      if (p.progress >= 1) p.progress = 0;

      const px = p.link.source.x + (p.link.target.x - p.link.source.x) * p.progress;
      const py = p.link.source.y + (p.link.target.y - p.link.source.y) * p.progress;

      const catMeta = DOMAIN_CATEGORIES[p.link.source.category] || { color: '#F2B155' };

      this.ctx.beginPath();
      this.ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = catMeta.color;
      this.ctx.shadowColor = catMeta.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
  }

  drawNodes() {
    const visibleNodes = this.nodes.filter(n => this.isNodeVisible(n));
    const dimNodes = this.nodes.filter(n => !this.isNodeVisible(n));

    // Draw dimmed out of filter nodes softly
    for (const node of dimNodes) {
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(35, 42, 51, 0.2)';
      this.ctx.fill();
    }

    // Draw active visible nodes
    for (const node of visibleNodes) {
      const isSelected = this.selectedNode === node;
      const isHovered = this.hoveredNode === node;
      const catMeta = DOMAIN_CATEGORIES[node.category] || { color: '#F2B155' };
      const color = catMeta.color;

      // Outer Pulsing Glow Ring for Critical/High Impact
      const pulseScale = 1 + Math.sin(node.pulsePhase) * 0.15;
      const outerRadius = (node.radius + 6) * pulseScale;

      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, outerRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.globalAlpha = isSelected ? 0.35 : isHovered ? 0.25 : node.impact === 'CRITICAL' ? 0.18 : 0.08;
      this.ctx.fill();
      this.ctx.globalAlpha = 1.0;

      // Selection Halo Ring
      if (isSelected || isHovered) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius + 7, 0, Math.PI * 2);
        this.ctx.strokeStyle = isSelected ? '#FFFFFF' : color;
        this.ctx.lineWidth = isSelected ? 2.5 : 1.5;
        this.ctx.setLineDash(isSelected ? [4, 3] : []);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }

      // Solid Core
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = isSelected || isHovered ? 16 : 8;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Center Icon indicator
      this.ctx.fillStyle = '#0B0E11';
      this.ctx.font = '10px "IBM Plex Mono", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      const initial = (node.company || node.title).charAt(0).toUpperCase();
      this.ctx.fillText(initial, node.x, node.y + 0.5);

      // Node Title Label beneath
      const fontScale = Math.max(0.7, 1 / this.transform.scale);
      this.ctx.font = `${Math.round(11 * fontScale)}px "Space Grotesk", sans-serif`;
      this.ctx.fillStyle = isSelected ? '#FFFFFF' : isHovered ? '#E7EBEE' : '#8A96A3';
      this.ctx.textAlign = 'center';

      const shortTitle = node.title.length > 24 ? node.title.substring(0, 22) + '…' : node.title;
      this.ctx.fillText(shortTitle, node.x, node.y + node.radius + 14);
    }
  }

  // --- Interaction Event Handlers ---
  setupEventListeners() {
    const getCanvasCoords = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const screenToWorld = (screenX, screenY) => {
      return {
        x: (screenX - this.transform.x) / this.transform.scale,
        y: (screenY - this.transform.y) / this.transform.scale
      };
    };

    // Pointer Down
    const handleDown = (e) => {
      const screenPos = getCanvasCoords(e);
      const worldPos = screenToWorld(screenPos.x, screenPos.y);

      // Check node hit
      const hitNode = this.getNodeAt(worldPos.x, worldPos.y);

      if (hitNode && this.isNodeVisible(hitNode)) {
        this.draggedNode = hitNode;
        this.isNodeDragging = true;
        this.selectNode(hitNode);
      } else {
        this.isDraggingViewport = true;
        this.dragStart = { x: screenPos.x - this.transform.x, y: screenPos.y - this.transform.y };
      }
    };

    // Pointer Move
    const handleMove = (e) => {
      const screenPos = getCanvasCoords(e);
      const worldPos = screenToWorld(screenPos.x, screenPos.y);

      if (this.isNodeDragging && this.draggedNode) {
        this.draggedNode.x = worldPos.x;
        this.draggedNode.y = worldPos.y;
        this.draggedNode.vx = 0;
        this.draggedNode.vy = 0;
      } else if (this.isDraggingViewport) {
        this.transform.x = screenPos.x - this.dragStart.x;
        this.transform.y = screenPos.y - this.dragStart.y;
      } else {
        // Hover check
        const hovered = this.getNodeAt(worldPos.x, worldPos.y);
        if (hovered !== this.hoveredNode) {
          this.hoveredNode = hovered && this.isNodeVisible(hovered) ? hovered : null;
          this.canvas.style.cursor = this.hoveredNode ? 'pointer' : 'grab';
          if (this.options.onNodeHover) {
            this.options.onNodeHover(this.hoveredNode);
          }
        }
      }
    };

    // Pointer Up
    const handleUp = () => {
      this.isNodeDragging = false;
      this.draggedNode = null;
      this.isDraggingViewport = false;
      this.canvas.style.cursor = this.hoveredNode ? 'pointer' : 'grab';
    };

    // Zoom (Wheel)
    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newScale = Math.min(Math.max(0.3, this.transform.scale * zoomFactor), 3.0);

      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      this.transform.x = mouseX - (mouseX - this.transform.x) * (newScale / this.transform.scale);
      this.transform.y = mouseY - (mouseY - this.transform.y) * (newScale / this.transform.scale);
      this.transform.scale = newScale;
    };

    this.canvas.addEventListener('mousedown', handleDown);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    this.canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Touch events
    this.canvas.addEventListener('touchstart', handleDown, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleUp);
  }

  getNodeAt(worldX, worldY) {
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const n = this.nodes[i];
      const dx = worldX - n.x;
      const dy = worldY - n.y;
      const hitRadius = Math.max(n.radius + 6, 14);
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return n;
      }
    }
    return null;
  }

  // Focus and center on a node programmatically
  focusOnNode(nodeId) {
    const node = this.nodeMap.get(nodeId);
    if (!node) return;

    this.selectNode(node);
    this.transform.x = (this.width / 2) - (node.x * this.transform.scale);
    this.transform.y = (this.height / 2) - (node.y * this.transform.scale);
  }

  // Render loop
  startLoop() {
    const loop = () => {
      this.updatePhysics();
      this.render();
      this.animFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConstellationGraph;
}
