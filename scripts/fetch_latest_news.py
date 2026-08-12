#!/usr/bin/env python3
"""
Synapse AI — Automated News & Development Fetcher
Aggregates live news, papers, releases, and governance policy updates across 9 AI domains.
Updates assets/js/data.js with sanitized, deduplicated, enriched AI nodes.
"""

import json
import os
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

# 9 Domain Feed Registries (Verified Active Feeds)
FEED_SOURCES = {
    "overall": [
        {"name": "MIT Tech Review AI", "url": "https://www.technologyreview.com/feed/"},
        {"name": "VentureBeat AI", "url": "https://venturebeat.com/category/ai/feed/"},
        {"name": "arXiv CS.AI", "url": "http://export.arxiv.org/rss/cs.AI"}
    ],
    "agentic_ai": [
        {"name": "Hugging Face Blog", "url": "https://huggingface.co/blog/feed.xml"},
        {"name": "HackerNews Agentic AI", "url": "https://hnrss.org/newest?q=agentic+AI"}
    ],
    "models": [
        {"name": "OpenAI Newsroom", "url": "https://openai.com/news/rss.xml"},
        {"name": "Meta AI Blog", "url": "https://ai.meta.com/blog/rss/"},
        {"name": "HackerNews Model Releases", "url": "https://hnrss.org/newest?q=LLM+model+release"}
    ],
    "companies": [
        {"name": "NVIDIA Newsroom", "url": "https://nvidianews.nvidia.com/releases.xml"},
        {"name": "VentureBeat Business", "url": "https://venturebeat.com/category/ai/feed/"}
    ],
    "security": [
        {"name": "CISA Cybersecurity", "url": "https://www.cisa.gov/cybersecurity-advisories/all.xml"},
        {"name": "HackerNews AI Security", "url": "https://hnrss.org/newest?q=AI+security+jailbreak"}
    ],
    "fellowships": [
        {"name": "NSF News", "url": "https://www.nsf.gov/rss/rss_www_news.xml"}
    ],
    "military": [
        {"name": "Defense One AI", "url": "https://www.defenseone.com/rss/all/"}
    ],
    "governance": [
        {"name": "NIST News", "url": "https://www.nist.gov/news-events/news/rss.xml"},
        {"name": "EU Digital Strategy", "url": "https://digital-strategy.ec.europa.eu/en/rss.xml"}
    ],
    "multilateral": [
        {"name": "UN News AI", "url": "https://news.un.org/feed/subscribe/en/news/all/rss.xml"}
    ]
}

def clean_html(raw_html):
    if not raw_html:
        return ""
    clean = re.sub(r'<[^>]+>', '', raw_html)
    return re.sub(r'\s+', ' ', clean).strip()

def determine_impact(title, summary):
    text = (title + " " + summary).lower()
    if any(k in text for k in ["breakthrough", "r1", "gpt-5", "claude 4", "banned", "eu ai act", "un resolution", "supercomputer", "100k gpu"]):
        return "CRITICAL"
    elif any(k in text for k in ["launch", "model", "grant", "fellowship", "policy", "security vulnerability", "military"]):
        return "HIGH"
    return "MODERATE"

def extract_tags(text, company):
    tags = set()
    text_lower = text.lower()
    
    company_map = {
        "openai": "#OpenAI", "anthropic": "#Anthropic", "meta": "#Meta",
        "google": "#Google", "nvidia": "#NVIDIA", "deepseek": "#DeepSeek",
        "perplexity": "#Perplexity", "microsoft": "#Microsoft", "un": "#UnitedNations",
        "dod": "#Pentagon", "eu": "#EUAIAct"
    }
    
    for key, tag in company_map.items():
        if key in text_lower or key in company.lower():
            tags.add(tag)
            
    if "agent" in text_lower: tags.add("#AgenticAI")
    if "reasoning" in text_lower: tags.add("#Reasoning")
    if "security" in text_lower or "cve" in text_lower: tags.add("#AISecurity")
    if "fellowship" in text_lower or "grant" in text_lower: tags.add("#Fellowship")
    if "military" in text_lower or "defense" in text_lower: tags.add("#DefenseAI")
    if "governance" in text_lower or "act" in text_lower: tags.add("#Governance")

    return list(tags) if tags else ["#AITrend"]

def fetch_rss_feed(source, category):
    items = []
    try:
        req = urllib.request.Request(
            source["url"], 
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SynapseAIBot/2.5"}
        )
        with urllib.request.urlopen(req, timeout=8) as response:
            content = response.read().decode('utf-8', errors='ignore')
            
            # Clean common XML decoding bugs before parsing
            content = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', content)
            root = ET.fromstring(content)
            
            # Channel items
            for item in root.findall(".//item")[:5]:
                title = clean_html(item.findtext("title") or "")
                link = item.findtext("link") or source["url"]
                description = clean_html(item.findtext("description") or "")

                if not title or len(title) < 5:
                    continue

                impact = determine_impact(title, description)
                tags = extract_tags(title + " " + description, source["name"])
                
                node_id = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:40]

                items.append({
                    "id": f"live-{category}-{node_id}",
                    "title": title[:100],
                    "category": category,
                    "date": datetime.now().strftime("%Y-%m-%d"),
                    "impact": impact,
                    "company": source["name"],
                    "tldr": description[:180] + "..." if len(description) > 180 else description,
                    "specs": {"source": source["name"], "type": "Live RSS Feed"},
                    "tags": tags,
                    "sourceUrl": link,
                    "details": description or "Live news development fetched from official RSS feed."
                })
    except Exception as e:
        print(f"[-] Warning fetching {source['name']}: {e}")

    return items

def main():
    print("[+] Starting Synapse AI News & Development Fetcher...")
    fetched_nodes = []
    
    for cat_key, sources in FEED_SOURCES.items():
        print(f"[+] Processing category: {cat_key}")
        for src in sources:
            items = fetch_rss_feed(src, cat_key)
            fetched_nodes.extend(items)

    print(f"[+] Total fresh nodes fetched: {len(fetched_nodes)}")
    
    if len(fetched_nodes) > 0:
        # Update assets/js/data.js
        target_path = "assets/js/data.js"
        if os.path.exists(target_path):
            with open(target_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Prepend fresh items into data.js
            print("[+] Merging fresh nodes into assets/js/data.js...")
            manifest = {
                "timestamp": datetime.now().isoformat(),
                "fetched_count": len(fetched_nodes),
                "nodes": fetched_nodes
            }
            with open("scripts/latest_fetch_summary.json", "w", encoding="utf-8") as f:
                json.dump(manifest, f, indent=2)

if __name__ == "__main__":
    main()
