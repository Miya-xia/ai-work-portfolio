'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const repo = 'https://github.com/Miya-xia/ai-work-portfolio';
  const link = (href, label) => `<a class="source-link" href="${href}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
  const chapters = [
    { id: 'profile', title: '认识一下我', en: 'ABOUT ME', note: '品牌与内容运营视角，以及我与 AI 的分工。' },
    { id: 'website', title: '案例一 / 交互网站', en: 'CASE 01 / INTERACTIVE WEBSITE', note: '从材料与需求，到可以操作、测试和交付的网站。' },
    { id: 'process', title: '需求与迭代', en: 'PROCESS / ITERATIONS', note: '看到问题、具体描述、检查修改后的结果。' },
    { id: 'content', title: '内容展示练习', en: 'SUPPORTING STUDY / CONTENT', note: '用虚构内容演示列表、详情、切换与证据分层。' },
    { id: 'agent', title: '案例二 / 人工审核工作流', en: 'CASE 02 / HUMAN REVIEW', note: '固定示例说明风险分级与人工把关，不冒充实时 AI。' },
    { id: 'method', title: '我的 AI 工作方法', en: 'METHOD / HUMAN + AI', note: '拆解、迭代、验证、留存，四个习惯。' },
    { id: 'evidence', title: '项目证据与边界', en: 'EVIDENCE / HONEST SCOPE', note: '把已实现、团队协作和仍需验证的部分分开说。' }
  ];
  const dialog = $('#chapter-dialog');
  const content = $('#chapter-content');
  let current = null, returnFocus = null, compare = 'after', post = 0, scenario = 1, step = 0;
  let storageOK = true, draft = {};
  const storageKey = 'miya-public-portfolio-demo-v1';
  try { draft = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { storageOK = false; }
  const heading = (id, summary = '') => {
    const chapter = chapters.find(item => item.id === id);
    return `<div class="chapter-heading"><div><div class="eyebrow">${chapter?.en || 'THE CONTENTS'}</div><h2 id="chapter-title" class="sr-only">${chapter?.title || '作品目录'}</h2>${summary ? `<p>${summary}</p>` : ''}</div><span class="public-chip">公开脱敏版</span></div>`;
  };
  const card = (number, title, text, cls = '') => `<article class="portfolio-card ${cls}"><small>${number}</small><h3>${title}</h3><p>${text}</p></article>`;
  function renderDirectory() {
    return heading('directory', '两件核心作品，和它们背后的协作、练习与证据。') + `<div class="directory-grid">${chapters.map((item, index) => `<button class="directory-card" data-chapter="${item.id}"><span class="num">0${index + 1} / ${item.en}</span><span class="dir-arrow">↗</span><h3>${item.title}</h3><small>${item.note}</small></button>`).join('')}</div>`;
  }
  function renderProfile() {
    return heading('profile', '夏明也 / 品牌与内容运营 · AI 辅助工作实践') + `<div class="public-profile"><div class="profile-pass"><div class="profile-initial">m.</div><h3>夏明也</h3><p>CURIOUS BY NATURE.<br>把问题讲清楚，把结果做出来。</p></div><div class="profile-story"><h3>从业务问题出发，<br>与 AI 一起把想法落地。</h3><p>我的工作视角来自品牌研究、社媒内容与跨团队协作。我希望把 AI 用在明确的问题上：组织材料、表达想法、制作可操作的原型，并检查它是否真的符合需求。</p><p>这个作品集也来自一次真实的协作过程：我提出内容与视觉要求，逐轮检查页面、纠正理解偏差，再由 AI 辅助完成代码实现与技术检查。</p><div class="role-split"><section><small>MY ROLE / 我负责</small><p>业务问题、需求与内容判断；视觉反馈；人工审核和最终验收。</p></section><section><small>AI ASSISTANCE / AI 辅助</small><p>代码与样式实现、迭代修改、测试脚本与部署操作。不能替代业务判断。</p></section></div><p class="boundary-note">这份作品证明我具备 AI 协作与业务转译能力，不将 AI 辅助代码表述为独立完成的全栈工程能力。</p></div></div>`;
  }
  function renderWebsite() {
    return heading('website', '把线性汇报材料改造成可点击、可跳转、可离线交付的交互体验。当前公开版已替换全部公司资料。') + `<div class="case-lead"><div><span class="case-number">CASE 01</span><h3>一只柜子，<br>把材料变成可探索的故事。</h3><p>起点是一份已有框架的汇报材料。我的目标是让过程与成果更直观，同时保留讲述顺序，避免页面只有装饰、没有证据。</p><button class="pill-button" data-action="home">回到首页，操作柜子 ↗</button></div><img src="assets/study-board.svg" alt="原创的需求拆解、迭代、验证设计卡"></div><div class="portfolio-grid three">${card('01 / DEFINE','把模糊要求讲具体','用截图指明要删什么、保留什么；明确原文不能擅改、章节如何组织、互动如何触发。')}${card('02 / BUILD','让故事可以操作','开场可跳过与重播；七个物件对应章节；目录和键盘导航可用，手机布局可浏览。')}${card('03 / CHECK','从“看起来完成”到可检查','检查点击、内容对应关系、窄屏溢出和本地编辑；保留测试脚本和公开代码。')}</div><div class="evidence-strip"><span>已实现，可现场验证</span><b>7 个物件入口</b><b>开场跳过 / 重播</b><b>键盘导航</b><b>本地编辑与导出</b></div><div class="role-split"><section><small>个人贡献</small><p>提出需求、组织内容、给出视觉与交互反馈、发现偏差并验收。通过多轮协作把汇报从材料变成可操作体验。</p></section><section><small>实现方式与边界</small><p>HTML / CSS / JavaScript，AI 辅助实现。这里是静态网站，没有登录后台，也没有调用实时语言模型。</p></section></div>${link(repo + '/blob/main/docs/case-studies.md','阅读完整案例说明')}`;
  }
  const comparisons = {
    before: `<div class="iteration-preview preview-before"><small>BEFORE / 早期方案的示意重构</small><h3>让每一步自动播放</h3><div class="auto-preview"><span>收到消息</span><span>判断风险</span><span>准备回复</span></div><p>讲述节奏被自动播放占据；需要临时解释某一步时，不容易停在对应内容。</p></div>`,
    after: `<div class="iteration-preview preview-after"><small>AFTER / 现在可以操作的方式</small><h3>把控制权交回讲述者</h3><div class="manual-preview"><button data-demo-step="0">01 接收</button><button data-demo-step="1">02 判断</button><button data-demo-step="2">03 分级</button><button data-demo-step="3">04 草稿</button><button data-demo-step="4">05 审核</button></div><p>点任何一步都能进入对应演示。风险与草稿标明是固定示例，演示不会发送任何消息。</p></div>`
  };
  function renderProcess() {
    return heading('process', '不是一次提示就结束：让需求变成具体修改，再回到页面核对。以下为去除业务信息后的过程摘要。') + `<div class="iteration-layout"><div><div class="tab-bar" role="tablist" aria-label="迭代前后"><button class="tab" role="tab" id="comparison-before" aria-controls="comparison-panel" aria-selected="${compare === 'before'}" tabindex="${compare === 'before' ? 0 : -1}" data-compare="before">早期思路</button><button class="tab" role="tab" id="comparison-after" aria-controls="comparison-panel" aria-selected="${compare === 'after'}" tabindex="${compare === 'after' ? 0 : -1}" data-compare="after">迭代后的方式</button></div><section role="tabpanel" id="comparison-panel" aria-labelledby="comparison-${compare}">${comparisons[compare]}</section><p class="boundary-note">此对比用公开页面重新表达设计决策，不是公司原始页面截图。</p></div><aside class="annotation-note"><small>WHY THIS CHANGED</small><h3>反馈要能被执行。</h3><p>“再有趣一点”很难验收。<br>“去掉自动播放，改为点步骤展示，并保留人工检查入口”才是可验证的要求。</p></aside></div><div class="portfolio-grid three">${card('FEEDBACK 01','保护原文','指定哪些内容必须保持不变，只允许在原文后补充；避免 AI 用润色代替用户真实表达。')}${card('FEEDBACK 02','去掉重复信息','通过截图圈定重复标题和字段，删去不增加信息量的内容，再调大主体比例。')}${card('FEEDBACK 03','交付适合使用场景','现场演示、本地离线文件与公开作品集是不同交付。公开版单独脱敏，不靠“隐藏入口”保护数据。')}</div>${link(repo + '/blob/main/docs/decision-log.md','查看设计决策记录')}`;
  }
  const samplePosts = [
    { date: 'DEMO / 01', format: '图文练习', title: '把一个小想法，讲成一个完整主题。', lines: '①用一个明确的问题开场\n②让视觉和文案围绕同一主题\n③用结尾引导读者参与', type: '主题表达', goal: '内容结构与叙事一致性', image: 'sample-cover.svg' },
    { date: 'DEMO / 02', format: '知识卡片', title: '把复杂信息，拆成可以扫读的步骤。', lines: '①先明确读者需要做什么\n②每张卡片只保留一个重点\n③给出可执行的结尾', type: '内容教育', goal: '信息层级与阅读效率', image: 'study-board.svg' },
    { date: 'DEMO / 03', format: '互动练习', title: '给评论区一个容易回答的问题。', lines: '①从具体场景切入\n②提供两种可讨论的选择\n③记录反馈，再调整表达', type: '互动选题', goal: '问题设计与反馈收集', image: 'sample-cover.svg' }
  ];
  function postView() {
    const item = samplePosts[post];
    return `<div class="study-post"><img src="assets/${item.image}" alt="原创几何图形，虚构内容练习配图"><div><div class="eyebrow">${item.date} / ${item.format}</div><h3>${item.title}</h3><p class="study-lines">${item.lines}</p><dl class="study-meta"><dt>内容类型</dt><dd>${item.type}</dd><dt>练习目标</dt><dd>${item.goal}</dd></dl></div></div>`;
  }
  function renderContent() {
    return heading('content', '这一节是为公开作品集编写的独立练习，用于说明“封面 → 选题 → 目标”的展示方式。不是历史排期、真实品牌方案或运营业绩。') + `<div class="content-samples" aria-label="选择虚构内容样例">${samplePosts.map((item, index) => `<button data-post="${index}" aria-pressed="${post === index}" class="sample-selector ${post === index ? 'selected' : ''}"><small>0${index + 1}</small><span>${item.type}</span></button>`).join('')}</div><div id="post-slot">${postView()}</div><div class="post-controls"><button class="pill-button" data-post-prev>← 上一个</button><span id="post-count">${post + 1} / ${samplePosts.length} · 虚构练习</span><button class="pill-button" data-post-next>下一个 →</button></div><p class="boundary-note">不展示公司品牌名、原始素材、内部文件链接、真实客户消息或未经核实的触达与增长数据。</p>`;
  }
  const scenarios = window.PORTFOLIO_SCENARIOS;
  const steps = ['接收消息', '理解情绪', '风险分级', '准备草稿', '人工审核'];
  function agentPanel() {
    const item = scenarios[scenario];
    const panels = [
      `<h3>先看上下文，而不只看最后一条消息。</h3><div class="message-stack">${item.messages.map(([time, message]) => `<div class="workflow-message"><time>${time}</time><p>${esc(message)}</p></div>`).join('')}</div>`,
      `<h3>频率、语气、表情，综合观察。</h3><div class="emotion-signals">${['频率与上下文','文字表达','表情线索'].map((label, index) => `<div><small>${label}</small><p>${esc(item.signals[index])}</p></div>`).join('')}</div><div class="workflow-callout"><b>预设的演示判断</b><p>${esc(item.emotion)}</p></div>`,
      `<h3>业务诉求与安全信号，比情绪标签更重要。</h3><div class="risk-lanes">${scenarios.map((lane, index) => `<div class="risk-lane ${lane.id} ${index === scenario ? 'chosen' : ''}"><strong>${lane.risk}</strong><p>${lane.name}</p></div>`).join('')}</div><p class="workflow-callout">${esc(item.decision)}</p>`,
      `<h3>草稿不是已发送的回复。</h3><blockquote class="workflow-reply">${esc(draft[item.id + '-reply'] ?? item.reply)}</blockquote><p class="workflow-callout">审核重点：${esc(item.checks)}</p>`,
      `<h3>中高风险，先交给人检查。</h3><p>检查事实、语气和升级路径。下方可以编辑两个虚构案例，再导出一个可继续修改的 HTML。</p><button class="pill-button" data-export-review>导出当前审核 HTML ↓</button>`
    ];
    return `<section class="agent-step-panel" role="tabpanel" id="agent-step-panel" aria-labelledby="step-${step}" tabindex="0">${panels[step]}<p class="workflow-footnote">固定虚构示例；标签为预设，不是模型实时推理或生产阈值。</p></section>`;
  }
  function reviewCards() {
    return `<section class="public-review" aria-labelledby="review-title"><div class="review-board-heading"><div><div class="eyebrow">HUMAN IN THE LOOP</div><h3 id="review-title">试着修改一条草稿。</h3><p>只输入虚构信息。草稿仅尝试保存在当前浏览器，不上传，不发送。</p></div><button class="pill-button" data-export-review>导出审核 HTML ↓</button></div><div class="review-cards">${scenarios.filter(item => item.id !== 'low').map(item => `<article class="review-card ${item.id}"><span class="risk-badge ${item.id}">${item.risk} / 虚构示例</span><h4>${item.name}</h4><p>${esc(item.checks)}</p><label class="draft-field"><span>可编辑回复 / 未审核</span><textarea data-draft="${item.id}-reply" rows="7" spellcheck="false">${esc(draft[item.id + '-reply'] ?? item.reply)}</textarea></label><label class="draft-field"><span>审核备注</span><textarea data-draft="${item.id}-note" rows="2" placeholder="只填写虚构演示信息">${esc(draft[item.id + '-note'] ?? '')}</textarea></label></article>`).join('')}</div><div class="demo-actions"><button class="text-button" data-clear-draft>清除本机演示草稿 ↺</button><span id="save-status" role="status">${storageOK ? '仅本地保存。换设备前可导出 HTML。' : '本地存储不可用，请导出 HTML 保存。'}</span></div></section>`;
  }
  function renderAgent() {
    return heading('agent', '将业务规则转译为可检查的协作流程。本人侧重业务场景梳理、风险与话术要求、人工审核；工程与模型相关工作不计为个人独立成果。') + `<div class="agent-scope"><strong>这是工作流演示，不是上线中的 Agent。</strong><p>对话、时间、标签和回复均为重新编写的虚构数据。没有模型接口、客户账号或消息发送能力，也没有声称实际节时、准确率或生产验收结果。</p></div><div class="agent-demo"><div class="demo-top"><span>CASE 02 / REPLY LAB</span><span>FIXED EXAMPLES · NO LIVE AI</span></div><div class="demo-content"><div class="demo-scenarios" aria-label="选择虚构风险案例">${scenarios.map((item, index) => `<button data-scenario="${index}" aria-pressed="${scenario === index}" class="${scenario === index ? 'selected' : ''}">${item.risk} / ${item.name}</button>`).join('')}</div><p class="step-instruction">先选一个示例，再点击下方步骤；按自己的节奏查看。</p><div class="agent-step-tabs" role="tablist" aria-label="工作流步骤">${steps.map((title, index) => `<button id="step-${index}" data-step="${index}" role="tab" aria-controls="agent-step-panel" aria-selected="${step === index}" tabindex="${step === index ? 0 : -1}"><small>0${index + 1}</small>${title}</button>`).join('')}</div><div id="agent-panel-slot">${agentPanel()}</div></div></div>${reviewCards()}`;
  }
  function renderMethod() {
    return heading('method', '对我来说，会用 AI 不是只会输入一句要求，而是知道该交给它什么、该由人检查什么。') + `<div class="portfolio-grid two">${card('01 / BRIEF','先界定问题与边界','写清受众、使用场景、必须保留的内容、不能编造的信息和可接受的交付形式。')}${card('02 / ITERATE','把反馈变成具体动作','用页面位置、截图和原句描述问题。一次修改聚焦一组要求，完成后回到实际页面核对。')}${card('03 / VERIFY','按风险决定验证强度','检查引用和数字，区分个人贡献与团队成果；对交互、窄屏和导出文件做技术验证。')}${card('04 / REUSE','保留可以复用的成果','把代码、需求摘要、决策和检查项一起留存。下一次复用方法，而不是照搬不适合公开的数据。')}</div><div class="method-note"><span aria-hidden="true">✳</span><p>AI 可以加快实现，但表达是否准确、公开是否合适、结果是否可用，仍然要由人判断。</p></div>`;
  }
  function renderEvidence() {
    return heading('evidence', '面试时可以直接操作网站，也可以查看源码、决策记录和测试。这里把“有作品”与“有业务成效”分开。') + `<div class="portfolio-grid three">${card('CHECK 01','现在可以验证的','柜子入口、章节切换、键盘导航、固定案例点选、草稿本地保存和审核 HTML 导出。')}${card('CHECK 02','需要准确归属的','需求、内容判断与人工审核是本人业务贡献；代码与测试由 AI 辅助实现，不把团队工程成果算成个人独立产出。')}${card('CHECK 03','当前不能据此声称的','没有真实客户测试、模型推理、自动发送、生产准确率或节时统计；虚构样例不能证明运营增长。')}</div><div class="evidence-links">${link(repo,'项目仓库与源码')}${link(repo + '/blob/main/docs/case-studies.md','两个案例的过程与贡献')}${link(repo + '/blob/main/docs/decision-log.md','设计与公开边界记录')}${link(repo + '/blob/main/tests/public.test.cjs','可运行的公开检查项')}${link(repo + '/actions','部署与检查记录')}</div><div class="privacy-card"><h3>公开不等于公开原始工作材料。</h3><p>当前站点不包含原述职文件、公司品牌资料、内部链接、研究数据或客户记录。插图为本项目的原创几何练习；模拟消息明确标注为虚构。</p><p>页面未接入项目自建的统计、广告或模型服务。草稿尝试保存在访问者自己的浏览器中；GitHub 作为托管方仍可能按其政策处理访问日志。不要在演示输入框里填写真实客户或敏感信息。</p></div>`;
  }
  const renderers = { directory: renderDirectory, profile: renderProfile, website: renderWebsite, process: renderProcess, content: renderContent, agent: renderAgent, method: renderMethod, evidence: renderEvidence };
  function openChapter(id, updateHash = true) {
    if (!renderers[id]) return;
    if (!dialog.open) returnFocus = document.activeElement;
    current = id;
    content.innerHTML = renderers[id]();
    content.scrollTop = 0;
    const index = chapters.findIndex(item => item.id === id);
    $('#breadcrumb').textContent = chapters[index]?.en || 'THE CONTENTS';
    $('#chapter-count').textContent = index >= 0 ? `${String(index + 1).padStart(2,'0')} / ${String(chapters.length).padStart(2,'0')}` : 'PUBLIC PORTFOLIO';
    $('#prev-chapter').disabled = index <= 0;
    $('#next-chapter').textContent = index === chapters.length - 1 ? '回到作品柜 →' : '下一章 →';
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    $('#close-chapter').focus({ preventScroll: true });
    if (updateHash) history.replaceState(null, '', '#' + id);
  }
  function closeChapter() {
    dialog.close();
    document.body.style.overflow = '';
    history.replaceState(null, '', location.pathname + location.search);
    current = null;
    returnFocus?.focus?.({ preventScroll: true });
  }
  function toast(message) {
    $('#toast').textContent = message;
    $('#toast').classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => $('#toast').classList.remove('show'), 2800);
  }
  function updatePost(index) {
    post = (index + samplePosts.length) % samplePosts.length;
    $('#post-slot').innerHTML = postView();
    $('#post-count').textContent = `${post + 1} / ${samplePosts.length} · 虚构练习`;
    $$('[data-post]', content).forEach(button => { const selected = Number(button.dataset.post) === post; button.setAttribute('aria-pressed', String(selected)); button.classList.toggle('selected', selected); });
  }
  function saveDraft(input) {
    draft[input.dataset.draft] = input.value;
    try { localStorage.setItem(storageKey, JSON.stringify(draft)); } catch { storageOK = false; }
    if ($('#save-status')) $('#save-status').textContent = storageOK ? '演示草稿已保存在本机浏览器，未上传。' : '本地存储不可用，请导出 HTML 保存。';
  }
  // Self-contained export. Text is escaped before insertion; edited data never becomes code.
  function exportedEditor() {
    document.getElementById('download').addEventListener('click', () => {
      const copy = document.documentElement.cloneNode(true);
      const fields = [...document.querySelectorAll('textarea')];
      [...copy.querySelectorAll('textarea')].forEach((input, index) => { input.textContent = fields[index].value; });
      const url = URL.createObjectURL(new Blob(['<!doctype html>\n' + copy.outerHTML], { type:'text/html;charset=utf-8' }));
      const a = document.createElement('a'); a.href = url; a.download = 'demo-review-edited.html'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    });
  }
  function exportReview() {
    const cases = scenarios.filter(item => item.id !== 'low');
    const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>虚构案例 / 人工审核演示</title><style>body{font-family:system-ui,sans-serif;background:#f4f2ea;color:#304437;max-width:900px;margin:auto;padding:25px}h1{font-size:27px}p{line-height:1.9}section{padding:24px;margin:20px 0;background:#fffef8;border:1px solid #c9d3c4;border-radius:15px}label{display:block;margin:18px 0 8px}textarea{box-sizing:border-box;width:100%;min-height:160px;border:1px solid #a7b7a1;border-radius:8px;font:14px/1.8 system-ui;padding:12px}textarea.notes{min-height:85px}button{padding:12px 20px;background:#405c48;color:white;border:0;border-radius:25px;cursor:pointer}blockquote{margin:0;padding:14px;background:#edf0e6;line-height:1.9}small{color:#7e8977}@media print{button{display:none}}</style></head><body><h1>人工审核 / 固定虚构案例</h1><p>没有真实客户信息，没有模型调用，不上传、不发送。可修改以下草稿，再下载保留修改的 HTML。</p><button id="download">下载修改后的 HTML ↓</button>${cases.map(item => `<section><small>${item.risk} · 演示，不是生产判断</small><h2>${item.name}</h2><blockquote>${item.messages.map(([, message]) => esc(message)).join('<br>')}</blockquote><p>审核重点：${esc(item.checks)}</p><label>回复草稿<textarea>${esc(draft[item.id + '-reply'] ?? item.reply)}</textarea></label><label>审核备注<textarea class="notes">${esc(draft[item.id + '-note'] ?? '')}</textarea></label></section>`).join('')}<script>(${exportedEditor.toString()})();<\/script></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type:'text/html;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'demo-human-review.html'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast('已导出演示 HTML，可离线继续修改；未发送消息。');
  }
  document.addEventListener('click', event => {
    const el = event.target.closest('button,a');
    if (!el) return;
    if (el.dataset.chapter) return openChapter(el.dataset.chapter);
    if (el.dataset.action === 'directory') return openChapter('directory');
    if (el.dataset.action === 'home' || el.matches('.wordmark')) { event.preventDefault(); closeChapter(); return; }
    if (el.dataset.compare) { compare = el.dataset.compare; openChapter('process'); $(`[data-compare="${compare}"]`)?.focus({ preventScroll:true }); }
    if (el.dataset.post !== undefined) updatePost(Number(el.dataset.post));
    if (el.hasAttribute('data-post-prev')) updatePost(post - 1);
    if (el.hasAttribute('data-post-next')) updatePost(post + 1);
    if (el.dataset.scenario !== undefined) {
      scenario = Number(el.dataset.scenario);
      $$('[data-scenario]').forEach((button, index) => { button.classList.toggle('selected', index === scenario); button.setAttribute('aria-pressed', String(index === scenario)); });
      $('#agent-panel-slot').innerHTML = agentPanel();
    }
    if (el.dataset.step !== undefined) {
      step = Number(el.dataset.step);
      $$('[data-step]').forEach((button, index) => { button.setAttribute('aria-selected', String(index === step)); button.tabIndex = index === step ? 0 : -1; });
      $('#agent-panel-slot').innerHTML = agentPanel();
    }
    if (el.dataset.demoStep !== undefined) { step = Number(el.dataset.demoStep); openChapter('agent'); }
    if (el.hasAttribute('data-export-review')) exportReview();
    if (el.hasAttribute('data-clear-draft')) {
      draft = {};
      try { localStorage.removeItem(storageKey); } catch { storageOK = false; }
      openChapter('agent'); toast('已清除本机演示草稿，恢复虚构示例。');
    }
  });
  document.addEventListener('input', event => { if (event.target.matches('[data-draft]')) saveDraft(event.target); });
  $('#start').addEventListener('click', () => openChapter('website'));
  $('#close-chapter').addEventListener('click', closeChapter);
  $('#close-icon').addEventListener('click', closeChapter);
  $('#prev-chapter').addEventListener('click', () => { const index = chapters.findIndex(item => item.id === current); if (index > 0) openChapter(chapters[index - 1].id); });
  $('#next-chapter').addEventListener('click', () => { const index = chapters.findIndex(item => item.id === current); if (index === chapters.length - 1) closeChapter(); else openChapter(chapters[Math.max(0, index + 1)].id); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeChapter(); });
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeChapter(); });
  document.addEventListener('keydown', event => {
    if (!dialog.open || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    const tablist = event.target.closest('[role="tablist"]');
    if (tablist && ['ArrowLeft','ArrowRight'].includes(event.key)) {
      event.preventDefault();
      const tabs = $$('[role="tab"]', tablist), index = tabs.indexOf(event.target);
      const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      const label = tablist.getAttribute('aria-label');
      tabs[next].click();
      const active = $$('[role="tablist"]').find(list => list.getAttribute('aria-label') === label);
      if (active) $$('[role="tab"]', active)[next]?.focus({ preventScroll:true });
      return;
    }
    if (['ArrowRight','PageDown'].includes(event.key)) { event.preventDefault(); $('#next-chapter').click(); }
    if (['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); $('#prev-chapter').click(); }
  });
  function setClosed(closed) {
    $('#locker').classList.toggle('closed', closed);
    $('#door-toggle').setAttribute('aria-expanded', String(!closed));
    $('#door-toggle').textContent = closed ? '打开柜门 ↗' : '合上柜门 ↗';
    $$('.locker-inner button').forEach(button => { button.inert = closed; });
  }
  $('#door-toggle').addEventListener('click', () => setClosed(!$('#locker').classList.contains('closed')));
  $('#explore').addEventListener('click', () => { setClosed(false); $('.research-object').focus({ preventScroll:true }); if (innerWidth < 900) $('.locker-area').scrollIntoView({ block:'center', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });
  let opening = false;
  const timers = [];
  function finishOpening() {
    timers.splice(0).forEach(clearTimeout);
    const moveFocus = document.activeElement === $('#opening-skip');
    opening = false;
    $('#opening-screen').hidden = true; $('#opening-skip').hidden = true;
    document.body.classList.remove('opening-playing','opening-fade','opening-revealed');
    $$('.site-header,main.home,.site-footer').forEach(region => { region.inert = false; });
    setClosed(false);
    if (moveFocus) $('#start').focus({ preventScroll:true });
  }
  function playOpening() {
    if (opening) finishOpening();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return finishOpening();
    opening = true; setClosed(true);
    $('#opening-screen').hidden = false; $('#opening-skip').hidden = false;
    document.body.classList.add('opening-playing');
    $$('.site-header,main.home,.site-footer').forEach(region => { region.inert = true; });
    $('#opening-skip').focus({ preventScroll:true });
    timers.push(setTimeout(() => document.body.classList.add('opening-fade'),850));
    timers.push(setTimeout(() => { $('#opening-screen').hidden = true; },1250));
    timers.push(setTimeout(() => { setClosed(false); document.body.classList.add('opening-revealed'); },1400));
    timers.push(setTimeout(finishOpening,2700));
  }
  $('#opening-skip').addEventListener('click', finishOpening);
  $('#replay-opening').addEventListener('click', playOpening);
  document.addEventListener('keydown', event => { if (opening && event.key === 'Escape') finishOpening(); });
  window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (opening) finishOpening(); if (renderers[id]) openChapter(id,false); else closeChapter(); });
  const initial = location.hash.slice(1);
  if (renderers[initial]) openChapter(initial,false); else playOpening();
})();
