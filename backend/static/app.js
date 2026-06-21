const state = {
  activeView: "dashboard",
  bootstrap: null,
};

const views = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "calendar", label: "Calendar", icon: "calendar_month" },
  { id: "agents", label: "Agents", icon: "smart_toy" },
  { id: "content", label: "Content", icon: "description" },
  { id: "analytics", label: "Analytics", icon: "monitoring" },
  { id: "integrations", label: "Integrations", icon: "hub" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const app = document.getElementById("app");
const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursor-ring");

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function badgeClass(status) {
  const value = String(status || "").toLowerCase();
  if (["running", "published", "connected", "active", "success", "done", "monitoring"].includes(value)) return "text-secondary border-secondary/30 bg-secondary/10";
  if (["scheduled", "planned", "draft", "queued", "working"].includes(value)) return "text-tertiary border-tertiary/30 bg-tertiary/10";
  return "text-on-surface-variant border-outline-variant/30 bg-surface-container/60";
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || `Request failed: ${response.status}`);
  }
  return data;
}

function setView(view) {
  state.activeView = view;
  render();
}

function icon(name) {
  return `<span class="material-symbols-outlined text-[18px]">${name}</span>`;
}

function shell() {
  const overview = state.bootstrap.overview;
  return `
    <div class="min-h-screen">
      <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full">
        <nav class="bg-surface/80 backdrop-blur-xl rounded-full mt-4 mx-auto max-w-fit px-6 py-2 border border-outline-variant/30 shadow-[0_0_20px_rgba(170,199,255,0.1)] flex items-center gap-8">
          <div class="flex items-center gap-2">
            <span class="font-headline-sm text-headline-sm text-primary tracking-tighter">AI Marketing Automation</span>
            <div class="w-1.5 h-1.5 bg-secondary rounded-full relative">
              <div class="absolute inset-0 bg-secondary rounded-full ping-dot"></div>
            </div>
          </div>
          <ul class="hidden md:flex items-center gap-6">
            <li><button class="text-on-surface-variant hover:text-primary transition-colors" data-view="dashboard">Platform</button></li>
            <li><button class="text-on-surface-variant hover:text-primary transition-colors" data-view="calendar">Calendar</button></li>
            <li><button class="text-on-surface-variant hover:text-primary transition-colors" data-view="analytics">Analytics</button></li>
            <li><button class="text-on-surface-variant hover:text-primary transition-colors" data-view="integrations">Integrations</button></li>
          </ul>
          <div class="flex items-center gap-4">
            <button class="text-on-surface-variant font-button hover:text-primary transition-colors" data-view="settings">Settings</button>
            <button class="bg-primary text-on-primary font-button px-5 py-2 rounded-full hover:scale-105 transition-transform active:scale-95 duration-300" id="launchQuick">New Campaign</button>
          </div>
        </nav>
      </header>
      <main class="relative z-10 pt-32 lg:pl-64">
        <aside class="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col z-40 hidden lg:flex">
          <div class="p-8">
            <h1 class="font-headline-sm text-headline-sm text-primary tracking-tighter">AI Marketing Automation</h1>
            <div class="flex items-center gap-2 mt-2">
              <div class="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <span class="font-label-caps text-label-caps text-on-surface-variant opacity-70">AI Active</span>
            </div>
          </div>
          <nav class="flex-1 px-4 space-y-1">
            ${views
              .map(
                (view) => {
                  const navClass =
                    view.id === state.activeView
                      ? "text-secondary border-l-2 border-secondary bg-secondary/5 shadow-[inset_10px_0_15px_-10px_rgba(77,220,198,0.2)] translate-x-1"
                      : "text-on-surface-variant hover:bg-surface-variant/10 hover:text-secondary";
                  return `
                  <button class="w-full flex items-center gap-4 px-4 py-3 text-left ${navClass} transition-all duration-200" data-view="${view.id}">
                    ${icon(view.icon)}
                    <span class="font-label-caps text-label-caps uppercase">${view.label}</span>
                  </button>`;
                },
              )
              .join("")}
          </nav>
          <div class="px-6 py-8 mt-auto space-y-4">
            <button class="w-full bg-primary text-on-primary font-button py-4 rounded-full shadow-lg hover:scale-105 transition-transform" id="launchSidebar">New Campaign</button>
            <div class="pt-4 border-t border-outline-variant/10">
              <div class="flex items-center gap-4 px-4 py-2 text-on-surface-variant">
                ${icon("shield")}
                <span class="font-label-caps text-label-caps uppercase">${overview.agent_health} health</span>
              </div>
            </div>
          </div>
        </aside>
        <div class="px-margin-x max-w-container-max mx-auto">
          ${topHeader(overview)}
          ${renderView()}
        </div>
      </main>
    </div>
  `;
}

function topHeader(overview) {
  return `
    <header class="flex justify-between items-center mb-stack-lg pt-8 gap-6">
      <div>
        <h2 class="font-headline-md text-headline-md gradient-text">Marketing Analytics</h2>
        <p class="text-on-surface-variant opacity-70">Real-time performance across all agent-driven channels.</p>
      </div>
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex items-center gap-2 glass-card px-4 py-2 rounded-full border border-outline-variant/30">
          ${icon("search")}
          <input class="bg-transparent border-none focus:ring-0 text-body-md w-48 placeholder:text-on-surface-variant/40" placeholder="Search campaign data..." type="text"/>
        </div>
        <div class="glass-card px-4 py-2 rounded-full border border-outline-variant/30">
          <span class="font-label-caps text-label-caps text-secondary">${escapeHtml(overview.agent_health)} agent health</span>
        </div>
      </div>
    </header>
  `;
}

function kpiCards() {
  const o = state.bootstrap.overview;
  const items = [
    ["Pieces Published", o.published, "Published content items"],
    ["Campaigns Running", o.campaigns, "Active campaign pipelines"],
    ["Scheduled Assets", o.scheduled, "Queued for distribution"],
  ];
  return `
    <section class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
      ${items
        .map(
          ([label, value, note]) => `
            <div class="glass-card p-6 rounded-xl flex flex-col justify-between tilt-card">
              <div class="flex justify-between items-start">
                <span class="font-label-caps text-label-caps text-on-surface-variant uppercase">${escapeHtml(label)}</span>
                <span class="text-secondary">${icon("trending_up")}</span>
              </div>
              <div>
                <div class="font-headline-sm text-headline-sm text-primary tracking-tighter mt-6">${escapeHtml(value)}</div>
                <p class="text-on-surface-variant mt-3">${escapeHtml(note)}</p>
              </div>
            </div>`,
        )
        .join("")}
    </section>
  `;
}

function liveMarquee() {
  const items = ["HubSpot", "Buffer", "Google Analytics", "Salesforce", "OpenAI", "Content Queue"];
  const repeated = [...items, ...items];
  return `
    <section class="py-24 bg-surface-container-lowest/50 border-y border-outline-variant/10 overflow-hidden mb-section-gap">
      <div class="px-margin-x max-w-container-max mx-auto text-center mb-12">
        <span class="font-label-caps text-label-caps text-on-surface-variant">Connect to your ecosystem</span>
      </div>
      <div class="marquee-container w-full">
        <div class="animate-scroll flex items-center gap-16 px-8">
          ${repeated
            .map(
              (name) => `
                <div class="flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <div class="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center">
                    ${icon("hub")}
                  </div>
                  <span class="font-headline-sm text-on-surface">${escapeHtml(name)}</span>
                  <div class="w-2 h-2 bg-secondary rounded-full ml-2 ping-dot"></div>
                </div>`,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function imageCard(src, title, caption, alt) {
  return `
    <div class="glass-card rounded-xl overflow-hidden tilt-card">
      <div class="aspect-[4/3] bg-surface-container-lowest">
        <img src="${src}" alt="${escapeHtml(alt)}" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
      </div>
      <div class="p-4">
        <div class="text-xs uppercase tracking-[0.2em] text-secondary">${escapeHtml(title)}</div>
        <div class="text-sm text-on-surface-variant mt-1">${escapeHtml(caption)}</div>
      </div>
    </div>
  `;
}

function bentoDashboard() {
  const agents = state.bootstrap.agents;
  const content = state.bootstrap.content;
  const campaign = state.bootstrap.campaigns[0];
  const analytics = state.bootstrap.analytics;
  const activities = state.bootstrap.activity.slice(0, 4);
  const heroImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCbB3cOPsOugzOAmT7BdcwQu_pfVospcxzsYSdtncmYXZROT6IHpeeZ3Uwe_yBgdhNkLI69m7pmX2vT0ERUhQ-NqqMK9hqrs_7HK_KD9HcnxI45EzQM7R-U4Ql5e3Dwi2fZWItvY-GhzQk-JEz2WOczZSF_B04VVs1Ag6nNm8gSP2CZmmsQYBq_FfAbByQ5UULdtbV0otP2XM2b7OfiIWPeOO_XBLd4MWmINVR-GjOwqg4Ua7c0XA4ugY4wE6w121aphaDYChoIiF3q";
  const editorialImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBraCZQuAe0njE7IeUAzyMkf_k3U3JSibrZZ80S4te6EpLJvgiYMKbK9I5mE2DOQMweVTMEnezjzsk10rP4LNZdnM72GukFyrFEzSX0eS_QOCXnVDPj0w6jtNCn2B4vBpGuYAJ6zrUuzWZQDF9EdGqrOygUc6e3j18rpwyo_-fOHF-ghZZuQTf4AxbC5zqeKOcRUSY-EIfMdJYYJRt3r5bCwLsQ2ANp5UqhS4kta2zHwtUWjtiJTb9JCckYWTyTHYJx7cVrXvqXN6Nj";
  const contentImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCiFG3BYOhNj6k78PbNhcFJ8QqHdPOsxJdCpYhQGKTcGKT4n3iqGkyUhK_5taH8ydmwM-RbzWNmCHAZ5bxdwhoNBJnpeIP7HAoYK0BND5995EVXCesU7fqegQ3ndVgdGYoiIjAbuLSAiy1acGj2_pUv9gNc3rXzZ9pN39TY8d8HhuikF7yWBrbBqCl0Um3MkujuDaABncihr-A5zzUJLMt09O1tRL2El0VsBpDkPwSSbZm-847BVXYuklXl5sIm5pa4e5kvx_ktQ0IY";
  const analyticsImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCNxd-JOgnjBdCaWctChRuAd1HQzYFoYaLLpXTNR8uNguRu3CSR4a4YTRncykEjzjhiZu2ztQEN-DF6r9nkcIooFRnLVnniYCv5_3uViWsGDO-hxMxZBNLzbfKfhusao8Yw7ZU9887CXo12rV85g7xNPuHqXdTNc5XEPegUSbtLhaKst8GamGyUVD4-kw3Ff6deMYbceqE3IOwVl0KLSaQ4NsdoIBPUv14aN-PmkXvSzLV0eJJCyFuBnWdllMWxZ5dGGr_L7FOjj7p4";

  return `
    <section class="mb-section-gap">
      <div class="grid lg:grid-cols-2 gap-stack-lg items-center">
        <div class="flex flex-col gap-stack-md">
          <div class="font-label-caps text-label-caps text-secondary">AI Marketing Automation</div>
          <h1 class="font-display-lg text-display-lg-mobile lg:text-display-lg italic leading-[0.95] text-primary">
            One Idea In.<br />A Full Campaign Out.
          </h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            AI agents plan, research, write, design, and publish your content end to end, with no manual handoffs.
          </p>
          <div class="flex flex-wrap gap-4 mt-4">
            <button class="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary font-button text-button shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all" id="launchHero">
              Start Your Growth Engine
            </button>
            <div class="flex items-center gap-4 px-6 border border-outline-variant/30 rounded-full glass">
              ${icon("play_circle")}
              <span class="font-button text-button">Watch the Engine</span>
            </div>
          </div>
        </div>
        <div class="relative group">
          <div class="glass-card rounded-xl overflow-hidden tilt-card">
            <div class="aspect-[4/3] bg-surface-container-lowest">
              <img src="${heroImage}" alt="AI Marketing Pipeline Visual" class="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(77,220,198,0.2)]" />
            </div>
            <div class="p-4 flex items-center justify-between">
              <div>
                <div class="font-label-caps text-label-caps text-on-surface-variant">Live campaign</div>
                <div class="font-headline-sm text-headline-sm text-primary">${escapeHtml(campaign?.name || "Campaign")}</div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-secondary rounded-full relative">
                  <div class="absolute inset-0 bg-secondary rounded-full ping-dot"></div>
                </div>
                <span class="font-label-caps text-label-caps text-secondary">AI active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid md:grid-cols-3 gap-gutter mb-section-gap">
      <div class="glass-card rounded-xl overflow-hidden tilt-card">
        <img src="${editorialImage}" alt="Editorial Calendar UI" class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="p-4">
          <div class="text-xs uppercase tracking-[0.2em] text-secondary">Editorial Calendar</div>
          <div class="text-sm text-on-surface-variant mt-1">Monthly planning and publishing timeline.</div>
        </div>
      </div>
      <div class="glass-card rounded-xl overflow-hidden tilt-card">
        <img src="${contentImage}" alt="Content Library UI" class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="p-4">
          <div class="text-xs uppercase tracking-[0.2em] text-secondary">Content Library</div>
          <div class="text-sm text-on-surface-variant mt-1">Drafts, assets, and creative review.</div>
        </div>
      </div>
      <div class="glass-card rounded-xl overflow-hidden tilt-card">
        <img src="${analyticsImage}" alt="Analytics Dashboard UI" class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="p-4">
          <div class="text-xs uppercase tracking-[0.2em] text-secondary">Analytics Engine</div>
          <div class="text-sm text-on-surface-variant mt-1">Performance tracking and insights.</div>
        </div>
      </div>
    </section>

    <section class="border-y border-outline-variant/10 bg-surface-container-low/50 backdrop-blur-sm py-12 mb-section-gap">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
        <div class="flex flex-col items-center text-center gap-2">
          <span class="font-display-lg text-display-lg text-primary">${escapeHtml(state.bootstrap.overview.published)}</span>
          <span class="font-label-caps text-label-caps text-on-surface-variant">Pieces Published</span>
        </div>
        <div class="flex flex-col items-center text-center gap-2">
          <span class="font-display-lg text-display-lg text-primary">${escapeHtml(state.bootstrap.overview.campaigns)}</span>
          <span class="font-label-caps text-label-caps text-on-surface-variant">Active Campaigns</span>
        </div>
        <div class="flex flex-col items-center text-center gap-2">
          <span class="font-display-lg text-display-lg text-primary">${escapeHtml(state.bootstrap.overview.agent_health)}</span>
          <span class="font-label-caps text-label-caps text-on-surface-variant">Agent Health</span>
        </div>
      </div>
    </section>

    <section class="grid lg:grid-cols-2 gap-stack-lg mb-section-gap">
      <div class="glass-card rounded-xl p-6 space-y-5 tilt-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-label-caps text-label-caps text-on-surface-variant">Launch sequence</div>
            <h3 class="font-headline-sm text-headline-sm text-primary">Start from one brief</h3>
          </div>
          <span class="px-3 py-1 rounded-full text-xs border ${badgeClass("running")}">Live</span>
        </div>
        <form id="launchForm" class="grid md:grid-cols-2 gap-4">
          <input class="bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-3" name="name" value="Q4 Demand Engine" />
          <input class="bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-3" name="audience" value="Marketing leaders" />
          <input class="bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-3 md:col-span-2" name="objective" value="Generate qualified demo requests." />
          <select class="bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-3" name="channel">
            <option>Multi-channel</option>
            <option>Blog + LinkedIn</option>
            <option>Email + Social</option>
          </select>
          <button class="bg-gradient-to-r from-primary to-secondary text-on-primary rounded-full px-5 py-3 font-button md:col-span-2" type="submit">Launch Campaign</button>
        </form>
      </div>
      <div class="glass-card rounded-xl p-6 space-y-5 tilt-card">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-label-caps text-label-caps text-on-surface-variant">Recent activity</div>
            <h3 class="font-headline-sm text-headline-sm text-primary">The engine is active</h3>
          </div>
          <button class="text-on-surface-variant hover:text-primary" id="refreshBtn">Refresh</button>
        </div>
        <div class="space-y-3">
          ${activities
            .map(
              (item) => `
                <div class="flex items-center justify-between gap-4 border border-outline-variant/20 rounded-xl px-4 py-3 bg-surface-container-low/60">
                  <div>
                    <div class="text-on-surface">${escapeHtml(item.message)}</div>
                    <div class="text-sm text-on-surface-variant">${escapeHtml(new Date(item.timestamp).toLocaleString())}</div>
                  </div>
                  <span class="px-3 py-1 rounded-full text-xs border ${badgeClass(item.severity)}">${escapeHtml(item.severity)}</span>
                </div>`,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function dashboardView() {
  return `
    ${bentoDashboard()}
    <footer class="w-full px-margin-x max-w-container-max mx-auto flex flex-col items-center gap-stack-lg py-12 border-t border-outline-variant/20">
      <div class="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div class="flex flex-col gap-2">
          <span class="font-display-lg text-display-lg opacity-10 uppercase tracking-widest text-primary">AI Marketing Automation</span>
          <p class="font-body-md text-body-md text-on-surface-variant">2026 AI Marketing Automation. Never Miss A Posting Time.</p>
        </div>
        <div class="flex gap-8 flex-wrap">
          <a class="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a class="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a class="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors" href="#">API Status</a>
        </div>
      </div>
      <div class="w-full h-12 overflow-hidden border-t border-outline-variant/10 flex items-center mt-12 marquee-container">
        <div class="animate-scroll whitespace-nowrap flex gap-12 font-label-caps text-[10px] text-on-surface-variant/40 tracking-[0.3em] uppercase">
          <span>Autonomous Pipeline Active</span>
          <span>System Health 99.9%</span>
          <span>Content Output Optimized</span>
          <span>Autonomous Pipeline Active</span>
          <span>System Health 99.9%</span>
          <span>Content Output Optimized</span>
        </div>
      </div>
    </footer>
  `;
}

function calendarView() {
  return `
    <section class="glass-card rounded-xl p-6 mb-stack-lg">
      <div class="flex items-end justify-between mb-4">
        <div>
          <div class="font-label-caps text-label-caps text-on-surface-variant">Editorial calendar</div>
          <h3 class="font-headline-sm text-headline-sm text-primary">30-day plan</h3>
        </div>
      </div>
      <div class="space-y-3">
        ${state.bootstrap.calendar
          .map(
            (item) => `
              <div class="grid md:grid-cols-3 gap-4 items-center border border-outline-variant/20 rounded-xl px-4 py-3 bg-surface-container-low/60">
                <div>
                  <div class="text-on-surface">${escapeHtml(item.title)}</div>
                  <div class="text-sm text-on-surface-variant">${escapeHtml(item.date)}</div>
                </div>
                <div class="text-sm text-on-surface-variant">${escapeHtml(item.channel)}</div>
                <div class="justify-self-start md:justify-self-end px-3 py-1 rounded-full text-xs border ${badgeClass(item.status)}">${escapeHtml(item.status)}</div>
              </div>`,
          )
          .join("")}
      </div>
    </section>
  `;
}

function agentsView() {
  return `
    <section class="grid md:grid-cols-2 xl:grid-cols-3 gap-gutter mb-stack-lg">
      ${state.bootstrap.agents
        .map(
          (agent) => `
            <div class="glass-card rounded-xl p-6 space-y-4 tilt-card">
              <div class="flex items-start justify-between">
                <div>
                  <div class="font-label-caps text-label-caps text-on-surface-variant">${escapeHtml(agent.id)}</div>
                  <h3 class="font-headline-sm text-headline-sm text-primary">${escapeHtml(agent.name)}</h3>
                </div>
                <span class="px-3 py-1 rounded-full text-xs border ${badgeClass(agent.status)}">${escapeHtml(agent.status)}</span>
              </div>
              <p class="text-on-surface-variant">${escapeHtml(agent.role)}</p>
              <div class="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style="width:${agent.progress}%"></div>
              </div>
              <div class="flex items-center justify-between text-sm text-on-surface-variant">
                <span>Queue ${escapeHtml(agent.queue)}</span>
                <button class="text-secondary hover:text-primary" data-run-agent="${escapeHtml(agent.id)}">Run task batch</button>
              </div>
            </div>`,
        )
        .join("")}
    </section>
  `;
}

function contentView() {
  return `
    <section class="grid xl:grid-cols-2 gap-gutter mb-stack-lg">
      <div class="glass-card rounded-xl p-6">
        <div class="font-label-caps text-label-caps text-on-surface-variant">Create draft</div>
        <h3 class="font-headline-sm text-headline-sm text-primary mb-4">Content editor</h3>
        <form id="contentForm" class="space-y-4">
          <input class="w-full bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-3" name="title" value="The Future of AI Marketing Ops" />
          <div class="grid md:grid-cols-2 gap-4">
            <input class="w-full bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-3" name="type" value="Blog post" />
            <input class="w-full bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-3" name="channel" value="Website" />
          </div>
          <textarea class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 min-h-[140px]" name="summary">Create a polished introduction to the automation workflow and the business case behind it.</textarea>
          <input class="w-full bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-3" name="cta" value="Book a demo" />
          <button class="bg-gradient-to-r from-primary to-secondary text-on-primary rounded-full px-5 py-3 font-button" type="submit">Save Draft</button>
        </form>
      </div>
      <div class="glass-card rounded-xl p-6 space-y-4">
        <div class="font-label-caps text-label-caps text-on-surface-variant">Library</div>
        <h3 class="font-headline-sm text-headline-sm text-primary">Current assets</h3>
        <div class="space-y-3">
          ${state.bootstrap.content
            .map(
              (item) => `
                <div class="border border-outline-variant/20 rounded-xl p-4 bg-surface-container-low/60">
                  <div class="flex items-center justify-between gap-4">
                    <div class="text-on-surface">${escapeHtml(item.title)}</div>
                    <span class="px-3 py-1 rounded-full text-xs border ${badgeClass(item.status)}">${escapeHtml(item.status)}</span>
                  </div>
                  <div class="text-sm text-on-surface-variant mt-2">${escapeHtml(item.type)} - ${escapeHtml(item.channel)}</div>
                  <p class="text-on-surface-variant mt-3">${escapeHtml(item.summary)}</p>
                </div>`,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function analyticsView() {
  const analytics = state.bootstrap.analytics;
  const maxWeekly = Math.max(...analytics.weekly_performance.map((item) => item.value));
  const maxChannels = Math.max(...analytics.channel_breakdown.map((item) => item.value));
  return `
    <section class="grid xl:grid-cols-2 gap-gutter mb-stack-lg">
      <div class="glass-card rounded-xl p-6 space-y-4">
        <div class="font-label-caps text-label-caps text-on-surface-variant">Weekly performance</div>
        <h3 class="font-headline-sm text-headline-sm text-primary">Engagement trend</h3>
        ${analytics.weekly_performance
          .map(
            (item) => `
              <div class="grid grid-cols-[72px_1fr_48px] gap-3 items-center">
                <div class="text-sm text-on-surface-variant">${escapeHtml(item.label)}</div>
                <div class="h-3 bg-surface-container-high rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style="width:${Math.max(10, Math.round((item.value / maxWeekly) * 100))}%"></div>
                </div>
                <div class="text-right text-sm">${escapeHtml(item.value)}%</div>
              </div>`,
          )
          .join("")}
      </div>
      <div class="glass-card rounded-xl p-6 space-y-4">
        <div class="font-label-caps text-label-caps text-on-surface-variant">Channel breakdown</div>
        <h3 class="font-headline-sm text-headline-sm text-primary">Traffic mix</h3>
        ${analytics.channel_breakdown
          .map(
            (item) => `
              <div class="grid grid-cols-[72px_1fr_48px] gap-3 items-center">
                <div class="text-sm text-on-surface-variant">${escapeHtml(item.label)}</div>
                <div class="h-3 bg-surface-container-high rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style="width:${Math.max(10, Math.round((item.value / maxChannels) * 100))}%"></div>
                </div>
                <div class="text-right text-sm">${escapeHtml(item.value)}%</div>
              </div>`,
          )
          .join("")}
        <div class="pt-4 flex flex-wrap gap-3">
          <span class="px-3 py-1 rounded-full border border-outline-variant/30 text-xs">Top campaign: ${escapeHtml(state.bootstrap.overview.top_campaign)}</span>
          <span class="px-3 py-1 rounded-full border border-outline-variant/30 text-xs">Health: ${escapeHtml(state.bootstrap.overview.agent_health)}</span>
        </div>
      </div>
    </section>
  `;
}

function integrationsView() {
  return `
    <section class="grid md:grid-cols-2 xl:grid-cols-3 gap-gutter mb-stack-lg">
      ${state.bootstrap.integrations
        .map(
          (item) => `
            <div class="glass-card rounded-xl p-6 space-y-4">
              <div class="flex items-start justify-between">
                <div>
                  <div class="font-label-caps text-label-caps text-on-surface-variant">${escapeHtml(item.key)}</div>
                  <h3 class="font-headline-sm text-headline-sm text-primary">${escapeHtml(item.name)}</h3>
                </div>
                <span class="px-3 py-1 rounded-full text-xs border ${badgeClass(item.status)}">${escapeHtml(item.status)}</span>
              </div>
              <p class="text-on-surface-variant">${escapeHtml(item.description)}</p>
              <button class="border border-outline-variant/30 rounded-full px-4 py-2 text-sm hover:border-secondary hover:text-secondary transition-colors" data-toggle-integration="${escapeHtml(item.key)}">Refresh sync</button>
            </div>`,
        )
        .join("")}
    </section>
  `;
}

function settingsView() {
  const s = state.bootstrap.settings;
  return `
    <section class="glass-card rounded-xl p-6 mb-stack-lg">
      <div class="font-label-caps text-label-caps text-on-surface-variant">Workspace settings</div>
      <h3 class="font-headline-sm text-headline-sm text-primary mb-4">Brand voice and cadence</h3>
      <form id="settingsForm" class="grid lg:grid-cols-2 gap-4">
        <textarea class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 min-h-[140px]" name="brand_voice">${escapeHtml(s.brand_voice)}</textarea>
        <textarea class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 min-h-[140px]" name="primary_goal">${escapeHtml(s.primary_goal)}</textarea>
        <input class="w-full bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-3" name="timezone" value="${escapeHtml(s.timezone)}" />
        <input class="w-full bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-3" name="publish_cadence" value="${escapeHtml(s.publish_cadence)}" />
        <button class="bg-gradient-to-r from-primary to-secondary text-on-primary rounded-full px-5 py-3 font-button lg:col-span-2" type="submit">Save Settings</button>
      </form>
    </section>
  `;
}

function renderView() {
  switch (state.activeView) {
    case "calendar":
      return calendarView();
    case "agents":
      return agentsView();
    case "content":
      return contentView();
    case "analytics":
      return analyticsView();
    case "integrations":
      return integrationsView();
    case "settings":
      return settingsView();
    default:
      return dashboardView();
  }
}

function bindInteractions() {
  document.querySelectorAll("[data-view]").forEach((node) => {
    node.addEventListener("click", () => setView(node.dataset.view));
  });

  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) refreshBtn.addEventListener("click", refreshBootstrap);

  const launchQuick = document.getElementById("launchQuick");
  if (launchQuick) launchQuick.addEventListener("click", () => setView("dashboard"));

  const launchSidebar = document.getElementById("launchSidebar");
  if (launchSidebar) {
    launchSidebar.addEventListener("click", () => {
      setView("dashboard");
      document.getElementById("launchForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  const launchHero = document.getElementById("launchHero");
  if (launchHero) {
    launchHero.addEventListener("click", () => {
      document.getElementById("launchForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  const launchForm = document.getElementById("launchForm");
  if (launchForm) {
    launchForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(launchForm);
      await request("/api/launch", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      await refreshBootstrap();
      setView("dashboard");
    });
  }

  const contentForm = document.getElementById("contentForm");
  if (contentForm) {
    contentForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(contentForm);
      await request("/api/content", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      await refreshBootstrap();
      setView("content");
    });
  }

  const settingsForm = document.getElementById("settingsForm");
  if (settingsForm) {
    settingsForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(settingsForm);
      await request("/api/settings", {
        method: "PUT",
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      await refreshBootstrap();
      setView("settings");
    });
  }

  document.querySelectorAll("[data-run-agent]").forEach((node) => {
    node.addEventListener("click", async () => {
      await request(`/api/agents/${node.dataset.runAgent}/run`, { method: "POST", body: "{}" });
      await refreshBootstrap();
      setView("agents");
    });
  });

  document.querySelectorAll("[data-toggle-integration]").forEach((node) => {
    node.addEventListener("click", async () => {
      await request(`/api/integrations/${node.dataset.toggleIntegration}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "Connected" }),
      });
      await refreshBootstrap();
      setView("integrations");
    });
  });

  document.querySelectorAll("a, button, .tilt-card, .glass-card").forEach((node) => {
    node.addEventListener("mouseenter", () => {
      if (cursorRing) cursorRing.style.borderColor = "#b8d0ff";
      if (cursor) cursor.style.backgroundColor = "#4ddcc6";
    });
    node.addEventListener("mouseleave", () => {
      if (cursorRing) cursorRing.style.borderColor = "var(--secondary)";
      if (cursor) cursor.style.backgroundColor = "var(--primary)";
    });
  });

  document.querySelectorAll(".tilt-card, .glass-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });

  document.addEventListener("mousedown", () => {
    if (cursor) cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
    if (cursorRing) cursorRing.style.transform = "translate(-50%, -50%) scale(1.2)";
    if (cursorRing) cursorRing.style.borderColor = "#aac7ff";
  });

  document.addEventListener("mouseup", () => {
    if (cursor) cursor.style.transform = "translate(-50%, -50%) scale(1)";
    if (cursorRing) cursorRing.style.transform = "translate(-50%, -50%) scale(1)";
    if (cursorRing) cursorRing.style.borderColor = "var(--secondary)";
  });
}

async function refreshBootstrap() {
  state.bootstrap = await request("/api/bootstrap");
  render();
}

function render() {
  if (!state.bootstrap) return;
  app.innerHTML = shell();
  bindInteractions();
}

function bindCursor() {
  if (!cursor || !cursorRing) return;
  document.addEventListener("pointermove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursorRing.style.left = `${event.clientX - 12}px`;
    cursorRing.style.top = `${event.clientY - 12}px`;
    cursor.style.transform = "translate(-50%, -50%)";
    cursorRing.style.transform = "translate(-50%, -50%)";
  });
}

async function boot() {
  bindCursor();
  try {
    state.bootstrap = await request("/api/bootstrap");
    render();
  } catch (error) {
    app.innerHTML = `
      <div class="min-h-screen grid place-items-center p-8 text-center">
        <div class="glass-card rounded-xl p-8 max-w-lg">
          <div class="font-label-caps text-label-caps text-on-surface-variant">AI Marketing Automation</div>
          <h1 class="font-headline-sm text-headline-sm text-primary mt-3">Backend unavailable</h1>
          <p class="text-on-surface-variant mt-4">${escapeHtml(error.message)}</p>
        </div>
      </div>
    `;
  }
}

boot();
