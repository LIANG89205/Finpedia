(function () {
  "use strict";

  const data = window.FIN_DATA;
  const app = document.getElementById("app");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const menuButton = document.getElementById("menuButton");
  const globalSearch = document.getElementById("globalSearch");
  const searchResults = document.getElementById("searchResults");
  const commandBackdrop = document.getElementById("commandBackdrop");
  const commandSearch = document.getElementById("commandSearch");
  const commandResults = document.getElementById("commandResults");
  const termMap = new Map();
  const categoryMap = new Map();
  const groupMap = new Map();
  let commandSelection = 0;
  let marketLab = null;

  const domainLabels = {
    products: "金融产品",
    derivatives: "衍生品",
    analysis: "分析方法",
    economy: "宏观经济",
    markets: "市场体系",
    institutions: "机构与监管",
    portfolio: "组合与风控",
    quant: "量化与数学",
    strategy: "交易策略",
    personal: "个人与家庭"
  };

  data.categories.forEach((category) => {
    categoryMap.set(category.id, category);
    category.groups.forEach((group) => {
      groupMap.set(group.id, { ...group, category });
      group.items.forEach((term) => {
        const hydrated = { ...term, category, group };
        termMap.set(term.id, hydrated);
      });
    });
  });

  const allTerms = [...termMap.values()];
  const allAliases = allTerms.reduce((count, term) => count + term.aliases.length, 0);

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalize(value) {
    return String(value ?? "")
      .toLowerCase()
      .normalize("NFKC")
      .replace(/[\s·—_\-\/()（）.:%]+/g, "");
  }

  function bigramScore(query, value) {
    if (query.length < 2 || value.length < 2) return 0;
    const grams = new Set();
    for (let i = 0; i < query.length - 1; i += 1) grams.add(query.slice(i, i + 2));
    let hits = 0;
    for (let i = 0; i < value.length - 1; i += 1) if (grams.has(value.slice(i, i + 2))) hits += 1;
    return hits / Math.max(grams.size, value.length - 1);
  }

  function search(query, limit = 10) {
    const q = normalize(query);
    if (!q) return [];
    const expanded = new Set();
    Object.entries(data.searchExpansions || {}).forEach(([key, ids]) => {
      if (normalize(key).includes(q) || q.includes(normalize(key))) ids.forEach((id) => expanded.add(id));
    });

    return allTerms
      .map((term) => {
        const fields = [term.zh, term.en, ...term.aliases, term.category.zh, term.group.zh, term.summary];
        const normalized = fields.map(normalize);
        let score = expanded.has(term.id) ? 88 : 0;
        normalized.forEach((field, index) => {
          if (field === q) score = Math.max(score, 120 - index);
          else if (field.startsWith(q)) score = Math.max(score, 92 - index);
          else if (field.includes(q)) score = Math.max(score, 72 - index);
          else {
            const fuzzy = bigramScore(q, field);
            if (fuzzy >= 0.38) score = Math.max(score, Math.round(fuzzy * 48));
          }
        });
        return { term, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.term.zh.localeCompare(b.term.zh, "zh-CN"))
      .slice(0, limit)
      .map((item) => item.term);
  }

  function resultMarkup(results, query) {
    if (!results.length) {
      return `<div class="empty-search">没有找到“${esc(query)}”<br><small>试试中文名称、英文缩写或相关术语</small></div>`;
    }
    return results.map((term, index) => `
      <a class="search-result${index === commandSelection ? " active" : ""}" href="#/knowledge/${term.id}" role="option" data-result-index="${index}">
        <span class="result-icon">${esc(term.category.symbol)}</span>
        <span><strong>${esc(term.zh)}${term.en && term.en !== term.zh ? ` · ${esc(term.en)}` : ""}</strong><small>${esc(term.category.zh)} › ${esc(term.group.zh)}</small></span>
        <em>查看</em>
      </a>`).join("");
  }

  function bindInlineSearch() {
    document.querySelectorAll("[data-search-term]").forEach((button) => {
      button.addEventListener("click", () => openCommand(button.dataset.searchTerm || ""));
    });
    const heroSearch = document.getElementById("heroSearch");
    const heroSearchButton = document.getElementById("heroSearchButton");
    if (heroSearch) {
      heroSearch.addEventListener("focus", () => openCommand(heroSearch.value));
      heroSearch.addEventListener("input", () => {
        openCommand(heroSearch.value);
        commandSearch.value = heroSearch.value;
        updateCommandResults();
      });
      heroSearch.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const first = search(heroSearch.value, 1)[0];
          if (first) location.hash = `#/knowledge/${first.id}`;
        }
      });
      heroSearchButton?.addEventListener("click", () => openCommand(heroSearch.value));
    }
  }

  function updateHeaderResults() {
    const query = globalSearch.value.trim();
    if (!query) {
      searchResults.hidden = true;
      return;
    }
    commandSelection = -1;
    searchResults.innerHTML = resultMarkup(search(query, 8), query);
    searchResults.hidden = false;
  }

  function openCommand(initial = "") {
    commandBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    commandSearch.value = initial;
    commandSelection = 0;
    updateCommandResults();
    requestAnimationFrame(() => commandSearch.focus());
  }

  function closeCommand() {
    commandBackdrop.hidden = true;
    document.body.style.overflow = "";
  }

  function updateCommandResults() {
    const query = commandSearch.value.trim();
    const results = query ? search(query, 14) : data.featured.map((id) => termMap.get(id)).filter(Boolean);
    commandSelection = Math.min(commandSelection, Math.max(0, results.length - 1));
    commandResults.innerHTML = `
      <div class="sidebar-heading"><span>${query ? "搜索结果" : "常用知识入口"}</span><span>${results.length}</span></div>
      ${resultMarkup(results, query)}
    `;
  }

  function footer() {
    return `<footer class="site-footer"><span>Finpedia · 金融知识只用于教育，不构成投资建议。</span><span>内容版本 ${esc(data.meta.updated)} · ${allTerms.length} 个知识点</span></footer>`;
  }

  function breadcrumb(parts) {
    return `<nav class="breadcrumb" aria-label="面包屑">
      <a href="#/">首页</a>
      ${parts.map((part) => `<i>›</i>${part.href ? `<a href="${part.href}">${esc(part.label)}</a>` : `<span aria-current="page">${esc(part.label)}</span>`}`).join("")}
    </nav>`;
  }

  function renderSidebar() {
    document.getElementById("categoryCount").textContent = data.categories.length;
    document.getElementById("categoryNav").innerHTML = data.categories.map((category) => {
      const count = category.groups.reduce((sum, group) => sum + group.items.length, 0);
      return `<a class="side-link" data-category-id="${category.id}" href="#/category/${category.id}"><span>${esc(category.zh)}</span><span>${count}</span></a>`;
    }).join("");
  }

  function homeMarketLine() {
    return `<svg viewBox="0 0 330 88" preserveAspectRatio="none" aria-label="示意价格曲线">
      <defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27c99a" stop-opacity=".28"/><stop offset="1" stop-color="#27c99a" stop-opacity="0"/></linearGradient></defs>
      <path class="area" d="M0 73 C18 69 26 55 42 60 S68 71 83 48 108 52 124 42 150 52 167 30 193 39 207 24 228 33 244 20 271 33 286 15 311 18 330 5 L330 88 L0 88Z"/>
      <path class="stroke" d="M0 73 C18 69 26 55 42 60 S68 71 83 48 108 52 124 42 150 52 167 30 193 39 207 24 228 33 244 20 271 33 286 15 311 18 330 5"/>
    </svg>`;
  }

  function renderHome() {
    const cards = data.categories.map((category) => {
      const count = category.groups.reduce((sum, group) => sum + group.items.length, 0);
      return `<a class="category-card" href="#/category/${category.id}">
        <div class="category-top"><span class="category-icon">${esc(category.symbol)}</span><span class="category-count">${count} 个知识点</span></div>
        <h3>${esc(category.zh)} <small>${esc(category.en)}</small></h3>
        <p>${esc(category.description)}</p>
      </a>`;
    }).join("");
    const featured = data.featured.map((id) => termMap.get(id)).filter(Boolean);

    app.innerHTML = `
      <section class="hero">
        <div>
          <span class="eyebrow">先有直觉，再学术语</span>
          <h1>把金融，讲成<br><span>生活里听得懂的话。</span></h1>
          <p class="hero-copy">先用工资、买房、信用卡、开店和买菜把概念讲懂，再进入公式、机制和真实市场。没有学过金融，也能在30秒内抓住重点。</p>
          <div class="hero-search" role="search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>
            <input id="heroSearch" type="search" autocomplete="off" placeholder="搜索 MACD、国债、Delta、爆仓…" aria-label="搜索金融知识" />
            <button id="heroSearchButton">搜索知识</button>
          </div>
          <div class="search-hints">热门：${["布林带", "国债", "CFD", "Funding Rate", "市盈率"].map((label) => `<button data-search-term="${label}">${label}</button>`).join("")}</div>
        </div>
        <aside class="hero-panel" aria-label="知识库概览">
          <span class="panel-label">Knowledge graph · live index</span>
          <div class="market-line">${homeMarketLine()}</div>
          <div class="stat-row">
            <div><strong>${data.categories.length}</strong><span>知识大类</span></div>
            <div><strong>${allTerms.length}</strong><span>独立词条</span></div>
            <div><strong>${allAliases}</strong><span>中英别名</span></div>
          </div>
          <div class="panel-route"><span>股票</span><span>›</span><span>估值</span><span>›</span><b>市盈率 PE</b></div>
        </aside>
      </section>

      <section class="day-preview">
        <div>
          <span class="eyebrow">你早就在使用金融</span>
          <h2>普通人的一天，本身就在金融系统里</h2>
          <p>工资到账、刷卡付款、换汇、还房贷、买余额宝——每一步背后都有一个金融概念。</p>
          <a class="primary-button" href="#/day">看看你一天遇到的金融 →</a>
        </div>
        <div class="day-mini-flow">
          <a href="#/knowledge/payslip"><b>07:30</b><span>收到工资</span><small>工资条 · 个税</small></a>
          <a href="#/knowledge/third-party-payment"><b>12:20</b><span>支付宝付款</span><small>第三方支付</small></a>
          <a href="#/knowledge/mortgage-home"><b>19:00</b><span>偿还房贷</span><small>利率 · 按揭</small></a>
          <a href="#/knowledge/money-market-fund"><b>22:30</b><span>转入余额宝</span><small>货币基金</small></a>
        </div>
      </section>

      <section>
        <div class="section-header">
          <div><h2>浏览金融知识树</h2><p>按市场、产品、方法和风险逐层进入。</p></div>
          <a class="text-link" href="#/map">展开完整知识地图 →</a>
        </div>
        <div class="category-grid">${cards}</div>
      </section>

      <section class="home-band">
        <div class="band-card dark">
          <span class="panel-label">快速入口</span>
          <h3>先听懂，再继续深挖</h3>
          <p>每个词条先讲生活故事和数字例子，再逐层进入机制、公式、风险和专业应用。</p>
          <div class="mini-links">${featured.map((term) => `<a class="mini-link" href="#/knowledge/${term.id}">${esc(term.zh)}</a>`).join("")}</div>
        </div>
        <div class="band-card">
          <span class="panel-label">互动理解</span>
          <h3>看到数字如何改变结果</h3>
          <p>调整本金、杠杆和价格计算盈亏；点击K线读取OHLC，并叠加EMA、布林带、MACD或RSI。</p>
          <div class="mini-links"><a class="mini-link" href="#/tools">打开杠杆模拟器</a><a class="mini-link" href="#/tools">打开指标实验室</a></div>
        </div>
      </section>
      ${footer()}`;
    bindInlineSearch();
  }

  function renderDay() {
    const moments = [
      { time: "07:30", action: "工资到账", detail: "合同写着的工资为什么和银行卡到账金额不同？", links: [["payslip", "工资条"], ["gross-net-income", "税前与税后"], ["personal-income-tax", "个人所得税"]] },
      { time: "08:10", action: "刷卡坐车", detail: "一次看似瞬间的付款，背后要经过账户、支付指令和银行结算。", links: [["bank-account", "银行账户"], ["payment-system", "支付系统"]] },
      { time: "12:20", action: "支付宝付午饭", detail: "商家为什么能马上看到付款成功？第三方支付怎样连接你的银行卡？", links: [["third-party-payment", "第三方支付"], ["bank-account", "银行账户"]] },
      { time: "15:00", action: "看到人民币兑美元变化", detail: "留学费、iPhone、进口汽车和油价，都可能受汇率变化影响。", links: [["currency-pair", "货币对"], ["currency-risk", "汇率风险"]] },
      { time: "18:30", action: "信用卡买手机", detail: "银行先替你付款；免息、最低还款和分期并不是一回事。", links: [["credit-card", "信用卡"], ["minimum-payment", "最低还款"], ["installment-payment", "分期付款"]] },
      { time: "20:00", action: "偿还房贷", detail: "每月月供中，一部分是利息，一部分是在归还本金。", links: [["mortgage-home", "房贷"], ["interest-rate", "利率"], ["equal-principal-interest", "等额本息"]] },
      { time: "21:30", action: "检查家庭账本", detail: "收入不少却总存不下钱，往往要先看现金流，而不是先找高收益投资。", links: [["household-cashflow", "家庭现金流"], ["savings-rate", "储蓄率"], ["emergency-fund", "应急资金"]] },
      { time: "22:30", action: "把零钱转入余额宝", detail: "它看起来像账户余额，背后通常连接的是货币市场基金。", links: [["money-market-fund", "货币基金"], ["nav", "基金净值"], ["liquidity", "流动性"]] }
    ];
    app.innerHTML = `
      ${breadcrumb([{ label: "普通人的一天" }])}
      <header class="page-heading day-heading">
        <div><span class="eyebrow">Finance in Everyday Life</span><h1>你一天中遇到的金融</h1><p>金融不是屏幕上的红绿数字。你从早上收到工资开始，就已经在账户、支付、信贷、利率、汇率和投资系统里生活。</p></div>
        <div class="page-metric"><strong>${moments.length}</strong><span>个日常时刻</span></div>
      </header>
      <div class="daily-timeline">
        ${moments.map((moment, index) => `<article class="daily-moment">
          <div class="moment-time"><span>${esc(moment.time)}</span><i>${String(index + 1).padStart(2, "0")}</i></div>
          <div><h2>${esc(moment.action)}</h2><p>${esc(moment.detail)}</p><div class="moment-links">${moment.links.map(([id, label]) => `<a href="#/knowledge/${id}">${esc(label)} <span>→</span></a>`).join("")}</div></div>
        </article>`).join("")}
      </div>
      <section class="day-conclusion"><span>一天结束</span><h2>你不需要先成为金融专家，才能管好自己的钱。</h2><p>先看懂每天正在发生什么，再理解背后的术语。Finpedia会沿着这些生活入口，把你带到更专业的金融知识。</p><a class="primary-button" href="#/category/personal-finance">进入个人与家庭金融 →</a></section>
      ${footer()}`;
  }

  function renderCategory(category) {
    const count = category.groups.reduce((sum, group) => sum + group.items.length, 0);
    app.innerHTML = `
      ${breadcrumb([{ label: category.zh }])}
      <header class="page-heading">
        <div><span class="eyebrow">${esc(category.en)}</span><h1>${esc(category.zh)}</h1><p>${esc(category.description)}</p></div>
        <div class="page-metric"><strong>${count}</strong><span>独立知识词条</span></div>
      </header>
      <div class="group-list">
        ${category.groups.map((group) => `
          <section class="group-card" id="${group.id}">
            <div><h2>${esc(group.zh)}</h2><p>${esc(group.en)}<br>${esc(group.description)}</p></div>
            <div class="term-grid">
              ${group.items.map((item) => `<a class="term-link" href="#/knowledge/${item.id}"><span><strong>${esc(item.zh)}</strong><span>${esc(item.en)}</span></span><i>›</i></a>`).join("")}
            </div>
          </section>`).join("")}
      </div>
      ${footer()}`;
  }

  function genericArticle(term) {
    const templates = {
      products: {
        principle: `${term.zh}的价格与现金流通常由产品条款、底层资产、市场供需和交易成本共同决定。理解时先确认“买到的是什么权利”，再看收益来源和损失边界。`,
        understanding: `把${term.zh}看成一份有明确参与者、现金流和风险承担方式的金融安排。先画出谁向谁支付什么，再讨论价格。`,
        uses: ["获得特定资产或市场敞口", "资产配置与风险分散", "满足融资、流动性或收益管理需求"],
        limitations: ["产品名称相同，具体条款可能不同", "市场价格会受流动性和情绪影响", "费用、税务与交易规则会改变实际回报"]
      },
      derivatives: {
        principle: `${term.zh}的价值依赖底层资产或参考变量，并通过合同条款规定结算。名义金额可能远大于初始资金，因此必须同时看保证金、杠杆和极端情景。`,
        understanding: `把${term.zh}理解成一份“未来按什么规则结算”的合同，而不是只看屏幕上的价格。`,
        uses: ["管理或转移价格风险", "建立多空市场敞口", "构造特定收益结构"],
        limitations: ["合约结构和平台规则会显著影响结果", "杠杆会放大亏损", "定价与退出依赖市场流动性"]
      },
      analysis: {
        principle: `${term.zh}把历史价格、成交量或企业信息转换为更容易观察的结构。它描述证据，不直接保证未来方向。`,
        understanding: `把${term.zh}当成仪表盘上的一个读数：它能提示当前状态，但需要和环境、其他证据及风险规则一起解释。`,
        uses: ["把市场信息结构化", "比较不同时间或资产状态", "形成可检验的观察与交易规则"],
        limitations: ["历史关系可能改变", "参数与识别可能带有主观性", "单一信号容易受到噪声影响"]
      },
      economy: {
        principle: `${term.zh}反映经济中的一个侧面，需要结合发布时间、统计口径、预期差和其他指标理解。市场通常交易的是“结果相对预期”，而不只是数值本身。`,
        understanding: `把${term.zh}看成经济体检中的一个指标。单项异常值得关注，但不能代替完整诊断。`,
        uses: ["判断经济活动与政策环境", "辅助资产配置和情景分析", "比较不同国家或时期"],
        limitations: ["数据可能修订并存在滞后", "统计口径跨地区不完全一致", "指标与资产价格不是稳定的一一对应关系"]
      },
      quant: {
        principle: `${term.zh}用数学、统计或计算规则表达金融问题。可靠结论取决于数据质量、假设、样本外验证和实施成本。`,
        understanding: `把${term.zh}看成一台用假设和数据驱动的计算器：输入若有偏差，输出即使精确也可能不准确。`,
        uses: ["量化不确定性和风险", "建立可重复的研究流程", "比较方案并自动化执行"],
        limitations: ["模型会简化真实市场", "数据偏差可能被放大", "历史拟合不等于未来有效"]
      },
      portfolio: {
        principle: `${term.zh}从整体而非单一资产观察收益、风险和相关性。组合结果取决于每项暴露的大小以及它们如何共同变化。`,
        understanding: `把${term.zh}想成一支队伍：不是只找最强的单个成员，而是关注成员之间如何配合以及整体能否承受失败。`,
        uses: ["配置和监控整体风险", "平衡收益目标与损失承受力", "建立再平衡和绩效评价规则"],
        limitations: ["相关性在危机中可能上升", "估计参数会随时间变化", "分散化不能消除全部风险"]
      },
      institutions: {
        principle: `${term.zh}的作用由法律授权、商业模式和监管边界共同决定。相同名称在不同国家可能对应不同权限。`,
        understanding: `理解${term.zh}时，先问它服务谁、承担什么风险、由谁监督，以及出问题时谁承担损失。`,
        uses: ["组织金融交易和服务", "管理信用、流动性或操作风险", "执行市场或监管规则"],
        limitations: ["制度因司法辖区而异", "名称不能替代牌照与主体核验", "机构仍存在治理和操作风险"]
      },
      markets: {
        principle: `${term.zh}通过报价、订单、清算和结算规则连接资金供需。交易场所和参与者结构会影响价格发现、流动性与风险。`,
        understanding: `把${term.zh}看成一套让买卖双方找到彼此、确认价格并完成交收的交通系统。`,
        uses: ["形成价格和提供流动性", "完成融资和风险转移", "连接发行人、投资者与中介"],
        limitations: ["流动性会随时段与压力变化", "市场结构可能造成执行差异", "清算结算仍有制度与对手方风险"]
      },
      strategy: {
        principle: `${term.zh}把市场观察转化为入场、退出、仓位和风险规则。只有同时考虑成功概率、盈亏幅度、成本与容量，策略才可评价。`,
        understanding: `把${term.zh}看成一份完整操作手册，而不是一个入场信号；最关键的是失效时怎么退出。`,
        uses: ["把决策转化为一致规则", "控制仓位和执行过程", "通过回测与复盘评价假设"],
        limitations: ["市场状态变化会让优势消失", "交易成本会侵蚀理论回报", "回测容易出现过拟合与数据偏差"]
      },
      personal: {
        principle: `${term.zh}需要放在家庭收入、支出、负债、保障和用钱时间中一起理解。关键不是只看名义金额，而是看税费后的真实现金流和最坏情景。`,
        understanding: `把${term.zh}放进每月家庭账本：钱从哪里进来、什么时候出去、能不能随时使用、发生意外时谁承担。`,
        uses: ["安排日常现金流", "降低债务和意外风险", "为住房、教育和退休等目标做准备"],
        limitations: ["制度和税务因地区而异", "合同利率与费用可能复杂", "家庭收入和风险承受能力会变化"]
      }
    };
    const base = templates[term.category.domain] || templates.products;
    return {
      definition: `${term.summary} 它属于“${term.category.zh} › ${term.group.zh}”知识路径，实际含义应结合具体市场、合同和统计口径确认。`,
      principle: base.principle,
      example: `假设你在实际市场中遇到“${term.zh}”。第一步不是立即交易，而是确认它的定义、计量口径和适用场景；第二步识别收益来源、成本和最坏情景；最后再与相关概念交叉验证。`,
      understanding: base.understanding,
      uses: base.uses,
      pros: ["提供统一的金融沟通语言", "帮助拆分复杂问题", "可与同类指标或产品进行比较"],
      limitations: base.limitations,
      mistakes: ["只记名称，不核对具体定义和口径", "脱离市场环境使用单一结论", "忽略成本、流动性和极端风险"],
      risk: `${term.zh}本身不是投资建议。用于真实决策前，应核对产品文件、监管要求、数据来源与个人风险承受能力。`
    };
  }

  function conceptVisual(term) {
    if (term.category.id === "technical") {
      return `<div class="concept-visual technical-visual" role="img" aria-label="${esc(term.zh)}价格示意图">
        <svg viewBox="0 0 760 220" preserveAspectRatio="none">
          <defs><linearGradient id="visualFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27c99a" stop-opacity=".2"/><stop offset="1" stop-color="#27c99a" stop-opacity="0"/></linearGradient></defs>
          <g class="grid-lines"><path d="M0 44H760M0 88H760M0 132H760M0 176H760"/></g>
          <path class="visual-area" d="M0 172 C45 160 55 95 96 116 S160 154 196 102 253 51 290 83 348 139 386 105 432 48 477 67 533 145 570 113 618 55 652 79 700 52 760 26 L760 220H0Z"/>
          <path class="visual-price" d="M0 172 C45 160 55 95 96 116 S160 154 196 102 253 51 290 83 348 139 386 105 432 48 477 67 533 145 570 113 618 55 652 79 700 52 760 26"/>
          <path class="visual-average" d="M0 157 C80 141 119 126 196 118 S310 101 386 102 510 105 570 96 675 78 760 58"/>
        </svg>
        <div><span>示意价格</span><span>平滑参考</span><small>图形只用于解释结构</small></div>
      </div>`;
    }
    return `<div class="concept-visual lineage-visual" role="img" aria-label="${esc(term.zh)}知识关系图">
      <div><span>${esc(domainLabels[term.category.domain] || "金融知识")}</span><i>›</i><span>${esc(term.category.zh)}</span><i>›</i><span>${esc(term.group.zh)}</span><i>›</i><strong>${esc(term.zh)}</strong></div>
      <p>从大类到具体词条：点击页面下方的相关知识，可以沿关系继续学习。</p>
    </div>`;
  }

  function listMarkup(items) {
    return `<ul class="article-list">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
  }

  const marketAnalogyMap = {
    "what-is-stock": "股票就像不同菜摊的一小部分所有权。你不是买下一颗菜，而是买了摊位生意的一小份。",
    "exchange": "交易所就是菜市场本身：它提供场地和规则，让买卖双方能够找到彼此。",
    "securities-broker": "券商像带你进入市场并替你递交买卖要求的中介。",
    "broker": "经纪商像替顾客寻找报价、递交订单并处理交易手续的中介。",
    "bid": "买一价就是现场买家目前愿意出的最高价格。",
    "ask": "卖一价就是现场卖家目前愿意接受的最低价格。",
    "spread": "点差就是买家最高出价与卖家最低要价之间还没有谈拢的距离。",
    "market-maker": "做市商像长期站在市场里的批发商，同时报出愿意收货和愿意卖货的价格。",
    "liquidity": "流动性就是市场里有没有足够多人愿意买卖，以及你能不能很快成交。",
    "volume": "成交量就是今天整个菜市场实际卖出了多少东西。",
    "volatility": "波动率就是今天菜价上下变化得有多剧烈。",
    "order-book": "订单簿像市场门口的电子牌，按价格排着谁想买、谁想卖以及各有多少。"
  };

  function calculationMarkup(number) {
    if (!number) return "";
    return `<div class="calculation-card">
      <p>${esc(number.intro)}</p>
      <ol>${number.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>
      <strong>${esc(number.result)}</strong>
    </div>`;
  }

  function comparisonMarkup(term, plain) {
    const ids = [term.id, ...(plain.compare || []), ...(term.related || [])];
    const items = [...new Map(ids.map((id) => [id, termMap.get(id)]).filter(([, item]) => item)).values()].slice(0, 5);
    if (items.length < 2) return `<p>这个概念需要结合“${esc(term.group.zh)}”中的其他词条一起理解，请继续查看页面底部的相关知识。</p>`;
    return `<div class="comparison-scroll"><table class="comparison-table">
      <thead><tr><th>怎么比较</th>${items.map((item) => `<th><a href="#/knowledge/${item.id}">${esc(item.zh)}</a></th>`).join("")}</tr></thead>
      <tbody>
        <tr><th>一句话本质</th>${items.map((item) => `<td>${esc(window.FIN_PLAIN.essence(item))}</td>`).join("")}</tr>
        <tr><th>属于哪里</th>${items.map((item) => `<td>${esc(item.category.zh)}<small>${esc(item.group.zh)}</small></td>`).join("")}</tr>
        <tr><th>主要风险</th>${items.map((item) => `<td>${esc(window.FIN_PLAIN.everydayRisk(item))}</td>`).join("")}</tr>
      </tbody>
    </table></div>`;
  }

  function renderArticle(term) {
    const detail = { ...genericArticle(term), ...(data.articles[term.id] || {}) };
    const plain = window.FIN_PLAIN.build(term, detail);
    const explicitRelated = (term.related || []).map((id) => termMap.get(id)).filter(Boolean);
    const sameGroup = term.group.items.map((item) => termMap.get(item.id)).filter((item) => item && item.id !== term.id);
    const preferred = (plain.compare || []).map((id) => termMap.get(id)).filter(Boolean);
    const related = [...new Map([...preferred, ...explicitRelated, ...sameGroup].map((item) => [item.id, item])).values()].slice(0, 12);
    const params = detail.params || [
      ["定义口径", "确认具体含义", "不同市场或机构可能存在差异"],
      ["适用范围", "确认使用场景", `主要用于${term.group.zh}`],
      ["风险边界", "确认最坏情景", "同时检查费用、流动性与规则"]
    ];
    const analogy = marketAnalogyMap[term.id];
    const sections = [
      ["life-story", "01", "先讲生活故事"], ["plain-meaning", "02", `所以，${term.zh}是什么`], ["numbers", "03", "拿数字算一遍"],
      ...(analogy ? [["market-analogy", "04", "把市场想成菜市场"]] : []),
      ["relevance", "05", "跟普通人有什么关系"], ["principle", "06", "它是怎么运作的"], ["money-flow", "07", "钱是怎么流动的"],
      ["benefit", "08", "收益或好处从哪里来"], ["cost", "09", "可能怎么亏钱"], ["indirect", "10", "你可能已经用过它"],
      ["without", "11", "如果没有它"], ["comparison", "12", "它和类似东西的区别"], ["mistakes", "13", "很多人会误解"],
      ["real-world", "14", "现实世界里的例子"], ["risk", "15", "风险"], ["professional", "16", "专业定义与进阶"], ["related", "17", "相关知识"]
    ];

    app.innerHTML = `
      ${breadcrumb([
        { label: term.category.zh, href: `#/category/${term.category.id}` },
        { label: term.group.zh, href: `#/category/${term.category.id}` },
        { label: term.zh }
      ])}
      <div class="article-layout">
        <article class="article-body" data-reader-level="beginner">
          <header class="article-header">
            <div class="article-kicker">${esc(term.category.zh)} <span>› ${esc(term.group.zh)}</span></div>
            <h1>${esc(term.zh)}<small>${esc(term.en)}</small></h1>
            <div class="one-liner"><span>一句话看懂</span><strong>${esc(plain.oneLine)}</strong></div>
            <div class="level-tabs" role="group" aria-label="阅读深度">
              <button class="active" data-level="beginner">30秒看懂</button>
              <button data-level="student">完整理解</button>
              <button data-level="advanced">专业进阶</button>
            </div>
          </header>

          <section class="article-section" id="life-story"><h2><span class="section-number">01</span>先讲一个生活故事</h2>
            <div class="life-story-card"><div class="story-label"><span>生活中的它</span><strong>${esc(plain.scene)}</strong></div><p>${esc(plain.story)}</p></div>
          </section>
          <section class="article-section" id="plain-meaning"><h2><span class="section-number">02</span>所以，${esc(term.zh)}到底是什么？</h2><div class="plain-answer">${esc(plain.plain)}</div></section>
          <section class="article-section" id="numbers"><h2><span class="section-number">03</span>拿日常生活算一遍</h2>${calculationMarkup(plain.number)}</section>
          ${analogy ? `<section class="article-section" id="market-analogy"><h2><span class="section-number">04</span>假如金融市场就是一个菜市场</h2><div class="market-analogy"><span>菜市场类比</span><p>${esc(analogy)}</p></div></section>` : ""}
          <section class="article-section" id="relevance"><h2><span class="section-number">05</span>这东西跟普通人有什么关系？</h2><p>${esc(plain.relevance)}</p></section>

          <section class="article-section level-student" id="principle"><h2><span class="section-number">06</span>它是怎么运作的？</h2><p>${esc(plain.mechanism)}</p>${conceptVisual(term)}</section>
          <section class="article-section level-student" id="money-flow"><h2><span class="section-number">07</span>钱是怎么流动的？</h2><p>${esc(plain.moneyFlow)}</p></section>
          <section class="article-section level-student" id="benefit"><h2><span class="section-number">08</span>收益或好处从哪里来？</h2><p>${esc(plain.benefit)}</p></section>
          <section class="article-section level-student" id="cost"><h2><span class="section-number">09</span>我可能怎么亏钱？</h2><p>${esc(plain.cost)}</p></section>
          <section class="article-section level-student" id="indirect"><h2><span class="section-number">10</span>你可能已经用过它</h2><p>${esc(plain.indirect)}</p></section>
          <section class="article-section level-student" id="without"><h2><span class="section-number">11</span>如果没有它，会怎么样？</h2><p>${esc(plain.without)}</p></section>
          <section class="article-section level-student" id="comparison"><h2><span class="section-number">12</span>它和类似东西有什么区别？</h2>${comparisonMarkup(term, plain)}</section>

          <section class="article-section" id="mistakes"><h2><span class="section-number">13</span>很多人会理解错的地方</h2><div class="misunderstanding"><div><span>常见误解</span><p>${esc(plain.misunderstanding)}</p></div><div><span>更准确地说</span><p>${esc(plain.correction)}</p></div></div></section>
          <section class="article-section" id="real-world"><h2><span class="section-number">14</span>真实世界里你在哪里见过？</h2><div class="real-world-list">${plain.real.map((item) => `<span>${esc(item)}</span>`).join("")}</div></section>
          <section class="article-section" id="risk"><h2><span class="section-number">15</span>风险</h2><div class="callout warning"><strong>先看最坏情况</strong><p>${esc(detail.risk)}</p></div></section>

          <section class="article-section level-advanced" id="professional"><h2><span class="section-number">16</span>专业定义与进阶</h2>
            <div class="professional-block"><h3>专业定义</h3><p>${esc(plain.professional)}</p></div>
            ${plain.glossary.length ? `<div class="plain-glossary"><strong>本页专业词先翻译成人话</strong>${plain.glossary.map((item) => `<div><b>${esc(item.word)}</b><span>${esc(item.meaning)}</span></div>`).join("")}</div>` : ""}
            <div class="professional-block"><h3>运行机制</h3><p>${esc(detail.principle)}</p></div>
            ${detail.formula ? `<div class="formula-box"><div class="formula">${esc(detail.formula.main).replaceAll("\n", "<br>")}</div><div class="formula-note">${esc(detail.formula.note)}</div></div>` : ""}
            <table class="parameter-table"><thead><tr><th>项目</th><th>专业含义</th><th>阅读重点</th></tr></thead><tbody>${params.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>
            <div class="professional-context">
              <div><h3>历史背景</h3><p>${esc(plain.context.history)}</p></div>
              <div><h3>主要参与者</h3>${listMarkup(plain.context.participants)}</div>
              <div><h3>实际规则</h3><p>${esc(plain.context.rules)}</p></div>
              <div><h3>主要影响因素</h3>${listMarkup(plain.context.influences)}</div>
            </div>
            <div class="advanced-columns"><div><h3>常见用途</h3>${listMarkup(detail.uses)}</div><div><h3>优势</h3>${listMarkup(detail.pros)}</div><div><h3>局限</h3>${listMarkup(detail.limitations)}</div></div>
          </section>
          <section class="article-section" id="related"><h2><span class="section-number">17</span>接下来可以学什么？</h2>
            <div class="related-grid">${related.map((item) => `<a class="related-card" href="#/knowledge/${item.id}"><strong>${esc(item.zh)}</strong><small>${esc(item.en)} · ${esc(item.category.zh)}</small></a>`).join("")}</div>
          </section>
        </article>
        <nav class="article-toc" aria-label="本文目录"><strong>本页目录</strong>${sections.map(([id, number, label]) => `<a href="" data-scroll-target="${id}">${number} ${label}</a>`).join("")}</nav>
      </div>
      ${footer()}`;

    document.querySelectorAll(".level-tabs button").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".level-tabs button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        document.querySelector(".article-body").dataset.readerLevel = button.dataset.level;
      });
    });
    document.querySelectorAll("[data-scroll-target]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById(link.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function renderMap() {
    const domains = [...new Set(data.categories.map((category) => category.domain))];
    app.innerHTML = `
      ${breadcrumb([{ label: "知识地图" }])}
      <header class="page-heading">
        <div><span class="eyebrow">Knowledge Map</span><h1>金融知识地图</h1><p>从完整分类中观察每个概念的位置。可按产品、分析、市场、机构和量化等领域筛选。</p></div>
        <div class="page-metric"><strong>${allTerms.length}</strong><span>可搜索知识点</span></div>
      </header>
      <div class="map-toolbar" role="group" aria-label="筛选知识地图">
        <button class="filter-chip active" data-domain="all">全部</button>
        ${domains.map((domain) => `<button class="filter-chip" data-domain="${domain}">${esc(domainLabels[domain] || domain)}</button>`).join("")}
      </div>
      <div class="knowledge-map" id="knowledgeMap">${mapColumns(data.categories)}</div>
      ${footer()}`;
    document.querySelectorAll(".filter-chip").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const filtered = button.dataset.domain === "all" ? data.categories : data.categories.filter((category) => category.domain === button.dataset.domain);
        document.getElementById("knowledgeMap").innerHTML = mapColumns(filtered);
      });
    });
  }

  function mapColumns(categories) {
    return categories.map((category) => {
      const count = category.groups.reduce((sum, group) => sum + group.items.length, 0);
      return `<section class="map-column" data-domain="${category.domain}">
        <header><h2><a href="#/category/${category.id}">${esc(category.zh)}</a></h2><span>${count} 项</span></header>
        ${category.groups.map((group) => `<div class="map-group"><h3>${esc(group.zh)}</h3><div>${group.items.slice(0, 9).map((term) => `<a href="#/knowledge/${term.id}">${esc(term.zh)}</a>`).join("")}${group.items.length > 9 ? `<a href="#/category/${category.id}">+${group.items.length - 9}</a>` : ""}</div></div>`).join("")}
      </section>`;
    }).join("");
  }

  function renderTools() {
    app.innerHTML = `
      ${breadcrumb([{ label: "互动工具" }])}
      <header class="page-heading">
        <div><span class="eyebrow">Interactive Lab</span><h1>金融互动实验室</h1><p>通过调整变量理解杠杆如何放大盈亏，以及技术指标如何随价格和参数变化。</p></div>
        <div class="page-metric"><strong>2</strong><span>实时学习工具</span></div>
      </header>
      <div class="tools-grid">
        <section class="tool-card" aria-labelledby="leverageTitle">
          <h2 id="leverageTitle">杠杆与盈亏模拟器</h2><p>输入是假设值，结果不包含税费、滑点和平台具体规则。</p>
          <div class="form-grid">
            <div class="field"><label for="capital">本金 / 保证金（USD）</label><input id="capital" type="number" min="1" step="100" value="1000"></div>
            <div class="field"><label for="leverageInput">杠杆倍数</label><input id="leverageInput" type="number" min="1" max="1000" step="1" value="10"></div>
            <div class="field"><label for="entryPrice">开仓价格</label><input id="entryPrice" type="number" min="0.0001" step="1" value="2000"></div>
            <div class="field"><label for="currentPrice">当前 / 平仓价格</label><input id="currentPrice" type="number" min="0.0001" step="1" value="2040"></div>
            <div class="field"><label for="direction">方向</label><select id="direction"><option value="1">做多 Long</option><option value="-1">做空 Short</option></select></div>
            <div class="field"><label for="maintenance">维持保证金率（%）</label><input id="maintenance" type="number" min="0" max="20" step="0.1" value="0.5"></div>
          </div>
          <div class="calc-results">
            <div class="calc-result"><span>名义头寸</span><strong id="notionalResult">—</strong></div>
            <div class="calc-result"><span>资产数量</span><strong id="quantityResult">—</strong></div>
            <div class="calc-result"><span>未计费盈亏</span><strong id="pnlResult">—</strong></div>
            <div class="calc-result"><span>保证金收益率</span><strong id="roiResult">—</strong></div>
            <div class="calc-result"><span>估算强平价格</span><strong id="liquidationResult">—</strong></div>
            <div class="calc-result"><span>价格变动</span><strong id="moveResult">—</strong></div>
          </div>
          <p class="tool-note">强平价为简化教学估算。真实结果受手续费、资金费率、阶梯保证金、标记价格和平台规则影响。</p>
        </section>

        <section class="tool-card" aria-labelledby="indicatorTitle">
          <h2 id="indicatorTitle">K线与技术指标实验室</h2><p>点击任意K线查看Open、High、Low、Close；切换指标并调整周期。</p>
          <div class="chart-controls" role="group" aria-label="选择技术指标">
            <button class="active" data-indicator="ema">EMA</button>
            <button data-indicator="bollinger">Bollinger Bands</button>
            <button data-indicator="macd">MACD</button>
            <button data-indicator="rsi">RSI</button>
            <label>周期 <output id="periodOutput">14</output> <input id="periodRange" type="range" min="5" max="30" value="14"></label>
          </div>
          <div class="chart-wrap">
            <canvas id="marketCanvas" aria-label="可点击的K线和指标图表"></canvas>
            <div class="candle-readout" id="candleReadout">点击K线读取 OHLC</div>
            <div class="indicator-legend" id="indicatorLegend">EMA · 14</div>
          </div>
          <p class="tool-note">图中价格为固定模拟数据，只用于解释指标结构，不代表真实市场或交易信号。</p>
        </section>
      </div>
      ${footer()}`;
    setupLeverageCalculator();
    setupMarketLab();
  }

  function setupLeverageCalculator() {
    const ids = ["capital", "leverageInput", "entryPrice", "currentPrice", "direction", "maintenance"];
    const update = () => {
      const capital = Math.max(0, Number(document.getElementById("capital").value) || 0);
      const leverage = Math.max(1, Number(document.getElementById("leverageInput").value) || 1);
      const entry = Math.max(0.0001, Number(document.getElementById("entryPrice").value) || 0.0001);
      const current = Math.max(0.0001, Number(document.getElementById("currentPrice").value) || 0.0001);
      const direction = Number(document.getElementById("direction").value);
      const maintenance = Math.max(0, Number(document.getElementById("maintenance").value) || 0) / 100;
      const notional = capital * leverage;
      const quantity = notional / entry;
      const pnl = direction * quantity * (current - entry);
      const roi = capital ? pnl / capital : 0;
      const move = direction * (current - entry) / entry;
      const liquidation = direction === 1 ? entry * (1 - 1 / leverage + maintenance) : entry * (1 + 1 / leverage - maintenance);
      document.getElementById("notionalResult").textContent = formatMoney(notional);
      document.getElementById("quantityResult").textContent = quantity.toLocaleString("zh-CN", { maximumFractionDigits: 4 });
      const pnlEl = document.getElementById("pnlResult");
      pnlEl.textContent = formatMoney(pnl, true);
      pnlEl.className = pnl >= 0 ? "positive" : "negative";
      const roiEl = document.getElementById("roiResult");
      roiEl.textContent = formatPercent(roi);
      roiEl.className = roi >= 0 ? "positive" : "negative";
      document.getElementById("liquidationResult").textContent = liquidation > 0 ? liquidation.toLocaleString("zh-CN", { maximumFractionDigits: 2 }) : "接近 0";
      document.getElementById("moveResult").textContent = formatPercent(move);
    };
    ids.forEach((id) => document.getElementById(id).addEventListener("input", update));
    update();
  }

  function formatMoney(value, signed = false) {
    const sign = signed && value > 0 ? "+" : "";
    return `${sign}$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function formatPercent(value) {
    const sign = value > 0 ? "+" : "";
    return `${sign}${(value * 100).toFixed(2)}%`;
  }

  function generateCandles() {
    let seed = 17;
    let last = 98;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: 54 }, (_, index) => {
      const trend = index < 18 ? 0.32 : index < 34 ? -0.08 : 0.45;
      const open = last + (random() - 0.5) * 1.2;
      const close = open + trend + (random() - 0.47) * 3.1;
      const high = Math.max(open, close) + random() * 1.8 + 0.25;
      const low = Math.min(open, close) - random() * 1.8 - 0.25;
      last = close;
      return { open, high, low, close, volume: 600 + random() * 900 };
    });
  }

  function movingAverage(values, period, exponential = false) {
    const output = Array(values.length).fill(null);
    if (exponential) {
      const alpha = 2 / (period + 1);
      let value = values[0];
      values.forEach((current, index) => {
        value = index === 0 ? current : current * alpha + value * (1 - alpha);
        if (index >= period - 1) output[index] = value;
      });
    } else {
      for (let i = period - 1; i < values.length; i += 1) {
        output[i] = values.slice(i - period + 1, i + 1).reduce((sum, value) => sum + value, 0) / period;
      }
    }
    return output;
  }

  function standardDeviation(values, period, means) {
    return values.map((_, index) => {
      if (index < period - 1) return null;
      const slice = values.slice(index - period + 1, index + 1);
      const mean = means[index];
      return Math.sqrt(slice.reduce((sum, value) => sum + (value - mean) ** 2, 0) / period);
    });
  }

  function rsiValues(values, period) {
    const result = Array(values.length).fill(null);
    for (let i = period; i < values.length; i += 1) {
      let gains = 0;
      let losses = 0;
      for (let j = i - period + 1; j <= i; j += 1) {
        const change = values[j] - values[j - 1];
        if (change > 0) gains += change; else losses -= change;
      }
      const rs = losses === 0 ? 100 : gains / losses;
      result[i] = 100 - 100 / (1 + rs);
    }
    return result;
  }

  function setupMarketLab() {
    const canvas = document.getElementById("marketCanvas");
    const candles = generateCandles();
    marketLab = { canvas, candles, indicator: "ema", period: 14, selected: null };
    document.querySelectorAll("[data-indicator]").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll("[data-indicator]").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        marketLab.indicator = button.dataset.indicator;
        drawMarketLab();
      });
    });
    document.getElementById("periodRange").addEventListener("input", (event) => {
      marketLab.period = Number(event.target.value);
      document.getElementById("periodOutput").textContent = marketLab.period;
      drawMarketLab();
    });
    canvas.addEventListener("pointerdown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const chartLeft = 40;
      const chartWidth = rect.width - 55;
      const index = Math.max(0, Math.min(candles.length - 1, Math.floor((x - chartLeft) / (chartWidth / candles.length))));
      marketLab.selected = index;
      const candle = candles[index];
      document.getElementById("candleReadout").textContent = `#${index + 1}  O ${candle.open.toFixed(2)}  H ${candle.high.toFixed(2)}  L ${candle.low.toFixed(2)}  C ${candle.close.toFixed(2)}`;
      drawMarketLab();
    });
    window.addEventListener("resize", drawMarketLab, { passive: true });
    drawMarketLab();
  }

  function drawMarketLab() {
    if (!marketLab || !document.body.contains(marketLab.canvas)) return;
    const { canvas, candles, indicator, period, selected } = marketLab;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;
    const left = 40;
    const right = 15;
    const top = 25;
    const lowerHeight = indicator === "macd" || indicator === "rsi" ? 80 : 30;
    const priceBottom = height - lowerHeight - 14;
    const closes = candles.map((candle) => candle.close);
    const max = Math.max(...candles.map((candle) => candle.high));
    const min = Math.min(...candles.map((candle) => candle.low));
    const xStep = (width - left - right) / candles.length;
    const y = (value) => top + (max - value) / (max - min) * (priceBottom - top);
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(170, 199, 210, .12)";
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(178, 202, 212, .55)";
    ctx.font = "10px ui-monospace, monospace";
    for (let i = 0; i <= 4; i += 1) {
      const yy = top + (priceBottom - top) * i / 4;
      ctx.beginPath(); ctx.moveTo(left, yy); ctx.lineTo(width - right, yy); ctx.stroke();
      const price = max - (max - min) * i / 4;
      ctx.fillText(price.toFixed(1), 5, yy + 3);
    }
    candles.forEach((candle, index) => {
      const x = left + index * xStep + xStep / 2;
      const up = candle.close >= candle.open;
      ctx.strokeStyle = up ? "#45dfb0" : "#f06a72";
      ctx.fillStyle = up ? "#45dfb0" : "#f06a72";
      ctx.beginPath(); ctx.moveTo(x, y(candle.high)); ctx.lineTo(x, y(candle.low)); ctx.stroke();
      const bodyTop = y(Math.max(candle.open, candle.close));
      const bodyHeight = Math.max(1.4, Math.abs(y(candle.open) - y(candle.close)));
      ctx.fillRect(x - Math.max(2, xStep * 0.28), bodyTop, Math.max(4, xStep * 0.56), bodyHeight);
      if (selected === index) {
        ctx.strokeStyle = "rgba(200,244,93,.85)";
        ctx.strokeRect(x - xStep * 0.48, top, xStep * 0.96, priceBottom - top);
      }
    });
    const drawLine = (values, color, toY = y, lineWidth = 1.7) => {
      ctx.beginPath();
      let started = false;
      values.forEach((value, index) => {
        if (value == null || Number.isNaN(value)) return;
        const x = left + index * xStep + xStep / 2;
        const yy = toY(value);
        if (!started) { ctx.moveTo(x, yy); started = true; } else ctx.lineTo(x, yy);
      });
      ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.stroke();
    };
    if (indicator === "ema") drawLine(movingAverage(closes, period, true), "#f7ce68", y, 2);
    if (indicator === "bollinger") {
      const mean = movingAverage(closes, period, false);
      const std = standardDeviation(closes, period, mean);
      drawLine(mean, "#f7ce68", y, 1.8);
      drawLine(mean.map((value, i) => value == null ? null : value + 2 * std[i]), "#79a7ff", y, 1.3);
      drawLine(mean.map((value, i) => value == null ? null : value - 2 * std[i]), "#79a7ff", y, 1.3);
    }
    if (indicator === "macd") {
      const fast = movingAverage(closes, 12, true);
      const slow = movingAverage(closes, 26, true);
      const macd = closes.map((_, i) => fast[i] == null || slow[i] == null ? null : fast[i] - slow[i]);
      const signalInput = macd.map((v) => v ?? 0);
      const signal = movingAverage(signalInput, 9, true).map((v, i) => macd[i] == null ? null : v);
      const valid = [...macd.filter((v) => v != null), ...signal.filter((v) => v != null), 0];
      const lo = Math.min(...valid); const hi = Math.max(...valid);
      const iy = (value) => height - 12 - (value - lo) / ((hi - lo) || 1) * (lowerHeight - 22);
      ctx.strokeStyle = "rgba(170,199,210,.2)"; ctx.beginPath(); ctx.moveTo(left, iy(0)); ctx.lineTo(width - right, iy(0)); ctx.stroke();
      drawLine(macd, "#65dcb2", iy, 1.5); drawLine(signal, "#f7ce68", iy, 1.4);
    }
    if (indicator === "rsi") {
      const rsi = rsiValues(closes, period);
      const iy = (value) => priceBottom + 15 + (100 - value) / 100 * (lowerHeight - 22);
      [30, 70].forEach((level) => { ctx.strokeStyle = "rgba(170,199,210,.22)"; ctx.beginPath(); ctx.moveTo(left, iy(level)); ctx.lineTo(width - right, iy(level)); ctx.stroke(); });
      drawLine(rsi, "#c8f45d", iy, 1.6);
    }
    document.getElementById("indicatorLegend").textContent = `${indicator === "bollinger" ? "Bollinger Bands" : indicator.toUpperCase()} · ${period}`;
  }

  function renderNotFound() {
    app.innerHTML = `<section class="not-found"><b>404</b><h1>这个知识点还没进入目录</h1><p>可以返回首页搜索中文名称、英文名或缩写。</p><a class="primary-button" href="#/">返回金融百科</a></section>`;
  }

  function updateActiveSidebar(categoryId) {
    document.querySelectorAll(".side-link").forEach((link) => link.classList.toggle("active", link.dataset.categoryId === categoryId));
  }

  function closeMobileSidebar() {
    sidebar.classList.remove("open");
    backdrop.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  function route() {
    if (marketLab) marketLab = null;
    const raw = location.hash.replace(/^#\/?/, "");
    const parts = raw.split("/").filter(Boolean);
    const page = parts[0] || "home";
    const id = parts[1];
    let activeCategory = null;
    if (page === "home") renderHome();
    else if (page === "category" && categoryMap.has(id)) {
      renderCategory(categoryMap.get(id));
      activeCategory = id;
    } else if (page === "knowledge" && termMap.has(id)) {
      const term = termMap.get(id);
      renderArticle(term);
      activeCategory = term.category.id;
    } else if (page === "map") renderMap();
    else if (page === "day") renderDay();
    else if (page === "tools") renderTools();
    else renderNotFound();
    updateActiveSidebar(activeCategory);
    closeMobileSidebar();
    closeCommand();
    searchResults.hidden = true;
    globalSearch.value = "";
    window.scrollTo(0, 0);
  }

  globalSearch.addEventListener("input", updateHeaderResults);
  globalSearch.addEventListener("focus", () => {
    if (window.innerWidth <= 820) openCommand("");
    else updateHeaderResults();
  });
  document.querySelector(".header-search").addEventListener("click", () => {
    if (window.innerWidth <= 820) openCommand("");
  });
  globalSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const first = search(globalSearch.value, 1)[0];
      if (first) location.hash = `#/knowledge/${first.id}`;
    }
    if (event.key === "Escape") searchResults.hidden = true;
  });
  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".header-search")) searchResults.hidden = true;
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault(); openCommand("");
    }
    if (event.key === "Escape" && !commandBackdrop.hidden) closeCommand();
  });
  commandSearch.addEventListener("input", () => { commandSelection = 0; updateCommandResults(); });
  commandSearch.addEventListener("keydown", (event) => {
    const results = commandSearch.value.trim() ? search(commandSearch.value, 14) : data.featured.map((id) => termMap.get(id)).filter(Boolean);
    if (event.key === "ArrowDown") { event.preventDefault(); commandSelection = Math.min(results.length - 1, commandSelection + 1); updateCommandResults(); }
    if (event.key === "ArrowUp") { event.preventDefault(); commandSelection = Math.max(0, commandSelection - 1); updateCommandResults(); }
    if (event.key === "Enter" && results[commandSelection]) { location.hash = `#/knowledge/${results[commandSelection].id}`; }
  });
  commandBackdrop.addEventListener("pointerdown", (event) => { if (event.target === commandBackdrop) closeCommand(); });
  menuButton.addEventListener("click", () => {
    const open = !sidebar.classList.contains("open");
    sidebar.classList.toggle("open", open); backdrop.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });
  backdrop.addEventListener("click", closeMobileSidebar);
  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("finpedia-theme", next);
  });

  const savedTheme = localStorage.getItem("finpedia-theme");
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  else if (window.matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.dataset.theme = "dark";

  renderSidebar();
  window.addEventListener("hashchange", route);
  route();
})();
