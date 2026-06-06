from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime
import json

app = FastAPI(
    title="Cookie Tracker Graph API",
    description="ETL backend for the Cookie Tracker Graph — Real Rails Intelligence Library",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Synthetic tracker data mirroring frontend dataset ──

TRACKER_NODES = [
    {"id": "origin", "label": "news-portal.com", "type": "origin", "domain": "news-portal.com", "group": "Publisher", "cookieCount": 2, "latencyMs": 45, "sizeKb": 312, "consentRequired": False},
    {"id": "fp_cdn", "label": "CDN Assets", "type": "cdn", "domain": "cdn.news-portal.com", "group": "Publisher", "cookieCount": 0, "latencyMs": 12, "sizeKb": 890, "consentRequired": False},
    {"id": "fp_api", "label": "Content API", "type": "first-party", "domain": "api.news-portal.com", "group": "Publisher", "cookieCount": 1, "latencyMs": 85, "sizeKb": 44, "consentRequired": False},
    {"id": "ga4", "label": "Google Analytics 4", "type": "analytics", "domain": "analytics.google.com", "group": "Google", "cookieCount": 4, "latencyMs": 120, "sizeKb": 78, "consentRequired": True},
    {"id": "gtm", "label": "Google Tag Manager", "type": "tracker", "domain": "googletagmanager.com", "group": "Google", "cookieCount": 2, "latencyMs": 95, "sizeKb": 112, "consentRequired": True},
    {"id": "gads", "label": "Google Ads", "type": "ad-network", "domain": "googlesyndication.com", "group": "Google", "cookieCount": 6, "latencyMs": 210, "sizeKb": 156, "consentRequired": True},
    {"id": "g_dcm", "label": "DoubleClick", "type": "ad-network", "domain": "doubleclick.net", "group": "Google", "cookieCount": 8, "latencyMs": 180, "sizeKb": 42, "consentRequired": True},
    {"id": "fb_pixel", "label": "Meta Pixel", "type": "tracker", "domain": "connect.facebook.net", "group": "Meta", "cookieCount": 5, "latencyMs": 165, "sizeKb": 88, "consentRequired": True},
    {"id": "fb_audience", "label": "Audience Network", "type": "ad-network", "domain": "an.facebook.com", "group": "Meta", "cookieCount": 3, "latencyMs": 190, "sizeKb": 34, "consentRequired": True},
    {"id": "amzn_ads", "label": "Amazon Ads", "type": "ad-network", "domain": "amazon-adsystem.com", "group": "Amazon", "cookieCount": 4, "latencyMs": 145, "sizeKb": 62, "consentRequired": True},
    {"id": "oracle_data", "label": "Oracle Data Cloud", "type": "broker", "domain": "bluekai.com", "group": "Oracle", "cookieCount": 7, "latencyMs": 230, "sizeKb": 28, "consentRequired": True},
    {"id": "lotame", "label": "Lotame DMP", "type": "broker", "domain": "crwdcntrl.net", "group": "Lotame", "cookieCount": 5, "latencyMs": 195, "sizeKb": 22, "consentRequired": True},
    {"id": "twitter_pixel", "label": "X/Twitter Pixel", "type": "social", "domain": "analytics.twitter.com", "group": "X/Twitter", "cookieCount": 3, "latencyMs": 140, "sizeKb": 46, "consentRequired": True},
    {"id": "hotjar", "label": "Hotjar", "type": "analytics", "domain": "hotjar.com", "group": "Hotjar", "cookieCount": 3, "latencyMs": 175, "sizeKb": 94, "consentRequired": True},
    {"id": "criteo", "label": "Criteo Retargeting", "type": "ad-network", "domain": "criteo.com", "group": "Criteo", "cookieCount": 6, "latencyMs": 200, "sizeKb": 38, "consentRequired": True},
    {"id": "tiktok", "label": "TikTok Pixel", "type": "social", "domain": "analytics.tiktok.com", "group": "TikTok", "cookieCount": 3, "latencyMs": 155, "sizeKb": 52, "consentRequired": True},
]

TRACKER_EDGES = [
    {"source": "origin", "target": "fp_cdn", "dataFlow": "Static assets", "crossOrigin": False},
    {"source": "origin", "target": "fp_api", "dataFlow": "Content & auth", "crossOrigin": False},
    {"source": "origin", "target": "ga4", "dataFlow": "Analytics events", "crossOrigin": True},
    {"source": "origin", "target": "gtm", "dataFlow": "Tag configuration", "crossOrigin": True},
    {"source": "origin", "target": "fb_pixel", "dataFlow": "Pixel events", "crossOrigin": True},
    {"source": "gtm", "target": "gads", "dataFlow": "Ad conversion data", "crossOrigin": True},
    {"source": "gtm", "target": "amzn_ads", "dataFlow": "Shopping intent", "crossOrigin": True},
    {"source": "gtm", "target": "twitter_pixel", "dataFlow": "Social events", "crossOrigin": True},
    {"source": "gtm", "target": "hotjar", "dataFlow": "Session data", "crossOrigin": True},
    {"source": "gtm", "target": "criteo", "dataFlow": "Retargeting events", "crossOrigin": True},
    {"source": "gtm", "target": "tiktok", "dataFlow": "Engagement events", "crossOrigin": True},
    {"source": "gads", "target": "g_dcm", "dataFlow": "Bid requests + user ID", "crossOrigin": True},
    {"source": "fb_pixel", "target": "fb_audience", "dataFlow": "Audience segments", "crossOrigin": True},
    {"source": "g_dcm", "target": "oracle_data", "dataFlow": "Cross-device ID graph", "crossOrigin": True},
    {"source": "gads", "target": "lotame", "dataFlow": "Behavioral segments", "crossOrigin": True},
    {"source": "criteo", "target": "lotame", "dataFlow": "Product interest data", "crossOrigin": True},
]


@app.get("/")
def root():
    return {
        "service": "Cookie Tracker Graph API",
        "version": "1.0.0",
        "rail": "Distribution & Demand",
        "endpoints": ["/graph-data", "/waterfall", "/gdelt-events", "/domain-groups"],
    }


@app.get("/graph-data")
def get_graph():
    return {"nodes": TRACKER_NODES, "edges": TRACKER_EDGES}


@app.get("/waterfall")
def get_waterfall(consent: bool = True):
    base = [
        {"id": "origin", "label": "news-portal.com", "type": "origin", "startMs": 0, "durationMs": 45, "sizeKb": 312, "status": 200, "method": "GET"},
        {"id": "fp_cdn", "label": "cdn.news-portal.com/assets", "type": "cdn", "startMs": 50, "durationMs": 12, "sizeKb": 890, "status": 200, "method": "GET"},
        {"id": "fp_api", "label": "api.news-portal.com/v2/articles", "type": "first-party", "startMs": 55, "durationMs": 85, "sizeKb": 44, "status": 200, "method": "GET"},
    ]
    if consent:
        base.extend([
            {"id": "gtm", "label": "googletagmanager.com/gtm.js", "type": "tracker", "startMs": 95, "durationMs": 95, "sizeKb": 112, "status": 200, "method": "GET"},
            {"id": "ga4", "label": "analytics.google.com/collect", "type": "analytics", "startMs": 100, "durationMs": 120, "sizeKb": 78, "status": 204, "method": "POST"},
            {"id": "fb_pixel", "label": "connect.facebook.net/fbevents.js", "type": "tracker", "startMs": 140, "durationMs": 165, "sizeKb": 88, "status": 200, "method": "GET"},
        ])
    return {"entries": base, "consent": consent, "timestamp": datetime.utcnow().isoformat()}


@app.get("/gdelt-events")
def get_gdelt_events():
    return {
        "source": "GDELT (synthetic)",
        "note": "Well-labeled synthetic data based on real GDELT event themes",
        "events": [
            {"id": "gdelt_001", "date": "2026-05-03", "title": "EU Regulators Fine Meta €1.2B Over Cross-Border Data Transfers", "tone": -4.2, "theme": "REGULATION"},
            {"id": "gdelt_002", "date": "2026-05-02", "title": "Google Delays Third-Party Cookie Deprecation to 2027", "tone": -2.1, "theme": "INDUSTRY_SHIFT"},
            {"id": "gdelt_003", "date": "2026-04-29", "title": "Apple Expands ATT to Safari Extensions", "tone": 1.8, "theme": "PLATFORM_POLICY"},
        ],
    }


@app.get("/domain-groups")
def get_domain_groups():
    return {
        "groups": [
            {"name": "Google", "trackerCount": 4, "cookieCount": 20, "marketShare": "28.6%"},
            {"name": "Meta", "trackerCount": 2, "cookieCount": 8, "marketShare": "20.1%"},
            {"name": "Amazon", "trackerCount": 1, "cookieCount": 4, "marketShare": "12.4%"},
            {"name": "Oracle", "trackerCount": 1, "cookieCount": 7, "marketShare": "Largest 3P data provider"},
        ]
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)