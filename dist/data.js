(function () {
  const E = (id, zh, en, aliases, summary, related = [], extra = {}) => ({
    id, zh, en, aliases, summary, related, ...extra
  });
  const G = (id, zh, en, description, items) => ({ id, zh, en, description, items });
  const C = (id, zh, en, symbol, domain, description, groups) => ({ id, zh, en, symbol, domain, description, groups });

  const categories = [
    C("stocks", "股票", "Stocks", "股", "products", "从股权、发行市场到交易、公司行为与估值方法。", [
      G("stock-basics", "股票基础", "Stock basics", "先理解股票代表的权利与常见类型。", [
        E("what-is-stock", "股票是什么", "Stock", ["equity", "股份"], "股票是公司所有权的一小部分，持有人可分享企业价值变化并承担相应风险。", ["common-stock", "shareholder", "market-cap"]),
        E("share", "股份", "Share", ["股权单位"], "股份是公司资本被划分后的基本所有权单位。", ["what-is-stock", "shareholder"]),
        E("common-stock", "普通股", "Common Stock", ["ordinary share"], "普通股通常带有表决权，分红和清算顺序位于债权人与优先股之后。", ["preferred-stock", "dividend"]),
        E("preferred-stock", "优先股", "Preferred Stock", ["Preference Share"], "优先股通常优先领取约定股息，但表决权可能受限。", ["common-stock", "dividend"]),
        E("shareholder", "股东", "Shareholder", ["stockholder"], "股东是持有公司股份并享有相应经济或治理权利的人或机构。", ["share", "dividend"]),
        E("market-cap", "市值", "Market Capitalization", ["market cap", "总市值"], "市值等于股价乘以流通在外股份数，用于衡量上市公司的市场规模。", ["stock-price", "large-cap"]),
        E("ticker", "股票代码", "Ticker Symbol", ["证券代码", "ticker"], "股票代码是交易所用来唯一识别上市证券的简称或字符组合。", ["exchange"])
      ]),
      G("stock-market", "股票市场", "Stock market", "理解股票如何发行、流通与退出。", [
        E("primary-market", "一级市场", "Primary Market", ["发行市场"], "一级市场是证券首次或新增发行并募集资金的市场。", ["ipo", "secondary-market"]),
        E("secondary-market", "二级市场", "Secondary Market", ["流通市场"], "二级市场让已发行证券在投资者之间持续交易。", ["primary-market", "exchange"]),
        E("ipo", "首次公开募股", "IPO", ["上市", "initial public offering"], "IPO是公司首次向公众发行股票并进入公开市场交易的过程。", ["primary-market", "underwriter"]),
        E("seasoned-offering", "增发", "Seasoned Offering", ["secondary offering", "再融资"], "增发是上市公司在IPO后再次发行股份融资。", ["rights-issue", "dilution"]),
        E("rights-issue", "配股", "Rights Issue", ["供股"], "配股按持股比例给予老股东以指定价格认购新股的权利。", ["seasoned-offering", "dilution"]),
        E("delisting", "退市", "Delisting", ["摘牌"], "退市指证券停止在交易所挂牌交易，可能是主动选择或不再满足上市条件。", ["exchange", "liquidity"])
      ]),
      G("stock-trading", "股票交易", "Stock trading", "订单、方向、价格和成交机制。", [
        E("buy-order", "买入", "Buy", ["买单"], "买入是以现金换取证券头寸的交易行为。", ["sell-order", "long-position"]),
        E("sell-order", "卖出", "Sell", ["卖单"], "卖出是转让持有证券或建立空头头寸的交易行为。", ["buy-order", "short-selling"]),
        E("long-position", "做多", "Long", ["多头", "long position"], "做多表示持有价格上涨时受益的头寸。", ["short-selling", "leverage"]),
        E("short-selling", "做空", "Short Selling", ["卖空", "空头"], "做空通常先借入并卖出资产，希望未来以更低价格买回。", ["long-position", "borrow-cost"]),
        E("market-order", "市价单", "Market Order", ["market"], "市价单优先立即成交，但最终价格可能与下单时看到的价格不同。", ["limit-order", "slippage"]),
        E("limit-order", "限价单", "Limit Order", ["limit"], "限价单只会在指定价格或更优价格成交，但不保证成交。", ["market-order", "order-book"]),
        E("stop-order", "止损单", "Stop Order", ["stop loss", "止损"], "止损单在触发价达到后转化为预设订单，用于限制损失或追随突破。", ["market-order", "gap"]),
        E("volume", "成交量", "Volume", ["交易量"], "成交量是在一定期间内完成交易的证券数量。", ["obv", "open-interest"]),
        E("price-limit", "涨跌停", "Price Limit", ["limit up", "limit down"], "涨跌停是交易所对单日价格最大变动幅度设定的限制。", ["volatility", "liquidity"])
      ]),
      G("corporate-actions", "公司行为", "Corporate actions", "会改变股本、现金流或持股结构的公司决定。", [
        E("dividend", "分红", "Dividend", ["股息", "派息"], "分红是公司把部分利润或储备以现金或股票形式分配给股东。", ["dividend-yield", "ex-dividend"]),
        E("buyback", "股票回购", "Share Buyback", ["repurchase"], "股票回购是公司从市场买回自身股份，可能减少流通股数。", ["eps", "market-cap"]),
        E("stock-split", "拆股", "Stock Split", ["拆细"], "拆股按比例增加股份数并降低每股价格，不直接改变公司总价值。", ["reverse-split", "market-cap"]),
        E("reverse-split", "合股", "Reverse Stock Split", ["并股"], "合股按比例减少股份数并提高每股价格，不直接改变总持仓价值。", ["stock-split", "delisting"])
      ]),
      G("stock-valuation", "股票估值", "Equity valuation", "把利润、资产、销售与现金流转化为估值判断。", [
        E("eps", "每股收益", "EPS", ["earnings per share"], "EPS等于归属于普通股股东的利润除以加权平均股数。", ["pe", "buyback"]),
        E("pe", "市盈率", "P/E Ratio", ["PE", "price earnings"], "市盈率用股价除以每股收益，反映市场为每单位盈利支付的价格。", ["eps", "peg"]),
        E("pb", "市净率", "P/B Ratio", ["PB", "price to book"], "市净率用股价除以每股净资产，常用于资产驱动型企业比较。", ["roe", "book-value"]),
        E("ps", "市销率", "P/S Ratio", ["PS", "price to sales"], "市销率比较公司市值与收入，适合利润尚不稳定但有销售规模的企业。", ["revenue-growth", "gross-margin"]),
        E("peg", "PEG比率", "PEG Ratio", ["市盈增长比"], "PEG用市盈率除以预期盈利增速，尝试把估值与成长结合。", ["pe", "growth-stock"]),
        E("roe", "净资产收益率", "ROE", ["return on equity"], "ROE衡量公司利用股东权益创造净利润的效率。", ["roa", "pb"]),
        E("roa", "总资产收益率", "ROA", ["return on assets"], "ROA衡量公司利用全部资产创造净利润的效率。", ["roe", "asset-turnover"]),
        E("dcf", "现金流折现", "DCF", ["discounted cash flow"], "DCF把未来预期现金流按风险与时间价值折算为今天的价值。", ["wacc", "terminal-value"])
      ]),
      G("stock-styles", "股票分类", "Stock styles", "按规模、成长与周期属性理解股票。", [
        E("blue-chip", "蓝筹股", "Blue-chip Stock", ["蓝筹"], "蓝筹股通常指规模大、经营成熟、财务记录较稳定的公司股票。", ["large-cap", "dividend"]),
        E("growth-stock", "成长股", "Growth Stock", ["高成长股"], "成长股的收入或利润预期高于市场平均，但估值往往也更高。", ["value-stock", "peg"]),
        E("value-stock", "价值股", "Value Stock", ["低估值股"], "价值股通常相对基本面以较低估值交易。", ["growth-stock", "pe"]),
        E("cyclical-stock", "周期股", "Cyclical Stock", ["周期性股票"], "周期股盈利对经济周期和商品价格变化更敏感。", ["defensive-stock", "economic-cycle"]),
        E("defensive-stock", "防御股", "Defensive Stock", ["非周期股"], "防御股需求相对稳定，通常对经济波动敏感度较低。", ["cyclical-stock", "beta"]),
        E("small-cap", "小盘股", "Small Cap", ["小市值股票"], "小盘股按市值处于较小区间，增长空间与波动风险通常都较高。", ["market-cap", "large-cap"]),
        E("mid-cap", "中盘股", "Mid Cap", ["中市值股票"], "中盘股在规模与成长阶段上通常位于小盘股和大盘股之间。", ["small-cap", "large-cap"]),
        E("large-cap", "大盘股", "Large Cap", ["大市值股票"], "大盘股指市值较大的成熟上市公司股票。", ["market-cap", "blue-chip"])
      ])
    ]),

    C("bonds", "债券", "Bonds", "债", "products", "按发行人、付息方式与特殊条款建立完整债券知识体系。", [
      G("government-bonds", "政府债券", "Government bonds", "由主权或地方公共部门发行的债务工具。", [
        E("treasury-bond", "国债", "Treasury Bond", ["中央政府债券", "government bond", "T-bond"], "国债是中央政府为融资而发行、并以政府信用承担偿付责任的债券。", ["government-bond", "yield-curve", "duration"]),
        E("local-government-bond", "地方政府债券", "Local Government Bond", ["地方债", "省债"], "地方政府债券由地方政府或授权主体发行，用于公共支出和项目融资。", ["municipal-bond", "credit-rating"]),
        E("municipal-bond", "市政债券", "Municipal Bond", ["municipal", "muni"], "市政债券通常由城市或地方公共机构发行，用于基础设施与公共服务。", ["local-government-bond", "tax-exempt-bond"]),
        E("agency-bond", "政府机构债券", "Agency Bond", ["政府支持机构债"], "政府机构债券由政府机构或政府支持企业发行，其担保程度需按具体发行条款判断。", ["treasury-bond", "credit-spread"]),
        E("sovereign-bond", "主权债券", "Sovereign Bond", ["主权债"], "主权债券由国家政府发行，可能以本币或外币计价。", ["country-risk", "foreign-bond"])
      ]),
      G("corporate-bonds", "企业与金融债券", "Corporate & financial bonds", "企业和金融机构以信用融资的主要工具。", [
        E("corporate-bond", "公司债", "Corporate Bond", ["公司债券"], "公司债是企业为筹集资金而发行、承诺付息和还本的债务证券。", ["credit-rating", "credit-spread"]),
        E("enterprise-bond", "企业债", "Enterprise Bond", ["产业债"], "企业债在部分法域有特定监管含义，核心仍是企业发行的债务融资工具。", ["corporate-bond", "financial-bond"]),
        E("financial-bond", "金融债", "Financial Bond", ["金融机构债券"], "金融债由银行或其他金融机构发行，用于补充资金来源或资本。", ["bank-bond", "subordinated-bond"]),
        E("bank-bond", "银行债券", "Bank Bond", ["银行债"], "银行债券是商业银行发行的债务工具，其偿付顺序与资本属性由条款决定。", ["financial-bond", "subordinated-bond"]),
        E("investment-grade-bond", "投资级债券", "Investment-grade Bond", ["IG bond"], "投资级债券的信用评级高于约定门槛，预期违约风险相对较低。", ["high-yield-bond", "credit-rating"]),
        E("high-yield-bond", "高收益债券", "High-yield Bond", ["junk bond", "垃圾债"], "高收益债券信用评级较低，以更高收益率补偿较高信用风险。", ["investment-grade-bond", "default-risk"]),
        E("subordinated-bond", "次级债券", "Subordinated Bond", ["次级债"], "次级债在破产清算时偿付顺序低于高级债权，因此风险和收益通常更高。", ["seniority", "bank-bond"]),
        E("perpetual-bond", "永续债", "Perpetual Bond", ["无到期债券"], "永续债通常没有固定到期日，发行人按条款持续付息，并可能拥有赎回权。", ["callable-bond", "financial-bond"]),
        E("contingent-convertible", "可转换资本工具", "Contingent Convertible", ["CoCo", "AT1"], "可转换资本工具在触发资本条件时可能转股或减记，以吸收金融机构损失。", ["convertible-bond", "bank-capital"])
      ]),
      G("international-bonds", "国际债券", "International bonds", "在发行人本国之外或跨币种发行的债券。", [
        E("eurobond", "欧洲债券", "Eurobond", ["离岸债券"], "欧洲债券是在计价货币所属国家之外发行的国际债券，并不等同于欧元债券。", ["foreign-bond", "currency-risk"]),
        E("foreign-bond", "外国债券", "Foreign Bond", ["扬基债", "武士债"], "外国债券由境外发行人在当地市场、以当地货币发行。", ["eurobond", "sovereign-bond"])
      ]),
      G("bond-interest", "按利息方式", "Coupon structures", "现金流如何随时间和利率变化。", [
        E("fixed-rate-bond", "固定利率债券", "Fixed-rate Bond", ["固定息票债"], "固定利率债券按预先约定的票面利率支付利息。", ["coupon-rate", "interest-rate-risk"]),
        E("floating-rate-note", "浮动利率债券", "Floating-rate Note", ["FRN", "浮息债"], "浮息债的票息按参考利率加点定期重设。", ["reference-rate", "credit-spread"]),
        E("zero-coupon-bond", "零息债券", "Zero-coupon Bond", ["贴现债"], "零息债不定期付息，通常折价发行并在到期时按面值偿还。", ["discount-rate", "ytm"]),
        E("inflation-linked-bond", "通胀挂钩债券", "Inflation-linked Bond", ["TIPS", "抗通胀债券"], "通胀挂钩债券的本金或利息随物价指数调整。", ["inflation", "real-yield"])
      ]),
      G("bond-structures", "特殊结构", "Special structures", "嵌入选择权会改变债券现金流与风险。", [
        E("convertible-bond", "可转换债券", "Convertible Bond", ["可转债"], "可转换债券允许持有人按约定条件转换为发行人股票。", ["conversion-ratio", "contingent-convertible"]),
        E("callable-bond", "可赎回债券", "Callable Bond", ["发行人赎回权"], "可赎回债允许发行人在指定日期和价格提前偿还。", ["puttable-bond", "reinvestment-risk"]),
        E("puttable-bond", "可回售债券", "Puttable Bond", ["投资者回售权"], "可回售债允许持有人按约定条件要求发行人提前偿还。", ["callable-bond", "embedded-option"]),
        E("structured-note", "结构化债券", "Structured Note", ["结构性票据"], "结构化债券把债务工具与衍生品收益规则组合，回报取决于挂钩资产。", ["derivative", "principal-protection"])
      ]),
      G("bond-core", "债券核心知识", "Bond essentials", "定价、收益与风险的通用语言。", [
        E("face-value", "面值", "Face Value", ["par value", "本金"], "面值是发行人到期通常应偿还的名义本金，也是票息计算基础。", ["coupon-rate", "maturity"]),
        E("coupon-rate", "票面利率", "Coupon Rate", ["票息率"], "票面利率是年度票息相对于债券面值的比例。", ["face-value", "current-yield"]),
        E("maturity", "到期日", "Maturity Date", ["期限"], "到期日是发行人按条款偿还本金并结束债务关系的日期。", ["face-value", "duration"]),
        E("bond-price", "债券价格", "Bond Price", ["净价", "全价"], "债券价格是未来本金和票息按市场要求收益率折现后的现值。", ["ytm", "interest-rate-risk"]),
        E("ytm", "到期收益率", "Yield to Maturity", ["YTM", "到期殖利率"], "YTM是假设持有至到期且票息按同一收益率再投资时，使现金流现值等于市场价格的折现率。", ["bond-price", "current-yield", "yield-curve"]),
        E("current-yield", "当前收益率", "Current Yield", ["当期收益率"], "当前收益率等于年度票息除以当前债券价格，不包含资本利得与时间价值。", ["coupon-rate", "ytm"]),
        E("duration", "久期", "Duration", ["Macaulay duration", "麦考利久期"], "久期衡量债券现金流回收时间，并可用来近似利率变化对价格的影响。", ["modified-duration", "convexity"]),
        E("modified-duration", "修正久期", "Modified Duration", ["mod duration"], "修正久期近似表示收益率变动1个百分点时债券价格的百分比变化。", ["duration", "convexity"]),
        E("convexity", "凸性", "Convexity", ["bond convexity"], "凸性描述债券价格与收益率关系的弯曲程度，用来修正久期的线性近似。", ["duration", "interest-rate-risk"]),
        E("credit-rating", "信用评级", "Credit Rating", ["债项评级"], "信用评级是评级机构对发行人或债务工具偿付能力的分级意见。", ["default-risk", "credit-spread"]),
        E("credit-spread", "信用利差", "Credit Spread", ["利差"], "信用利差是信用债收益率相对基准无风险利率的额外补偿。", ["credit-rating", "default-risk"]),
        E("interest-rate-risk", "利率风险", "Interest-rate Risk", ["利率敏感性"], "利率风险是市场利率变化导致债券价格或再投资收益变化的风险。", ["duration", "yield-curve"]),
        E("default-risk", "违约风险", "Default Risk", ["信用违约风险"], "违约风险是发行人不能按时足额支付利息或本金的可能性。", ["credit-rating", "recovery-rate"]),
        E("yield-curve", "收益率曲线", "Yield Curve", ["期限结构", "利率曲线"], "收益率曲线展示同类信用质量债券在不同期限上的收益率。", ["treasury-bond", "inverted-yield-curve"])
      ])
    ]),

    C("funds", "基金", "Funds", "基", "products", "理解集合投资工具、运作方式、费用和绩效指标。", [
      G("fund-types", "基金类型", "Fund types", "按募集方式、管理方式和投资范围分类。", [
        E("public-fund", "公募基金", "Public Fund", ["共同基金", "mutual fund"], "公募基金面向公众募集并按监管要求进行信息披露。", ["private-fund", "nav"]),
        E("private-fund", "私募基金", "Private Fund", ["私募证券基金"], "私募基金面向合格投资者非公开募集，策略与流动性安排较灵活。", ["public-fund", "hedge-fund"]),
        E("index-fund", "指数基金", "Index Fund", ["被动指数基金"], "指数基金以复制某个指数表现为主要目标。", ["etf", "tracking-error"]),
        E("active-fund", "主动基金", "Active Fund", ["主动管理"], "主动基金由管理人选股、择时或配置，目标通常是超越基准。", ["passive-fund", "benchmark"]),
        E("passive-fund", "被动基金", "Passive Fund", ["被动管理"], "被动基金按规则复制指数或资产组合，通常交易频率和费用较低。", ["active-fund", "index-fund"]),
        E("equity-fund", "股票基金", "Equity Fund", ["股票型基金"], "股票基金把大部分资产投资于股票，风险与收益主要来自权益市场。", ["bond-fund", "mixed-fund"]),
        E("bond-fund", "债券基金", "Bond Fund", ["债基"], "债券基金主要投资债券和货币市场工具，仍会受到利率与信用风险影响。", ["equity-fund", "duration"]),
        E("mixed-fund", "混合基金", "Balanced Fund", ["混合型基金"], "混合基金同时配置股票、债券等资产，比例由合同或管理人决定。", ["asset-allocation", "equity-fund"]),
        E("money-market-fund", "货币基金", "Money Market Fund", ["货基"], "货币基金投资短期限、高流动性的货币市场工具，不等同于银行存款。", ["liquidity", "short-term-rate"]),
        E("fof", "基金中基金", "Fund of Funds", ["FOF"], "FOF通过持有其他基金实现管理人和策略分散。", ["diversification", "management-fee"]),
        E("hedge-fund", "对冲基金", "Hedge Fund", ["alternative fund"], "对冲基金通常面向专业投资者，可能采用杠杆、卖空和衍生品等灵活策略。", ["private-fund", "leverage"])
      ]),
      G("fund-operations", "基金运作", "Fund operations", "净值、申赎、费用与管理角色。", [
        E("nav", "基金净值", "NAV", ["net asset value", "单位净值"], "NAV等于基金资产公允价值减负债后，再除以基金份额数。", ["subscription", "redemption"]),
        E("subscription", "申购", "Subscription", ["认购", "买基金"], "申购是投资者按规则购买基金份额的过程。", ["redemption", "nav"]),
        E("redemption", "赎回", "Redemption", ["卖基金"], "赎回是投资者把基金份额交回基金并取得相应款项。", ["subscription", "liquidity"]),
        E("management-fee", "管理费", "Management Fee", ["基金管理费"], "管理费是基金向管理人支付的持续费用，通常按资产规模计提。", ["custody-fee", "expense-ratio"]),
        E("custody-fee", "托管费", "Custody Fee", ["保管费"], "托管费是基金为资产保管、清算与监督服务支付的费用。", ["management-fee", "custodian"]),
        E("fund-manager", "基金经理", "Fund Manager", ["portfolio manager"], "基金经理负责按产品目标进行研究、配置与交易决策。", ["active-fund", "benchmark"]),
        E("benchmark", "业绩基准", "Benchmark", ["基准指数"], "业绩基准是用于评价投资组合表现和风险暴露的参照标准。", ["tracking-error", "alpha"])
      ]),
      G("fund-metrics", "基金指标", "Fund metrics", "评价收益、风险和复制质量。", [
        E("tracking-error", "跟踪误差", "Tracking Error", ["追踪误差"], "跟踪误差衡量基金相对基准超额收益的波动程度。", ["benchmark", "information-ratio"]),
        E("sharpe-ratio", "夏普比率", "Sharpe Ratio", ["Sharpe", "夏普"], "夏普比率用组合超额收益除以收益波动率，衡量每单位总风险的回报。", ["volatility", "sortino-ratio"]),
        E("maximum-drawdown", "最大回撤", "Maximum Drawdown", ["MDD", "最大跌幅"], "最大回撤是资产净值从阶段高点到随后低点的最大百分比损失。", ["drawdown", "risk-management"]),
        E("expense-ratio", "总费率", "Expense Ratio", ["基金费用率"], "总费率表示基金每年运营费用占平均资产的比例。", ["management-fee", "tracking-error"])
      ])
    ]),

    C("etfs", "ETF", "Exchange-traded Funds", "E", "products", "交易所交易基金的结构、交易、复制方式与特有风险。", [
      G("etf-basics", "ETF基础", "ETF basics", "ETF如何连接基金净值与交易所价格。", [
        E("etf", "交易所交易基金", "ETF", ["Exchange Traded Fund", "指数ETF"], "ETF是在交易所实时交易的开放式基金，通常跟踪指数或特定资产篮子。", ["creation-redemption", "tracking-error", "nav"]),
        E("creation-redemption", "申购赎回机制", "Creation & Redemption", ["一级市场申赎"], "授权参与者用一篮子资产与ETF份额互换，帮助市场价格靠近净值。", ["authorized-participant", "etf-premium-discount"]),
        E("authorized-participant", "授权参与者", "Authorized Participant", ["AP"], "授权参与者是可直接与基金进行大额ETF份额创设和赎回的机构。", ["creation-redemption", "market-maker"]),
        E("etf-premium-discount", "ETF折溢价", "ETF Premium/Discount", ["折价", "溢价"], "ETF市场价高于净值为溢价，低于净值为折价。", ["nav", "arbitrage"]),
        E("intraday-nav", "盘中估值", "Indicative NAV", ["iNAV", "IOPV"], "盘中估值是根据成分资产价格估算的ETF实时参考净值。", ["nav", "etf-premium-discount"])
      ]),
      G("etf-types", "ETF类型", "ETF types", "按资产与策略规则分类。", [
        E("equity-etf", "股票ETF", "Equity ETF", ["宽基ETF", "行业ETF"], "股票ETF持有股票组合，可覆盖宽基、行业、主题、因子或地区。", ["bond-etf", "index-fund"]),
        E("bond-etf", "债券ETF", "Bond ETF", ["固收ETF"], "债券ETF以一篮子债券为底层资产并在交易所交易。", ["equity-etf", "duration"]),
        E("commodity-etf", "商品ETF", "Commodity ETF", ["黄金ETF"], "商品ETF通过现货、期货或相关证券提供商品价格敞口。", ["futures-roll", "gold-etf"]),
        E("leveraged-etf", "杠杆ETF", "Leveraged ETF", ["倍数ETF"], "杠杆ETF通常追求指数单日回报的固定倍数，长期表现会受复利路径影响。", ["inverse-etf", "volatility-drag"]),
        E("inverse-etf", "反向ETF", "Inverse ETF", ["做空ETF"], "反向ETF通常追求指数单日回报的反方向表现。", ["leveraged-etf", "short-selling"]),
        E("smart-beta-etf", "Smart Beta ETF", "Smart Beta ETF", ["因子ETF"], "Smart Beta ETF用透明规则配置价值、动量、质量等因子。", ["factor-investing", "benchmark"])
      ])
    ]),

    C("forex", "外汇", "Foreign Exchange", "汇", "products", "货币对、汇率制度、交易报价与外汇风险。", [
      G("forex-basics", "外汇基础", "FX basics", "读懂货币对和报价。", [
        E("currency-pair", "货币对", "Currency Pair", ["FX pair"], "货币对用一种货币表示另一种货币的价格，如EUR/USD。", ["base-currency", "quote-currency"]),
        E("base-currency", "基础货币", "Base Currency", ["基准货币"], "基础货币是货币对中位于前面的货币。", ["quote-currency", "currency-pair"]),
        E("quote-currency", "计价货币", "Quote Currency", ["counter currency"], "计价货币是货币对中用于表示基础货币价值的后一个货币。", ["base-currency", "currency-pair"]),
        E("fx-spot", "外汇现货", "FX Spot", ["spot FX"], "外汇现货是按当前汇率约定近期交割两种货币的交易。", ["fx-forward", "currency-pair"]),
        E("fx-forward", "外汇远期", "FX Forward", ["远期结售汇"], "外汇远期约定未来日期按预定汇率交换两种货币。", ["fx-spot", "forward-contract"]),
        E("pip", "点", "Pip", ["外汇点值"], "Pip是外汇报价的标准最小变动单位之一，具体位数依货币对而定。", ["pip-value", "spread"]),
        E("pip-value", "点值", "Pip Value", ["每点价值"], "点值表示货币对变动一个pip时，特定仓位产生的盈亏金额。", ["pip", "position-size"])
      ]),
      G("forex-market", "外汇市场", "FX market", "参与者、利率与汇率风险。", [
        E("major-pairs", "主要货币对", "Major Pairs", ["直盘"], "主要货币对通常包含美元并具有较高交易量和流动性。", ["cross-pairs", "liquidity"]),
        E("cross-pairs", "交叉货币对", "Cross Pairs", ["交叉盘"], "交叉货币对不包含美元，如EUR/GBP。", ["major-pairs", "currency-pair"]),
        E("carry-trade", "套息交易", "Carry Trade", ["利差交易"], "套息交易借入低利率货币并持有高利率货币，收益会受汇率变化影响。", ["interest-rate-differential", "currency-risk"]),
        E("currency-risk", "汇率风险", "Currency Risk", ["外汇风险"], "汇率风险是货币价值变化导致资产、负债或现金流本币价值波动的风险。", ["hedging", "fx-forward"]),
        E("central-bank-intervention", "央行干预", "FX Intervention", ["外汇干预"], "央行干预是货币当局通过交易或政策信号影响汇率。", ["monetary-policy", "exchange-rate-regime"]),
        E("exchange-rate-regime", "汇率制度", "Exchange-rate Regime", ["固定汇率", "浮动汇率"], "汇率制度规定一国货币相对其他货币如何形成和调整价格。", ["central-bank-intervention", "currency-peg"])
      ])
    ]),

    C("cfd", "CFD", "Contracts for Difference", "差", "derivatives", "差价合约的交易机制、费用、风险与经纪商市场结构。", [
      G("cfd-basics", "CFD基础", "CFD basics", "先理解差价结算而非资产交割。", [
        E("cfd", "差价合约", "CFD", ["Contract for Difference", "差价交易"], "CFD是按开仓与平仓价格差额进行现金结算的杠杆衍生品，通常不取得底层资产所有权。", ["leverage", "margin", "cfd-vs-stock"]),
        E("cfd-mechanics", "CFD工作原理", "How CFD Works", ["CFD机制"], "CFD盈亏由价格变动、合约规模、方向及费用共同决定。", ["cfd", "position-size"]),
        E("cfd-vs-stock", "CFD与股票区别", "CFD vs Stock", ["差价合约和股票"], "股票通常代表所有权，CFD则是与提供商结算价差的合约。", ["cfd", "what-is-stock"]),
        E("cfd-vs-futures", "CFD与期货区别", "CFD vs Futures", ["差价合约和期货"], "CFD多为场外合约，期货通常在交易所标准化交易并有明确到期规则。", ["cfd", "futures-contract"])
      ]),
      G("cfd-mechanism", "交易机制", "Trading mechanics", "方向、杠杆与保证金。", [
        E("leverage", "杠杆", "Leverage", ["倍数", "gearing"], "杠杆允许用较少保证金控制更大的名义头寸，也会同比放大盈亏。", ["margin", "liquidation", "position-size"]),
        E("margin", "保证金", "Margin", ["交易保证金"], "保证金是为建立和维持杠杆头寸而占用的资金，并不是交易手续费。", ["initial-margin", "maintenance-margin", "leverage"]),
        E("initial-margin", "初始保证金", "Initial Margin", ["开仓保证金"], "初始保证金是建立新头寸时需要满足的最低资金要求。", ["margin", "maintenance-margin"]),
        E("maintenance-margin", "维持保证金", "Maintenance Margin", ["最低保证金"], "维持保证金是头寸继续保持开放所需的最低权益门槛。", ["margin-call", "liquidation"])
      ]),
      G("cfd-costs", "交易成本", "Trading costs", "看得见和看不见的持仓成本。", [
        E("spread", "点差", "Spread", ["买卖价差", "bid ask spread"], "点差是买价与卖价之间的差额，是交易立即产生的隐含成本。", ["commission", "liquidity"]),
        E("commission", "交易手续费", "Commission", ["佣金"], "Commission是按手数、名义金额或每笔交易收取的明确费用。", ["spread", "transaction-cost"]),
        E("swap-fee", "隔夜利息", "Swap / Overnight Fee", ["swap", "持仓费", "库存费"], "隔夜利息是杠杆头寸跨过结算时点可能产生的融资收付。", ["financing-rate", "carry-trade"])
      ]),
      G("cfd-risks", "CFD风险", "CFD risks", "杠杆头寸最需要监控的失败路径。", [
        E("forced-liquidation", "强制平仓", "Forced Liquidation", ["强平", "爆仓"], "强制平仓是账户权益跌破平台规则时，系统主动关闭部分或全部头寸。", ["liquidation", "margin-call", "maintenance-margin"]),
        E("margin-call", "追加保证金通知", "Margin Call", ["追保", "保证金预警"], "Margin Call表示账户权益接近或低于维持要求，需要补充资金或降低头寸。", ["maintenance-margin", "forced-liquidation"]),
        E("slippage", "滑点", "Slippage", ["成交滑点"], "滑点是预期成交价与实际成交价之间的差异，常见于波动或流动性不足时。", ["market-order", "liquidity"]),
        E("gap", "跳空", "Price Gap", ["gap risk", "价格缺口"], "跳空是相邻可成交价格之间出现明显缺口，止损单可能跨价成交。", ["slippage", "stop-order"]),
        E("liquidity-risk", "流动性风险", "Liquidity Risk", ["市场深度风险"], "流动性风险是难以及时按合理价格成交或退出头寸的可能性。", ["spread", "slippage"])
      ]),
      G("cfd-structure", "CFD市场结构", "Market structure", "经纪商、流动性与订单处理模式。", [
        E("broker", "经纪商", "Broker", ["券商", "外汇平台"], "经纪商为客户提供交易接入、报价、清算或订单传递服务。", ["liquidity-provider", "market-maker"]),
        E("liquidity-provider", "流动性提供商", "Liquidity Provider", ["LP"], "流动性提供商向交易场所或经纪商提供可成交报价和市场深度。", ["broker", "market-maker"]),
        E("market-maker", "做市商", "Market Maker", ["MM", "做市"], "做市商持续提供买卖报价并承担库存风险，以改善市场流动性。", ["liquidity-provider", "spread"]),
        E("ecn", "电子通讯网络", "ECN", ["Electronic Communication Network"], "ECN通过电子系统撮合多个参与者的订单或报价。", ["stp", "order-book"]),
        E("stp", "直通式处理", "STP", ["Straight Through Processing"], "STP通常指订单以自动化方式传递至外部执行或流动性来源。", ["ecn", "a-book"]),
        E("a-book", "A-Book", "A-Book", ["外抛", "agency model"], "A-Book通常指经纪商把客户订单风险传递给外部流动性来源。", ["b-book", "stp"]),
        E("b-book", "B-Book", "B-Book", ["内部化", "principal model"], "B-Book通常指经纪商在内部承接或净额管理客户头寸风险。", ["a-book", "market-maker"])
      ])
    ]),

    C("futures", "期货", "Futures", "期", "derivatives", "标准化合约、保证金、期限结构与套保交易。", [
      G("futures-types", "期货品种", "Futures markets", "商品与金融期货的主要类别。", [
        E("commodity-futures", "商品期货", "Commodity Futures", ["商品合约"], "商品期货以能源、金属或农产品等实物商品为标的。", ["financial-futures", "delivery"]),
        E("financial-futures", "金融期货", "Financial Futures", ["金融合约"], "金融期货以指数、利率、债券或货币等金融变量为标的。", ["commodity-futures", "index-futures"]),
        E("index-futures", "股指期货", "Index Futures", ["指数期货"], "股指期货以股票指数为标的，通常采用现金结算。", ["stock-index", "cash-settlement"]),
        E("gold-futures", "黄金期货", "Gold Futures", ["黄金合约"], "黄金期货是在交易所交易的标准化黄金远期交割合约。", ["gold-spot", "commodity-futures"]),
        E("oil-futures", "原油期货", "Crude Oil Futures", ["WTI", "Brent futures"], "原油期货反映特定品质与交割地点下未来原油价格。", ["commodity-futures", "contango"]),
        E("agri-futures", "农产品期货", "Agricultural Futures", ["农产品合约"], "农产品期货涵盖谷物、油籽、软商品和畜产品等。", ["commodity-futures", "seasonality"]),
        E("interest-rate-futures", "利率期货", "Interest-rate Futures", ["国债期货"], "利率期货以利率工具或债券为标的，用于管理利率风险。", ["duration", "hedging"]),
        E("currency-futures", "外汇期货", "Currency Futures", ["货币期货"], "外汇期货是在交易所标准化交易的未来货币交割合约。", ["fx-forward", "financial-futures"])
      ]),
      G("futures-core", "期货核心概念", "Futures essentials", "读懂一张期货合约。", [
        E("futures-contract", "期货合约", "Futures Contract", ["futures"], "期货合约规定未来按标准条款买卖标的资产，并由交易所集中清算。", ["contract-size", "expiry"]),
        E("contract-size", "合约规模", "Contract Size", ["乘数"], "合约规模规定每张期货合约代表多少单位标的资产。", ["tick-value", "position-size"]),
        E("tick", "最小变动价位", "Tick", ["最小跳动"], "Tick是合约报价允许变化的最小单位。", ["tick-value", "contract-size"]),
        E("tick-value", "每跳价值", "Tick Value", ["点值"], "Tick Value等于最小变动价位乘以合约规模。", ["tick", "contract-size"]),
        E("expiry", "到期", "Expiry", ["到期月"], "到期是合约停止交易并进入结算或交割程序的时间点。", ["settlement", "rollover"]),
        E("settlement", "结算", "Settlement", ["清算"], "结算是按交易所规则每日或到期确认盈亏与履约的过程。", ["variation-margin", "delivery"]),
        E("delivery", "交割", "Delivery", ["实物交割"], "交割是到期时按合约规则移交标的或完成现金差额结算。", ["cash-settlement", "expiry"]),
        E("basis", "基差", "Basis", ["现期差"], "基差通常指现货价格与期货价格之差，其定义方向需按市场惯例确认。", ["convergence", "contango"]),
        E("contango", "正向市场", "Contango", ["期货升水"], "Contango是远期或期货价格通常高于近期价格的期限结构。", ["backwardation", "futures-roll"]),
        E("backwardation", "逆向市场", "Backwardation", ["期货贴水"], "Backwardation是近期价格高于较远期限价格的期限结构。", ["contango", "convenience-yield"]),
        E("open-interest", "未平仓量", "Open Interest", ["OI", "持仓量"], "未平仓量是尚未通过反向交易、交割或到期关闭的合约数量。", ["volume", "market-sentiment"])
      ]),
      G("futures-uses", "期货交易", "Futures uses", "套保、投机与价差策略。", [
        E("hedging", "套期保值", "Hedging", ["对冲"], "套期保值用方向相反或相关的头寸降低既有价格风险。", ["speculation", "basis-risk"]),
        E("speculation", "投机", "Speculation", ["方向交易"], "投机主动承担市场风险以争取价格变化带来的收益。", ["hedging", "leverage"]),
        E("arbitrage", "套利", "Arbitrage", ["无风险套利"], "套利试图利用相关资产或市场间价格不一致获利，现实中会受到成本与执行风险限制。", ["basis", "transaction-cost"]),
        E("calendar-spread", "跨期价差", "Calendar Spread", ["月差", "time spread"], "跨期价差同时交易同一标的的不同到期月份，关注期限结构变化。", ["contango", "backwardation"])
      ])
    ]),

    C("options", "期权", "Options", "权", "derivatives", "从权利义务、定价要素、Greeks到组合策略。", [
      G("option-basics", "期权基础", "Option basics", "一张期权合约的六个基本要素。", [
        E("call-option", "看涨期权", "Call", ["call option", "认购期权"], "看涨期权给予买方在到期前后按执行价买入标的的权利。", ["put-option", "strike-price", "premium"]),
        E("put-option", "看跌期权", "Put", ["put option", "认沽期权"], "看跌期权给予买方在到期前后按执行价卖出标的的权利。", ["call-option", "strike-price", "premium"]),
        E("strike-price", "执行价", "Strike Price", ["行权价"], "执行价是期权买方行使权利时买卖标的的约定价格。", ["call-option", "moneyness"]),
        E("premium", "权利金", "Option Premium", ["期权费"], "权利金是期权买方向卖方支付的合约价格。", ["intrinsic-value", "time-value"]),
        E("expiration", "到期日", "Expiration", ["expiry date"], "到期日是期权权利终止或进行自动处理的日期。", ["time-value", "exercise"]),
        E("exercise", "行权", "Exercise", ["执行期权"], "行权是期权买方按合约条款使用买入或卖出标的的权利。", ["assignment", "expiration"]),
        E("assignment", "被指派", "Assignment", ["履约指派"], "被指派是期权卖方被要求履行相应买卖义务。", ["exercise", "option-writer"])
      ]),
      G("moneyness", "期权状态", "Moneyness", "执行价与现价的相对关系。", [
        E("itm", "价内", "ITM", ["in the money"], "价内期权若立即行权会产生正的内在价值。", ["atm", "intrinsic-value"]),
        E("atm", "平值", "ATM", ["at the money"], "平值期权的执行价接近标的现价。", ["itm", "otm"]),
        E("otm", "价外", "OTM", ["out of the money"], "价外期权若立即行权没有内在价值。", ["atm", "time-value"])
      ]),
      G("option-value", "期权价值", "Option value", "权利金由什么组成。", [
        E("intrinsic-value", "内在价值", "Intrinsic Value", ["内涵价值"], "内在价值是期权立即行权可获得的非负经济价值。", ["time-value", "itm"]),
        E("time-value", "时间价值", "Time Value", ["外在价值"], "时间价值是权利金超过内在价值的部分，反映未来有利变动的可能性。", ["theta", "implied-volatility"])
      ]),
      G("option-greeks", "Greeks", "Option Greeks", "用敏感度理解期权价格变化。", [
        E("delta", "Delta", "Delta", ["德尔塔", "Δ"], "Delta近似表示标的价格变化一个单位时，期权价格预期变化多少。", ["gamma", "option-hedging", "call-option"]),
        E("gamma", "Gamma", "Gamma", ["伽马", "Γ"], "Gamma衡量标的价格变化一个单位时Delta的变化量。", ["delta", "gamma-risk"]),
        E("theta", "Theta", "Theta", ["西塔", "Θ", "时间损耗"], "Theta近似衡量时间流逝一天对期权价值的影响，其他条件不变。", ["time-value", "expiration"]),
        E("vega", "Vega", "Vega", ["维加", "波动率敏感度"], "Vega近似衡量隐含波动率变化一个百分点对期权价格的影响。", ["implied-volatility", "volatility-smile"]),
        E("rho", "Rho", "Rho", ["柔", "利率敏感度"], "Rho近似衡量无风险利率变化一个百分点对期权价格的影响。", ["interest-rate", "option-pricing"])
      ]),
      G("option-volatility", "波动率", "Volatility", "市场历史波动与期权隐含预期。", [
        E("historical-volatility", "历史波动率", "Historical Volatility", ["HV", "realized volatility"], "历史波动率根据过去收益率计算实际价格波动程度。", ["implied-volatility", "standard-deviation"]),
        E("implied-volatility", "隐含波动率", "Implied Volatility", ["IV"], "隐含波动率是把市场期权价格代入定价模型反推出的波动率。", ["vega", "historical-volatility"]),
        E("iv-rank", "IV Rank", "IV Rank", ["隐波分位"], "IV Rank比较当前隐含波动率在一段历史区间中的相对位置。", ["implied-volatility", "iv-percentile"]),
        E("volatility-smile", "波动率微笑", "Volatility Smile", ["vol smile"], "波动率微笑表示不同执行价期权的隐含波动率并不相同。", ["implied-volatility", "volatility-skew"])
      ]),
      G("option-strategies", "期权策略", "Option strategies", "组合不同执行价和方向塑造收益结构。", [
        E("covered-call", "备兑看涨", "Covered Call", ["covered write"], "备兑看涨由持有标的并卖出看涨期权组成，以权利金换取部分上涨空间。", ["call-option", "protective-put"]),
        E("protective-put", "保护性看跌", "Protective Put", ["保险策略"], "保护性看跌由持有标的并买入看跌期权组成，为下行风险设置保护。", ["put-option", "covered-call"]),
        E("bull-call-spread", "牛市看涨价差", "Bull Call Spread", ["bull spread"], "牛市看涨价差买入较低执行价Call并卖出较高执行价Call，限制成本和最高收益。", ["call-option", "bear-put-spread"]),
        E("bear-put-spread", "熊市看跌价差", "Bear Put Spread", ["bear spread"], "熊市看跌价差买入较高执行价Put并卖出较低执行价Put。", ["put-option", "bull-call-spread"]),
        E("straddle", "跨式组合", "Straddle", ["跨式"], "跨式同时买入或卖出相同执行价和到期日的Call与Put。", ["strangle", "implied-volatility"]),
        E("strangle", "宽跨式组合", "Strangle", ["宽跨式"], "宽跨式使用不同执行价的Call与Put，成本和盈亏区间与跨式不同。", ["straddle", "implied-volatility"]),
        E("butterfly", "蝶式价差", "Butterfly", ["蝶式"], "蝶式价差用三个执行价构造有限风险、有限收益且押注特定价格区间的组合。", ["iron-condor", "gamma"]),
        E("iron-condor", "铁鹰式", "Iron Condor", ["铁秃鹰"], "铁鹰式组合两个信用价差，通常押注标的在一定区间内波动。", ["butterfly", "theta"])
      ])
    ]),

    C("crypto", "加密货币", "Cryptoassets", "链", "products", "区块链资产、钱包、交易基础设施与去中心化金融。", [
      G("crypto-assets", "加密资产", "Cryptoassets", "常见资产类别与网络单位。", [
        E("bitcoin", "比特币", "Bitcoin", ["BTC"], "比特币是一种使用分布式账本和工作量证明运行的稀缺数字资产。", ["blockchain", "mining"]),
        E("ethereum", "以太坊", "Ethereum", ["ETH"], "以太坊是支持智能合约和去中心化应用的区块链网络。", ["smart-contract", "gas-fee"]),
        E("altcoin", "山寨币", "Altcoin", ["替代币"], "Altcoin通常泛指比特币之外的其他加密资产。", ["bitcoin", "token"]),
        E("stablecoin", "稳定币", "Stablecoin", ["USDT", "USDC"], "稳定币试图通过储备、抵押或算法机制维持相对稳定的参考价值。", ["depeg-risk", "token"]),
        E("token", "代币", "Token", ["通证"], "代币是记录在区块链上的可转移价值或权利表示。", ["smart-contract", "wallet"])
      ]),
      G("crypto-infrastructure", "基础设施", "Infrastructure", "区块链、钱包与交易网络。", [
        E("blockchain", "区块链", "Blockchain", ["分布式账本"], "区块链按规则把交易记录组织成相连区块，并由网络参与者共同验证。", ["consensus", "bitcoin"]),
        E("wallet", "加密钱包", "Crypto Wallet", ["热钱包", "冷钱包"], "加密钱包管理用于控制链上资产的密钥，而不是把币实体存进设备。", ["private-key", "crypto-exchange"]),
        E("crypto-exchange", "加密交易所", "Crypto Exchange", ["CEX", "DEX"], "加密交易所为数字资产提供撮合、兑换、托管或链上交易界面。", ["wallet", "counterparty-risk"]),
        E("mining", "挖矿", "Mining", ["PoW mining"], "挖矿在工作量证明网络中通过计算竞争记账并获得区块奖励与手续费。", ["bitcoin", "consensus"]),
        E("staking", "质押", "Staking", ["PoS staking"], "质押通常指锁定代币参与权益证明网络安全并获得奖励。", ["slashing", "validator"]),
        E("defi", "去中心化金融", "DeFi", ["decentralized finance"], "DeFi用智能合约提供交易、借贷和资产管理等金融功能。", ["smart-contract", "liquidity-pool"]),
        E("gas-fee", "Gas费", "Gas Fee", ["矿工费", "网络费"], "Gas费是用户为执行区块链交易或智能合约支付的网络资源费用。", ["ethereum", "network-congestion"])
      ]),
      G("crypto-trading", "交易方式", "Trading modes", "现货、保证金和合约交易。", [
        E("crypto-spot", "加密现货", "Crypto Spot", ["spot"], "现货交易通常即时交换资产所有权，不包含合约到期或资金费率。", ["crypto-margin", "perpetual-contract"]),
        E("crypto-margin", "币圈杠杆交易", "Crypto Margin", ["margin trading"], "加密杠杆交易通过借入资金放大现货头寸，同时产生利息和清算风险。", ["leverage", "liquidation"]),
        E("crypto-futures", "加密期货", "Crypto Futures", ["交割合约"], "加密期货是以数字资产或其价格为标的、带到期结算规则的合约。", ["perpetual-contract", "futures-contract"])
      ])
    ]),

    C("perpetuals", "永续合约", "Perpetual Futures", "永", "derivatives", "无到期日的加密衍生品、资金费率与清算机制。", [
      G("perpetual-core", "永续合约基础", "Perpetual basics", "理解没有到期日的期货如何锚定现货。", [
        E("perpetual-contract", "永续合约", "Perpetual Futures", ["永续", "perp", "perpetual swap"], "永续合约是没有固定到期日的杠杆衍生品，通常通过资金费率让合约价格靠近现货指数。", ["funding-rate", "mark-price", "liquidation"]),
        E("funding-rate", "资金费率", "Funding Rate", ["funding", "资金费用"], "资金费率是多空双方按周期互相支付的费用，用于抑制永续价格长期偏离指数价格。", ["perpetual-contract", "index-price"]),
        E("mark-price", "标记价格", "Mark Price", ["mark"], "标记价格是平台用于计算未实现盈亏和清算风险的参考价格，旨在减少异常成交影响。", ["index-price", "liquidation"]),
        E("index-price", "指数价格", "Index Price", ["现货指数"], "指数价格通常由多个现货市场的价格按规则加权得到。", ["mark-price", "funding-rate"])
      ]),
      G("perpetual-margin", "保证金与清算", "Margin & liquidation", "仓位资金模式与风险终点。", [
        E("cross-margin", "全仓保证金", "Cross Margin", ["cross"], "全仓模式允许多个头寸共享账户可用保证金，风险可能在账户层面传播。", ["isolated-margin", "maintenance-margin"]),
        E("isolated-margin", "逐仓保证金", "Isolated Margin", ["isolated"], "逐仓模式把指定保证金限制在单一头寸，损失通常隔离于该仓位。", ["cross-margin", "liquidation"]),
        E("liquidation", "爆仓", "Liquidation", ["强平", "强制平仓", "爆仓价格"], "爆仓是保证金权益不足以满足维持要求时，平台按规则强制减少或关闭杠杆头寸。", ["maintenance-margin", "mark-price", "adl"]),
        E("adl", "自动减仓", "ADL", ["Auto-Deleveraging"], "ADL在保险基金等机制不足时，按规则减少对手方盈利仓位以完成风险处置。", ["liquidation", "insurance-fund"]),
        E("perp-open-interest", "永续未平仓量", "Perpetual Open Interest", ["OI"], "永续未平仓量表示尚未关闭的合约名义规模或数量。", ["open-interest", "funding-rate"])
      ])
    ]),

    C("commodities", "大宗商品", "Commodities", "商", "products", "能源、金属与农产品的供需、现货和期货结构。", [
      G("commodity-groups", "商品类别", "Commodity groups", "按经济用途与储存特征分类。", [
        E("energy-commodities", "能源商品", "Energy Commodities", ["原油", "天然气"], "能源商品包括原油、天然气、成品油、电力等，其价格受供需、库存和地缘政治影响。", ["oil-futures", "inventory"]),
        E("precious-metals", "贵金属", "Precious Metals", ["黄金", "白银"], "贵金属兼具工业、饰品和价值储藏需求。", ["gold", "silver"]),
        E("industrial-metals", "工业金属", "Industrial Metals", ["铜", "铝"], "工业金属价格与制造业、基建需求和供应瓶颈密切相关。", ["pmi", "inventory"]),
        E("agricultural-commodities", "农产品", "Agricultural Commodities", ["谷物", "软商品"], "农产品供给受天气、季节、种植面积和政策影响明显。", ["agri-futures", "seasonality"])
      ]),
      G("commodity-mechanics", "商品市场机制", "Commodity mechanics", "库存、持有成本与期货曲线。", [
        E("inventory", "库存", "Inventory", ["仓单"], "库存连接当前供需与未来预期，是商品定价的重要缓冲变量。", ["convenience-yield", "contango"]),
        E("convenience-yield", "便利收益", "Convenience Yield", ["持有便利收益"], "便利收益是持有现货而非期货带来的运营或稀缺性价值。", ["inventory", "backwardation"]),
        E("futures-roll", "期货展期", "Futures Roll", ["移仓换月"], "展期是在临近到期前关闭近月合约并建立较远月合约。", ["contango", "roll-yield"]),
        E("roll-yield", "展期收益", "Roll Yield", ["移仓收益"], "展期收益来自期货价格沿期限结构向现货收敛及换月价差。", ["futures-roll", "backwardation"])
      ])
    ]),

    C("gold", "黄金", "Gold", "金", "products", "黄金的定价驱动、交易工具与避险属性。", [
      G("gold-products", "黄金产品", "Gold products", "从实物到交易所和场外工具。", [
        E("gold", "黄金", "Gold", ["XAU", "金"], "黄金是兼具商品、货币历史与储备资产属性的贵金属。", ["gold-spot", "real-yield"]),
        E("gold-spot", "现货黄金", "Spot Gold", ["XAUUSD", "伦敦金"], "现货黄金报价反映即期黄金的市场价格，零售产品的法律结构可能不同。", ["gold-futures", "gold-cfd"]),
        E("gold-cfd", "黄金CFD", "Gold CFD", ["XAUUSD CFD"], "黄金CFD让交易者结算黄金价格变化而不持有实物黄金。", ["cfd", "gold-spot"]),
        E("gold-etf", "黄金ETF", "Gold ETF", ["实物黄金ETF"], "黄金ETF通过实物持仓、期货或相关结构提供黄金价格敞口。", ["commodity-etf", "gold-spot"]),
        E("physical-gold", "实物黄金", "Physical Gold", ["金条", "金币"], "实物黄金以金条、金币或饰品形式持有，会产生溢价、保管和流动性成本。", ["gold", "custody-risk"])
      ]),
      G("gold-drivers", "黄金定价", "Gold drivers", "利率、美元与风险偏好的共同作用。", [
        E("real-yield", "实际收益率", "Real Yield", ["实际利率"], "实际收益率近似等于名义收益率减去通胀预期，是黄金机会成本的重要变量。", ["inflation", "gold"]),
        E("safe-haven", "避险资产", "Safe-haven Asset", ["避险"], "避险资产是在市场压力期被预期更能保值或保持流动性的资产，但表现并非每次相同。", ["gold", "flight-to-quality"]),
        E("central-bank-gold", "央行黄金储备", "Central-bank Gold Reserves", ["官方黄金储备"], "央行黄金储备是官方外汇储备的一部分，其买卖会影响长期需求。", ["gold", "foreign-reserves"])
      ])
    ]),

    C("indices", "指数", "Market Indices", "指", "products", "指数编制、加权方式与投资用途。", [
      G("index-basics", "指数基础", "Index basics", "指数如何代表一篮子市场。", [
        E("stock-index", "股票指数", "Stock Index", ["股指"], "股票指数按规则汇总一组股票的价格变化，用于代表市场或板块。", ["market-cap-weighted", "index-futures"]),
        E("market-cap-weighted", "市值加权指数", "Market-cap-weighted Index", ["市值权重"], "市值加权指数按成分股可投资市值分配权重。", ["price-weighted", "free-float"]),
        E("price-weighted", "价格加权指数", "Price-weighted Index", ["股价加权"], "价格加权指数中股价较高的成分对指数变动影响更大。", ["market-cap-weighted", "equal-weighted"]),
        E("equal-weighted", "等权指数", "Equal-weighted Index", ["等权重"], "等权指数给每个成分近似相同权重，需要定期再平衡。", ["rebalance", "market-cap-weighted"]),
        E("index-rebalance", "指数再平衡", "Index Rebalancing", ["调仓"], "指数再平衡按既定日期与规则调整成分和权重。", ["index-provider", "tracking-error"]),
        E("total-return-index", "全收益指数", "Total Return Index", ["含息指数"], "全收益指数假设现金分红再投资，更完整地表示投资回报。", ["price-index", "dividend"])
      ])
    ]),

    C("real-estate", "房地产投资", "Real Estate", "房", "products", "直接持有、现金流、估值与融资风险。", [
      G("property-basics", "房地产基础", "Property basics", "理解租金、资本价值与杠杆。", [
        E("rental-yield", "租金收益率", "Rental Yield", ["租售比"], "租金收益率用年度租金收入相对房产价值衡量持有现金回报。", ["cap-rate", "noi"]),
        E("cap-rate", "资本化率", "Capitalization Rate", ["cap rate"], "资本化率等于物业净营业收入除以资产价值。", ["noi", "property-valuation"]),
        E("noi", "净营业收入", "NOI", ["net operating income"], "NOI是租金等经营收入扣除物业运营费用后的收益，不含融资成本与所得税。", ["cap-rate", "cash-flow"]),
        E("ltv", "贷款价值比", "LTV", ["loan to value"], "LTV等于贷款余额除以抵押物价值，用于衡量融资杠杆。", ["mortgage", "leverage"]),
        E("property-valuation", "房地产估值", "Property Valuation", ["房产估值"], "房地产估值可基于可比交易、收益资本化或重置成本。", ["cap-rate", "noi"])
      ])
    ]),

    C("reits", "REITs", "Real Estate Investment Trusts", "R", "products", "用证券化方式持有收益型房地产。", [
      G("reit-basics", "REITs基础", "REIT basics", "结构、类型与关键指标。", [
        E("reit", "房地产投资信托", "REIT", ["REITs", "不动产投资信托"], "REIT汇集投资者资金持有或融资房地产，并按规则分配大部分可分配收益。", ["equity-reit", "ffo"]),
        E("equity-reit", "权益型REIT", "Equity REIT", ["物业REIT"], "权益型REIT直接或间接持有出租物业，收益主要来自租金和资产价值变化。", ["mortgage-reit", "noi"]),
        E("mortgage-reit", "抵押型REIT", "Mortgage REIT", ["mREIT"], "抵押型REIT投资房地产贷款或抵押证券，利差与融资风险更突出。", ["equity-reit", "interest-rate-risk"]),
        E("ffo", "运营资金", "FFO", ["funds from operations"], "FFO在净利润基础上调整房地产折旧和出售损益，常用于评价REIT经营表现。", ["affo", "reit"]),
        E("affo", "调整后运营资金", "AFFO", ["adjusted FFO"], "AFFO进一步调整经常性资本支出和租金直线化等项目。", ["ffo", "dividend"])
      ])
    ]),

    C("banking", "银行与信贷", "Banking & Credit", "银", "institutions", "存贷款、信用创造、利率与个人信贷。", [
      G("banking-basics", "银行基础", "Banking basics", "银行如何连接存款、贷款与支付。", [
        E("deposit", "存款", "Deposit", ["银行存款"], "存款是客户交付给银行并形成银行负债的资金。", ["loan", "deposit-insurance"]),
        E("loan", "贷款", "Loan", ["借款"], "贷款是借款人取得资金并承诺按合同偿还本金和利息的信用安排。", ["interest-rate", "credit-risk"]),
        E("net-interest-margin", "净息差", "Net Interest Margin", ["NIM"], "净息差衡量银行生息资产收益与资金成本之间的差额。", ["loan", "deposit"]),
        E("reserve-requirement", "存款准备金", "Reserve Requirement", ["准备金率"], "存款准备金是银行按规则持有的高流动性资金或央行准备金。", ["central-bank", "money-multiplier"]),
        E("deposit-insurance", "存款保险", "Deposit Insurance", ["存款保障"], "存款保险在适用条件与限额内保护合格存款人。", ["bank-run", "deposit"])
      ]),
      G("credit", "信贷知识", "Credit", "借款成本和偿付能力。", [
        E("apr", "年化利率", "APR", ["annual percentage rate"], "APR把贷款利息和部分费用年化，便于比较信贷成本。", ["effective-rate", "loan"]),
        E("credit-score", "信用评分", "Credit Score", ["征信评分"], "信用评分用历史数据估计借款人违约风险。", ["credit-report", "default-risk"]),
        E("collateral", "抵押品", "Collateral", ["担保物"], "抵押品是在借款人违约时可按合同处置以降低损失的资产。", ["secured-loan", "ltv"]),
        E("mortgage", "住房按揭", "Mortgage", ["房贷"], "按揭是以房地产作为抵押的长期贷款。", ["ltv", "amortization"]),
        E("amortization", "分期摊还", "Amortization", ["等额还款"], "分期摊还是在多个还款期内逐步偿还本金与利息。", ["mortgage", "effective-rate"]),
        E("credit-risk", "信用风险", "Credit Risk", ["借款人风险"], "信用风险是交易对手不能按合同履行付款义务而造成损失的可能性。", ["default-risk", "credit-spread"])
      ])
    ]),

    C("insurance", "保险", "Insurance", "险", "products", "风险转移、保费、保障范围与保险产品。", [
      G("insurance-core", "保险基础", "Insurance basics", "保险合同的核心要素。", [
        E("insurance-policy", "保险合同", "Insurance Policy", ["保单"], "保险合同约定在特定风险事件发生时由保险人提供补偿或给付。", ["premium-insurance", "deductible"]),
        E("premium-insurance", "保险费", "Insurance Premium", ["保费"], "保险费是投保人为获得约定保障而支付的价格。", ["insurance-policy", "underwriting"]),
        E("deductible", "免赔额", "Deductible", ["自付额"], "免赔额是保险事故发生后由被保险人先自行承担的损失部分。", ["coverage-limit", "insurance-policy"]),
        E("coverage-limit", "保险限额", "Coverage Limit", ["保额"], "保险限额是保险人在合同项下承担赔付责任的最高金额。", ["deductible", "claim"]),
        E("underwriting", "核保", "Underwriting", ["承保评估"], "核保是保险人评估风险并决定是否承保、费率和条件的过程。", ["premium-insurance", "actuarial"]),
        E("claim", "保险理赔", "Insurance Claim", ["索赔"], "理赔是事故发生后申请并审核保险赔付的过程。", ["insurance-policy", "coverage-limit"])
      ]),
      G("insurance-types", "保险类型", "Insurance types", "人身、财产与责任风险。", [
        E("life-insurance", "人寿保险", "Life Insurance", ["寿险"], "人寿保险在被保险人死亡或合同约定条件下给付保险金。", ["term-life", "whole-life"]),
        E("health-insurance", "健康保险", "Health Insurance", ["医疗保险"], "健康保险按合同覆盖部分医疗费用或疾病给付。", ["deductible", "claim"]),
        E("property-insurance", "财产保险", "Property Insurance", ["财险"], "财产保险承保房屋、车辆或其他财产遭受的约定损失。", ["liability-insurance", "claim"]),
        E("liability-insurance", "责任保险", "Liability Insurance", ["第三者责任险"], "责任保险保障被保险人依法对第三方承担的特定赔偿责任。", ["property-insurance", "coverage-limit"])
      ])
    ]),

    C("securities", "证券市场", "Securities Markets", "证", "markets", "交易所、场外市场、清算与市场基础设施。", [
      G("market-venues", "交易场所", "Trading venues", "证券在哪里报价与成交。", [
        E("exchange", "证券交易所", "Exchange", ["交易所"], "证券交易所按照规则组织证券挂牌、交易、信息披露与市场监督。", ["otc-market", "clearing-house"]),
        E("otc-market", "场外市场", "OTC Market", ["柜台市场", "over the counter"], "场外市场通过双边或经销商网络交易，不在集中交易所订单簿完成。", ["exchange", "counterparty-risk"]),
        E("order-book", "订单簿", "Order Book", ["盘口", "深度"], "订单簿按价格和时间记录待成交买卖委托。", ["bid", "ask"]),
        E("bid", "买价", "Bid", ["买入报价"], "Bid是市场参与者愿意买入资产的最高报价。", ["ask", "spread"]),
        E("ask", "卖价", "Ask", ["卖出报价", "offer"], "Ask是市场参与者愿意卖出资产的最低报价。", ["bid", "spread"])
      ]),
      G("post-trade", "交易后流程", "Post-trade", "清算、结算与资产保管。", [
        E("clearing-house", "清算机构", "Clearing House", ["中央对手方", "CCP"], "清算机构计算交易义务，并可能作为中央对手方管理违约风险。", ["settlement-cycle", "counterparty-risk"]),
        E("settlement-cycle", "结算周期", "Settlement Cycle", ["T+1", "T+2"], "结算周期是成交日至证券和资金完成交收的时间安排。", ["clearing-house", "custodian"]),
        E("custodian", "托管机构", "Custodian", ["证券托管"], "托管机构负责保管资产、处理公司行为并维护所有权记录。", ["settlement-cycle", "custody-fee"])
      ])
    ]),

    C("derivatives", "衍生品", "Derivatives", "衍", "derivatives", "以其他资产或变量为基础的合约体系总览。", [
      G("derivative-family", "衍生品家族", "Derivative family", "不同合约的法律与现金流结构。", [
        E("derivative", "衍生品", "Derivative", ["金融衍生工具"], "衍生品的价值来自股票、利率、商品、汇率或其他变量。", ["futures-contract", "option-contract", "swap"]),
        E("forward-contract", "远期合约", "Forward", ["远期"], "远期是双方私下约定未来按指定价格买卖标的的合约。", ["futures-contract", "counterparty-risk"]),
        E("option-contract", "期权合约", "Option Contract", ["option"], "期权合约给予买方权利，并让卖方在被行权时承担义务。", ["call-option", "put-option"]),
        E("swap", "互换", "Swap", ["掉期"], "互换是双方按约定规则在未来交换现金流的合约。", ["interest-rate-swap", "currency-swap"]),
        E("interest-rate-swap", "利率互换", "Interest-rate Swap", ["IRS"], "利率互换通常交换固定利率和浮动利率现金流。", ["swap", "floating-rate-note"]),
        E("currency-swap", "货币互换", "Currency Swap", ["cross-currency swap"], "货币互换交换不同货币的本金或利息现金流。", ["swap", "currency-risk"]),
        E("structured-product", "结构化产品", "Structured Product", ["结构性产品"], "结构化产品把债券、存款或基金与衍生品收益规则组合。", ["structured-note", "barrier-option"])
      ])
    ]),

    C("asset-management", "资产管理", "Asset Management", "管", "portfolio", "投资授权、产品运作与受托责任。", [
      G("asset-management-core", "资管基础", "Asset management basics", "谁为谁管理什么资产。", [
        E("asset-manager", "资产管理人", "Asset Manager", ["investment manager"], "资产管理人依授权为客户或基金进行投资决策和组合管理。", ["fiduciary-duty", "investment-mandate"]),
        E("aum", "管理资产规模", "AUM", ["assets under management"], "AUM是管理机构代表客户管理的资产总规模，口径可能因机构而异。", ["asset-manager", "management-fee"]),
        E("investment-mandate", "投资授权", "Investment Mandate", ["投资范围"], "投资授权规定目标、资产范围、限制、基准和风险预算。", ["asset-manager", "benchmark"]),
        E("fiduciary-duty", "受托责任", "Fiduciary Duty", ["信义义务"], "受托责任要求管理人按适用法律与授权，以客户利益为重并管理利益冲突。", ["asset-manager", "conflict-of-interest"]),
        E("active-management", "主动管理", "Active Management", ["选股择时"], "主动管理通过研究与判断主动偏离基准以争取超额收益。", ["passive-management", "alpha"]),
        E("passive-management", "被动管理", "Passive Management", ["指数化管理"], "被动管理按规则复制基准，重点控制成本和跟踪误差。", ["active-management", "tracking-error"])
      ])
    ]),

    C("portfolio", "投资组合", "Portfolio", "组", "portfolio", "资产配置、分散化、风险收益与绩效归因。", [
      G("portfolio-core", "组合基础", "Portfolio basics", "把多个资产作为一个整体来管理。", [
        E("portfolio", "投资组合", "Portfolio", ["资产组合"], "投资组合是为共同目标持有的一组资产、负债或策略头寸。", ["asset-allocation", "diversification"]),
        E("asset-allocation", "资产配置", "Asset Allocation", ["大类资产配置"], "资产配置决定资金在股票、债券、现金等类别间的比例。", ["strategic-allocation", "rebalancing"]),
        E("diversification", "分散化", "Diversification", ["分散投资"], "分散化利用资产间不完全相关性降低特定风险，但不能消除全部市场风险。", ["correlation", "systematic-risk"]),
        E("correlation", "相关系数", "Correlation", ["相关性"], "相关系数衡量两个变量线性共同变动的方向和强度，范围通常为-1到1。", ["covariance", "diversification"]),
        E("rebalancing", "再平衡", "Rebalancing", ["组合调仓"], "再平衡把偏离目标的资产权重恢复到策略区间。", ["asset-allocation", "transaction-cost"])
      ]),
      G("portfolio-theory", "组合理论", "Portfolio theory", "用数学描述风险与收益。", [
        E("expected-return", "预期收益", "Expected Return", ["期望回报"], "预期收益是不同可能收益按概率加权的平均值。", ["variance", "risk-premium"]),
        E("variance", "方差", "Variance", ["收益方差"], "方差衡量收益围绕平均值的离散程度。", ["standard-deviation", "volatility"]),
        E("efficient-frontier", "有效前沿", "Efficient Frontier", ["效率前沿"], "有效前沿是在给定风险下提供最高预期收益的一组组合。", ["modern-portfolio-theory", "sharpe-ratio"]),
        E("modern-portfolio-theory", "现代投资组合理论", "Modern Portfolio Theory", ["MPT"], "MPT使用预期收益、方差和协方差构建风险收益组合。", ["efficient-frontier", "diversification"]),
        E("capm", "资本资产定价模型", "CAPM", ["资本资产定价"], "CAPM把资产预期超额收益与其相对市场的系统性风险Beta联系起来。", ["beta", "risk-free-rate"]),
        E("beta", "Beta", "Beta", ["贝塔"], "Beta衡量资产收益对市场收益变化的敏感度。", ["capm", "systematic-risk"]),
        E("alpha", "Alpha", "Alpha", ["阿尔法", "超额收益"], "Alpha通常表示相对风险调整基准无法解释的收益部分。", ["beta", "benchmark"])
      ])
    ]),

    C("risk", "风险管理", "Risk Management", "风", "portfolio", "识别、衡量、限制和监控金融风险。", [
      G("risk-types", "风险类型", "Risk types", "常见金融风险来源。", [
        E("market-risk", "市场风险", "Market Risk", ["价格风险"], "市场风险来自利率、汇率、股票或商品价格变化。", ["var", "stress-testing"]),
        E("counterparty-risk", "交易对手风险", "Counterparty Risk", ["对手方风险"], "交易对手风险是合同另一方无法履约造成损失的可能性。", ["credit-risk", "clearing-house"]),
        E("operational-risk", "操作风险", "Operational Risk", ["运营风险"], "操作风险来自人员、流程、系统或外部事件失效。", ["model-risk", "cyber-risk"]),
        E("systematic-risk", "系统性风险", "Systematic Risk", ["不可分散风险"], "系统性风险由全市场因素驱动，无法仅靠持有更多同类资产消除。", ["beta", "idiosyncratic-risk"]),
        E("idiosyncratic-risk", "非系统性风险", "Idiosyncratic Risk", ["特有风险"], "非系统性风险与特定公司或资产有关，可通过分散化降低。", ["diversification", "systematic-risk"]),
        E("model-risk", "模型风险", "Model Risk", ["模型错误"], "模型风险来自模型设计、数据、实现或使用方式不当。", ["backtesting", "operational-risk"])
      ]),
      G("risk-tools", "风险工具", "Risk tools", "把不可见风险变成可监控指标。", [
        E("var", "风险价值", "Value at Risk", ["VaR"], "VaR估计在给定置信水平和持有期内损失不超过某数值的门槛。", ["expected-shortfall", "stress-testing"]),
        E("expected-shortfall", "预期损失", "Expected Shortfall", ["ES", "CVaR"], "Expected Shortfall衡量超过VaR门槛后尾部损失的平均值。", ["var", "tail-risk"]),
        E("stress-testing", "压力测试", "Stress Testing", ["情景压力"], "压力测试评估极端但合理情景对组合、机构或策略的影响。", ["scenario-analysis", "var"]),
        E("scenario-analysis", "情景分析", "Scenario Analysis", ["what-if"], "情景分析在一组明确假设下评估结果如何变化。", ["stress-testing", "sensitivity-analysis"]),
        E("position-size", "仓位规模", "Position Sizing", ["仓位管理"], "仓位规模决定单笔或单类风险暴露占可用资本的比例。", ["stop-order", "risk-budget"]),
        E("risk-reward", "风险收益比", "Risk/Reward Ratio", ["盈亏比"], "风险收益比比较预设潜在损失与潜在收益，但不包含成功概率。", ["win-rate", "expectancy"]),
        E("stop-loss", "止损", "Stop Loss", ["风险止损"], "止损是达到预设价格或风险条件时降低或退出头寸的规则。", ["stop-order", "position-size"])
      ])
    ]),

    C("fundamental", "基本面分析", "Fundamental Analysis", "本", "analysis", "从财务报表、行业与企业质量判断价值。", [
      G("financial-statements", "财务报表", "Financial statements", "读懂企业收入、资产与现金。", [
        E("income-statement", "利润表", "Income Statement", ["损益表"], "利润表展示一段期间内的收入、成本、费用和利润。", ["balance-sheet", "cash-flow-statement"]),
        E("balance-sheet", "资产负债表", "Balance Sheet", ["财务状况表"], "资产负债表展示某一时点的资产、负债和股东权益。", ["income-statement", "book-value"]),
        E("cash-flow-statement", "现金流量表", "Cash Flow Statement", ["现金流表"], "现金流量表按经营、投资和融资活动解释现金变化。", ["free-cash-flow", "income-statement"]),
        E("revenue-growth", "收入增长", "Revenue Growth", ["营收增速"], "收入增长衡量企业销售规模相对上一期间的变化。", ["gross-margin", "ps"]),
        E("gross-margin", "毛利率", "Gross Margin", ["毛利"], "毛利率等于收入减销售成本后的毛利除以收入。", ["operating-margin", "revenue-growth"]),
        E("free-cash-flow", "自由现金流", "Free Cash Flow", ["FCF"], "自由现金流通常指经营现金流扣除维持和扩张所需资本支出后的现金。", ["dcf", "cash-flow-statement"])
      ]),
      G("business-analysis", "企业分析", "Business analysis", "竞争力、治理与增长质量。", [
        E("competitive-advantage", "竞争优势", "Competitive Advantage", ["护城河"], "竞争优势让企业在较长时期内维持高于行业的盈利或资本回报。", ["pricing-power", "roe"]),
        E("economic-moat", "经济护城河", "Economic Moat", ["moat"], "经济护城河是对可持续竞争优势的形象表达。", ["competitive-advantage", "network-effect"]),
        E("management-quality", "管理层质量", "Management Quality", ["公司治理"], "管理层质量涉及资本配置、战略执行、透明度与利益一致性。", ["corporate-governance", "capital-allocation"]),
        E("industry-analysis", "行业分析", "Industry Analysis", ["产业分析"], "行业分析研究市场规模、竞争格局、周期、监管与价值链。", ["competitive-advantage", "economic-cycle"]),
        E("margin-of-safety", "安全边际", "Margin of Safety", ["估值安全垫"], "安全边际是在估计价值与买入价格之间保留缓冲，以应对误差和不确定性。", ["intrinsic-value-stock", "value-stock"])
      ])
    ]),

    C("technical", "技术分析", "Technical Analysis", "技", "analysis", "K线、指标、价格结构、图表形态与经典理论。", [
      G("candlestick-basics", "K线基础", "Candlestick basics", "一根K线如何表达价格。", [
        E("open-price", "开盘价", "Open", ["O", "开盘"], "开盘价是指定周期内第一笔或规则确定的起始成交价格。", ["high-price", "candlestick"]),
        E("high-price", "最高价", "High", ["H", "最高"], "最高价是指定周期内出现的最高成交价格。", ["low-price", "candlestick"]),
        E("low-price", "最低价", "Low", ["L", "最低"], "最低价是指定周期内出现的最低成交价格。", ["high-price", "candlestick"]),
        E("close-price", "收盘价", "Close", ["C", "收盘"], "收盘价是指定周期内最后一笔或规则确定的结束价格。", ["open-price", "candlestick"]),
        E("candlestick", "K线", "Candlestick", ["蜡烛图", "OHLC"], "K线用实体和影线同时呈现一个周期的开、高、低、收价格。", ["open-price", "doji", "price-action"])
      ]),
      G("candlestick-patterns", "K线形态", "Candlestick patterns", "单根或多根K线的常见价格表达。", [
        E("doji", "十字星", "Doji", ["十字线"], "十字星的开盘价与收盘价非常接近，表示多空暂时均衡。", ["candlestick", "hammer"]),
        E("hammer", "锤子线", "Hammer", ["锤头"], "锤子线通常有较长下影和较小实体，需结合位置与确认信号解释。", ["hanging-man", "pin-bar"]),
        E("hanging-man", "上吊线", "Hanging Man", ["吊颈线"], "上吊线外形类似锤子线，但通常出现在上涨之后，意义依赖后续确认。", ["hammer", "shooting-star"]),
        E("shooting-star", "射击之星", "Shooting Star", ["流星线"], "射击之星通常有较长上影和小实体，出现在上涨后可能提示上方拒绝。", ["hanging-man", "pin-bar"]),
        E("engulfing", "吞没形态", "Engulfing Pattern", ["看涨吞没", "看跌吞没"], "吞没形态由后一根较大实体覆盖前一根实体，需结合趋势与成交量判断。", ["candlestick", "reversal-pattern"]),
        E("morning-star", "晨星", "Morning Star", ["启明星"], "晨星是常见三根K线反转组合，通常在下跌后寻找企稳信号。", ["evening-star", "reversal-pattern"]),
        E("evening-star", "暮星", "Evening Star", ["黄昏星"], "暮星是常见三根K线反转组合，通常在上涨后寻找转弱信号。", ["morning-star", "reversal-pattern"]),
        E("pin-bar", "Pin Bar", "Pin Bar", ["长影线K"], "Pin Bar有明显长影线和较小实体，用于观察某个价格方向被市场拒绝。", ["hammer", "shooting-star"]),
        E("inside-bar", "内包线", "Inside Bar", ["孕线"], "Inside Bar的高低区间位于前一根K线内部，常表示短暂收缩。", ["breakout", "range"]),
        E("double-needle-bottom", "双针探底", "Double Pin Bottom", ["双针探底形态"], "双针探底由两次在相近低位被快速买回的长下影构成，需要后续价格确认。", ["double-bottom", "support"]),
        E("double-needle-top", "双针探顶", "Double Pin Top", ["双针探顶形态"], "双针探顶由两次在相近高位遭到抛压的长上影构成，需要后续价格确认。", ["double-top", "resistance"])
      ]),
      G("trend-indicators", "趋势指标", "Trend indicators", "识别方向、均衡价与趋势强度。", [
        E("moving-average", "移动平均线", "Moving Average", ["MA", "均线"], "移动平均线把指定窗口的价格平滑为一条随时间更新的曲线。", ["sma", "ema"]),
        E("sma", "简单移动平均线", "SMA", ["simple moving average"], "SMA对窗口内每个价格赋予相同权重并计算算术平均。", ["ema", "moving-average"]),
        E("ema", "指数移动平均线", "EMA", ["exponential moving average"], "EMA给近期价格更高权重，因此通常比SMA响应更快。", ["sma", "macd"]),
        E("wma", "加权移动平均线", "WMA", ["weighted moving average"], "WMA按预设线性或其他权重计算移动平均。", ["sma", "ema"]),
        E("macd", "MACD", "Moving Average Convergence Divergence", ["指数平滑异同移动平均线", "平滑异同均线"], "MACD比较快慢EMA的差，并用信号线与柱状图观察趋势动量变化。", ["ema", "macd-line", "signal-line", "histogram"]),
        E("macd-line", "MACD线", "MACD Line", ["DIF"], "MACD线通常等于短周期EMA减去长周期EMA。", ["signal-line", "ema"]),
        E("signal-line", "信号线", "Signal Line", ["DEA"], "信号线通常是MACD线的9周期EMA。", ["macd-line", "golden-cross"]),
        E("histogram", "MACD柱状图", "MACD Histogram", ["柱体"], "MACD柱状图表示MACD线与信号线之间的差。", ["macd-line", "signal-line"]),
        E("golden-cross", "金叉", "Golden Cross", ["bullish crossover"], "金叉泛指较快线向上穿越较慢线，必须结合指标类型与市场环境。", ["death-cross", "macd"]),
        E("death-cross", "死叉", "Death Cross", ["bearish crossover"], "死叉泛指较快线向下穿越较慢线，不能单独保证趋势反转。", ["golden-cross", "macd"]),
        E("adx", "ADX", "Average Directional Index", ["平均趋向指数"], "ADX衡量趋势强度而非方向，常与+DI和-DI配合。", ["trend", "momentum"]),
        E("parabolic-sar", "抛物线转向", "Parabolic SAR", ["SAR"], "Parabolic SAR用随趋势加速的点位提供跟踪止损和潜在转向参考。", ["trend", "stop-loss"]),
        E("ichimoku", "一目均衡表", "Ichimoku Cloud", ["Ichimoku", "云图"], "一目均衡表用多条中点线和云层同时表达趋势、支撑阻力与动量。", ["support", "trend"]),
        E("supertrend", "Supertrend", "Supertrend", ["超级趋势"], "Supertrend以ATR和价格中枢计算跟随趋势的动态带。", ["atr", "trend"])
      ]),
      G("momentum-indicators", "动量指标", "Momentum indicators", "判断价格变化速度和相对强弱。", [
        E("rsi", "相对强弱指数", "RSI", ["Relative Strength Index", "相对强弱指标"], "RSI把一定周期内平均上涨与平均下跌的关系压缩到0至100。", ["stochastic", "momentum", "divergence"]),
        E("stochastic", "随机指标", "Stochastic Oscillator", ["KDJ", "KD"], "随机指标比较收盘价在近期高低区间中的位置。", ["rsi", "stochastic-rsi"]),
        E("stochastic-rsi", "随机RSI", "Stochastic RSI", ["Stoch RSI"], "Stochastic RSI把随机指标公式应用于RSI序列，提高敏感度也增加噪声。", ["rsi", "stochastic"]),
        E("cci", "顺势指标", "CCI", ["Commodity Channel Index"], "CCI衡量典型价格偏离其移动平均的程度。", ["momentum", "mean-reversion"]),
        E("momentum", "动量", "Momentum", ["价格动量"], "动量衡量当前价格相对若干期前价格的变化速度或幅度。", ["roc", "rsi"]),
        E("roc", "变化率", "ROC", ["Rate of Change"], "ROC用百分比表示当前价格相对若干期前价格的变化。", ["momentum", "rsi"]),
        E("williams-r", "威廉指标", "Williams %R", ["W%R"], "Williams %R衡量收盘价在近期最高与最低区间中的相对位置。", ["stochastic", "rsi"])
      ]),
      G("volatility-indicators", "波动率指标", "Volatility indicators", "观察波动扩张、收缩和价格区间。", [
        E("bollinger-bands", "布林带", "Bollinger Bands", ["BOLL", "布林", "保力加通道"], "布林带以移动平均线为中轨，并在上下方放置若干倍标准差带。", ["standard-deviation", "sma", "bollinger-squeeze"]),
        E("atr", "平均真实波幅", "ATR", ["Average True Range", "真实波幅"], "ATR对真实波幅进行平滑，衡量波动大小而不判断方向。", ["volatility", "supertrend"]),
        E("standard-deviation", "标准差", "Standard Deviation", ["Std Dev", "标准偏差"], "标准差衡量观察值围绕均值的典型离散程度。", ["variance", "bollinger-bands"]),
        E("keltner-channel", "肯特纳通道", "Keltner Channel", ["KC"], "肯特纳通道通常以EMA为中轨并用ATR构造上下轨。", ["atr", "bollinger-bands"]),
        E("donchian-channel", "唐奇安通道", "Donchian Channel", ["海龟通道"], "唐奇安通道由指定周期最高价与最低价构成。", ["breakout", "trend-following"])
      ]),
      G("volume-indicators", "成交量指标", "Volume indicators", "用成交活动验证价格变化。", [
        E("obv", "能量潮", "OBV", ["On-Balance Volume"], "OBV按价格涨跌方向累计成交量，以观察量价是否同步。", ["volume", "divergence"]),
        E("vwap", "成交量加权平均价", "VWAP", ["Volume Weighted Average Price"], "VWAP用成交量为权重计算一段期间内的平均成交价格。", ["volume", "benchmark"]),
        E("mfi", "资金流量指标", "MFI", ["Money Flow Index"], "MFI结合典型价格与成交量构造0至100的动量振荡器。", ["rsi", "volume"]),
        E("volume-profile", "成交量分布", "Volume Profile", ["VPVR", "筹码分布"], "Volume Profile按价格区间汇总成交量，而不是按时间排列。", ["market-profile", "support"]),
        E("ad-line", "累积派发线", "A/D Line", ["Accumulation Distribution"], "A/D Line根据收盘价在当期高低区间的位置对成交量加权累计。", ["obv", "cmf"]),
        E("cmf", "蔡金资金流", "CMF", ["Chaikin Money Flow"], "CMF把一定窗口内资金流量加总并除以成交量，用于观察买卖压力。", ["ad-line", "mfi"])
      ]),
      G("price-structure", "价格与市场结构", "Price & market structure", "直接从价格路径识别趋势与关键区域。", [
        E("support", "支撑位", "Support", ["支撑"], "支撑是市场曾出现较强买盘或下跌暂缓的价格区域，不是一条保证有效的线。", ["resistance", "breakout"]),
        E("resistance", "阻力位", "Resistance", ["压力位"], "阻力是市场曾出现较强卖盘或上涨暂缓的价格区域。", ["support", "breakout"]),
        E("trend-line", "趋势线", "Trend Line", ["趋势线"], "趋势线连接一系列关键高点或低点，用来可视化价格方向。", ["trend", "channel"]),
        E("channel", "价格通道", "Price Channel", ["通道"], "价格通道由两条大致平行的边界线描述波动范围。", ["trend-line", "donchian-channel"]),
        E("breakout", "突破", "Breakout", ["破位"], "突破是价格离开重要区间或关键水平并尝试建立新平衡。", ["fake-breakout", "resistance"]),
        E("fake-breakout", "假突破", "False Breakout", ["骗线"], "假突破是价格短暂越过关键水平后迅速回到原区间。", ["breakout", "liquidity"]),
        E("range", "震荡区间", "Range", ["盘整", "横盘"], "Range是价格在较明确上下边界之间往返的状态。", ["trend", "support"]),
        E("trend", "趋势", "Trend", ["趋势行情"], "趋势是价格在一段时间内持续形成方向性高低点结构。", ["higher-high", "lower-low"]),
        E("higher-high", "更高高点", "Higher High", ["HH"], "Higher High表示新摆动高点高于前一重要高点。", ["higher-low", "uptrend"]),
        E("higher-low", "更高低点", "Higher Low", ["HL"], "Higher Low表示新摆动低点高于前一重要低点。", ["higher-high", "uptrend"]),
        E("lower-high", "更低高点", "Lower High", ["LH"], "Lower High表示新摆动高点低于前一重要高点。", ["lower-low", "downtrend"]),
        E("lower-low", "更低低点", "Lower Low", ["LL"], "Lower Low表示新摆动低点低于前一重要低点。", ["lower-high", "downtrend"]),
        E("supply-demand", "供需区", "Supply & Demand", ["订单区"], "供需区用价格快速离开的区域推测潜在不平衡，划分方法具有主观性。", ["support", "order-block"]),
        E("liquidity", "流动性", "Liquidity", ["市场流动性"], "流动性描述资产能否快速、大量且低成本地成交，而不会显著影响价格。", ["spread", "slippage"]),
        E("order-block", "订单块", "Order Block", ["OB"], "Order Block是部分价格行为流派用来标记潜在机构订单区域的术语，缺乏统一客观定义。", ["supply-demand", "liquidity"]),
        E("bos", "结构突破", "Break of Structure", ["BOS"], "BOS通常指价格突破先前关键摆动点，用于确认结构延续或改变。", ["choch", "trend"]),
        E("choch", "结构性格改变", "Change of Character", ["CHoCH"], "CHoCH用于描述价格首次破坏既有趋势结构的现象，定义因流派而异。", ["bos", "trend"])
      ]),
      G("chart-patterns", "图表形态", "Chart patterns", "由多段价格摆动构成的视觉结构。", [
        E("double-top", "双顶", "Double Top", ["M顶"], "双顶由两个相近高点和中间低点构成，跌破颈线后才通常被视为确认。", ["double-bottom", "resistance"]),
        E("double-bottom", "双底", "Double Bottom", ["W底"], "双底由两个相近低点和中间高点构成，突破颈线后才通常被视为确认。", ["double-top", "support"]),
        E("triple-top", "三重顶", "Triple Top", ["三顶"], "三重顶由三个相近高点构成，是潜在反转结构。", ["triple-bottom", "resistance"]),
        E("triple-bottom", "三重底", "Triple Bottom", ["三底"], "三重底由三个相近低点构成，是潜在反转结构。", ["triple-top", "support"]),
        E("head-shoulders", "头肩顶", "Head and Shoulders", ["头肩形"], "头肩顶由左肩、较高头部和右肩构成，颈线跌破是常见确认条件。", ["inverse-head-shoulders", "reversal-pattern"]),
        E("inverse-head-shoulders", "头肩底", "Inverse Head and Shoulders", ["倒头肩"], "头肩底是头肩顶的反向结构，颈线突破是常见确认条件。", ["head-shoulders", "reversal-pattern"]),
        E("triangle-pattern", "三角形", "Triangle", ["收敛三角形"], "三角形由逐步收敛的趋势线形成，突破方向需要市场确认。", ["breakout", "pennant"]),
        E("flag-pattern", "旗形", "Flag", ["旗形整理"], "旗形是快速趋势后出现的短期倾斜整理结构。", ["pennant", "trend"]),
        E("wedge-pattern", "楔形", "Wedge", ["上升楔形", "下降楔形"], "楔形由同向收敛边界构成，可能提示动量衰减。", ["triangle-pattern", "breakout"]),
        E("rectangle-pattern", "矩形", "Rectangle", ["箱体"], "矩形形态在大致水平支撑和阻力之间整理。", ["range", "breakout"]),
        E("pennant", "三角旗形", "Pennant", ["小三角旗"], "Pennant通常在快速价格移动后形成小型收敛整理。", ["flag-pattern", "triangle-pattern"]),
        E("cup-handle", "杯柄形态", "Cup and Handle", ["杯柄"], "杯柄形态由圆弧底与较短回撤组成，属于主观识别的延续形态。", ["breakout", "volume"])
      ]),
      G("technical-theories", "经典技术理论", "Classical theories", "历史悠久的市场观察框架。", [
        E("dow-theory", "道氏理论", "Dow Theory", ["道氏"], "道氏理论通过主要趋势、相互确认和成交量等原则解释市场运动。", ["trend", "volume"]),
        E("elliott-wave", "艾略特波浪", "Elliott Wave", ["波浪理论"], "艾略特波浪用推动浪与调整浪的重复结构解释市场心理，计数具有主观性。", ["fibonacci", "market-psychology"]),
        E("fibonacci", "斐波那契工具", "Fibonacci", ["黄金分割", "回撤位"], "斐波那契工具用特定比例标记潜在回撤或扩展区域，本身不能证明支撑阻力。", ["support", "elliott-wave"]),
        E("wyckoff", "威科夫理论", "Wyckoff", ["吸筹", "派发"], "威科夫方法通过价格、成交量和阶段结构解释供需与大资金行为。", ["volume", "market-structure"]),
        E("price-action", "价格行为", "Price Action", ["裸K"], "价格行为分析主要依据价格本身、结构和K线，而不是大量衍生指标。", ["candlestick", "market-structure"]),
        E("market-profile", "市场轮廓", "Market Profile", ["TPO"], "Market Profile按价格和时间组织市场活动，观察价值区域与拍卖过程。", ["volume-profile", "auction-market"])
      ])
    ]),

    C("macro", "宏观经济", "Macroeconomics", "宏", "economy", "经济指标、央行、货币政策与周期。", [
      G("macro-indicators", "经济指标", "Economic indicators", "衡量产出、物价、就业与需求。", [
        E("gdp", "国内生产总值", "GDP", ["国内生产总值"], "GDP衡量一段时期内一国境内生产的最终商品和服务市场价值。", ["economic-growth", "recession"]),
        E("cpi", "消费者价格指数", "CPI", ["消费物价指数"], "CPI跟踪代表性消费篮子价格随时间的变化。", ["inflation", "ppi"]),
        E("ppi", "生产者价格指数", "PPI", ["出厂价格指数"], "PPI衡量生产者出售商品和服务价格的变化。", ["cpi", "inflation"]),
        E("pmi", "采购经理指数", "PMI", ["采购经理人指数"], "PMI通过企业调查衡量生产、新订单、就业等经营活动，50常被用作扩张收缩分界。", ["economic-cycle", "industrial-metals"]),
        E("unemployment-rate", "失业率", "Unemployment Rate", ["就业率"], "失业率是劳动力中没有工作、可工作且积极求职者所占比例。", ["labor-force", "recession"]),
        E("retail-sales", "零售销售", "Retail Sales", ["零售额"], "零售销售衡量零售商向消费者销售商品的金额变化。", ["consumer-spending", "gdp"])
      ]),
      G("central-banks", "中央银行", "Central banks", "主要经济体的货币当局。", [
        E("central-bank", "中央银行", "Central Bank", ["央行"], "中央银行负责货币发行、支付体系、金融稳定及货币政策等职能。", ["monetary-policy", "interest-rate"]),
        E("fed", "美联储", "Federal Reserve", ["Fed", "Federal Reserve System"], "美联储是美国中央银行体系，货币政策由联邦公开市场委员会等机构制定。", ["fomc", "interest-rate"]),
        E("ecb", "欧洲央行", "ECB", ["European Central Bank"], "欧洲央行负责欧元区货币政策。", ["monetary-policy", "euro"]),
        E("rbnz", "新西兰储备银行", "RBNZ", ["新西兰央行", "Reserve Bank of New Zealand"], "RBNZ是新西兰中央银行，负责货币政策和部分金融监管职能。", ["ocr", "nzd"]),
        E("rba", "澳大利亚储备银行", "RBA", ["澳洲央行"], "RBA是澳大利亚中央银行。", ["cash-rate", "aud"]),
        E("pboc", "中国人民银行", "PBOC", ["中国央行", "央行"], "中国人民银行是中国的中央银行。", ["lpr", "rmb"]),
        E("boj", "日本银行", "BOJ", ["日本央行"], "日本银行是日本中央银行。", ["yield-curve-control", "jpy"])
      ]),
      G("monetary-policy", "货币政策", "Monetary policy", "利率、流动性与资产负债表工具。", [
        E("interest-rate", "利率", "Interest Rate", ["利息率"], "利率是使用资金的价格，也是跨期价值转换的重要基准。", ["rate-hike", "discount-rate"]),
        E("rate-hike", "加息", "Rate Hike", ["提高利率"], "加息是央行上调政策利率或引导市场利率上升。", ["rate-cut", "inflation"]),
        E("rate-cut", "降息", "Rate Cut", ["降低利率"], "降息是央行下调政策利率或引导融资成本下降。", ["rate-hike", "recession"]),
        E("qe", "量化宽松", "QE", ["Quantitative Easing"], "QE通常指央行大规模购买资产以压低长期利率并增加金融体系流动性。", ["qt", "central-bank-balance-sheet"]),
        E("qt", "量化紧缩", "QT", ["Quantitative Tightening"], "QT通常指央行缩减资产负债表，让持有资产到期或主动出售。", ["qe", "liquidity"])
      ]),
      G("macro-concepts", "宏观概念", "Macro concepts", "物价、增长与经济阶段。", [
        E("inflation", "通货膨胀", "Inflation", ["通胀"], "通胀是总体价格水平持续上升、货币购买力下降的过程。", ["cpi", "deflation"]),
        E("deflation", "通货紧缩", "Deflation", ["通缩"], "通缩是总体价格水平持续下降，常伴随需求不足或债务实际负担上升。", ["inflation", "recession"]),
        E("recession", "经济衰退", "Recession", ["衰退"], "经济衰退是一段广泛而持续的经济活动下降，判断不只依赖单一指标。", ["gdp", "economic-cycle"]),
        E("economic-cycle", "经济周期", "Economic Cycle", ["商业周期"], "经济周期描述扩张、放缓、衰退与复苏等反复阶段。", ["pmi", "cyclical-stock"]),
        E("inverted-yield-curve", "收益率曲线倒挂", "Inverted Yield Curve", ["倒挂"], "收益率曲线倒挂是短期收益率高于长期收益率的状态，常被视为增长预期转弱信号之一。", ["yield-curve", "recession"])
      ])
    ]),

    C("institutions", "金融机构", "Financial Institutions", "机", "institutions", "银行、券商、基金、交易所和政策机构的角色。", [
      G("institution-types", "机构类型", "Institution types", "金融体系中的主要组织。", [
        E("commercial-bank", "商业银行", "Commercial Bank", ["银行"], "商业银行接受存款、提供贷款、支付和其他金融服务。", ["deposit", "loan"]),
        E("investment-bank", "投资银行", "Investment Bank", ["投行"], "投资银行提供证券承销、并购顾问、融资和资本市场服务。", ["underwriter", "ipo"]),
        E("securities-broker", "证券经纪商", "Securities Broker", ["券商"], "证券经纪商代表客户执行证券交易并提供账户与市场接入。", ["broker", "exchange"]),
        E("fund-company", "基金管理公司", "Fund Management Company", ["基金公司"], "基金管理公司发起或管理集合投资产品。", ["asset-manager", "fund-manager"]),
        E("pension-fund", "养老基金", "Pension Fund", ["退休基金"], "养老基金为未来养老金负债积累和投资资产。", ["liability-driven-investing", "asset-allocation"]),
        E("sovereign-wealth-fund", "主权财富基金", "Sovereign Wealth Fund", ["SWF"], "主权财富基金由政府拥有并管理国家长期金融资产。", ["foreign-reserves", "asset-allocation"]),
        E("rating-agency", "信用评级机构", "Credit Rating Agency", ["评级公司"], "评级机构提供发行人和债务工具信用风险意见。", ["credit-rating", "credit-spread"])
      ])
    ]),

    C("markets", "金融市场", "Financial Markets", "市", "markets", "按期限、资产和交易机制理解资本流动。", [
      G("market-types", "市场类型", "Market types", "资金在不同期限与工具间流动。", [
        E("money-market", "货币市场", "Money Market", ["短期资金市场"], "货币市场交易期限较短、流动性较高的债务与融资工具。", ["capital-market", "money-market-fund"]),
        E("capital-market", "资本市场", "Capital Market", ["长期资本市场"], "资本市场为中长期股权和债务融资提供交易与配置机制。", ["money-market", "primary-market"]),
        E("equity-market", "权益市场", "Equity Market", ["股票市场"], "权益市场发行和交易代表企业所有权的证券。", ["stock-index", "capital-market"]),
        E("fixed-income-market", "固定收益市场", "Fixed-income Market", ["债券市场"], "固定收益市场交易具有约定或可推定现金流的债务工具。", ["bonds", "interest-rate"]),
        E("derivatives-market", "衍生品市场", "Derivatives Market", ["期货期权市场"], "衍生品市场交易价值依赖其他资产或变量的合约。", ["derivative", "clearing-house"]),
        E("auction-market", "拍卖市场", "Auction Market", ["集中竞价"], "拍卖市场通过订单竞争形成价格并撮合交易。", ["order-book", "dealer-market"]),
        E("dealer-market", "做市商市场", "Dealer Market", ["报价驱动市场"], "做市商市场由交易商用自有库存提供买卖报价。", ["market-maker", "otc-market"])
      ])
    ]),

    C("quant", "量化金融", "Quantitative Finance", "量", "quant", "用数据、模型与程序研究定价、风险和策略。", [
      G("quant-core", "量化基础", "Quant foundations", "数据、回测和模型评价。", [
        E("quantitative-finance", "量化金融", "Quantitative Finance", ["quant"], "量化金融用数学、统计和计算方法研究市场、定价与风险。", ["financial-math", "algorithmic-trading"]),
        E("backtesting", "回测", "Backtesting", ["历史回测"], "回测把明确的交易规则应用于历史数据，以估计策略过去的表现。", ["lookahead-bias", "overfitting"]),
        E("lookahead-bias", "前视偏差", "Look-ahead Bias", ["未来函数"], "前视偏差发生在回测不当地使用了当时不可获得的信息。", ["backtesting", "data-snooping"]),
        E("survivorship-bias", "幸存者偏差", "Survivorship Bias", ["存活偏差"], "幸存者偏差因样本只保留仍存在的资产而高估历史表现。", ["backtesting", "delisting"]),
        E("overfitting", "过拟合", "Overfitting", ["数据拟合过度"], "过拟合是模型记住样本噪声而无法稳定泛化。", ["cross-validation", "backtesting"]),
        E("factor-investing", "因子投资", "Factor Investing", ["多因子"], "因子投资按价值、动量、质量等可度量特征系统配置资产。", ["smart-beta-etf", "alpha"]),
        E("algorithmic-trading", "算法交易", "Algorithmic Trading", ["自动交易"], "算法交易用程序按预设规则生成、拆分或执行订单。", ["execution-algorithm", "quantitative-finance"])
      ]),
      G("quant-models", "量化模型", "Quant models", "时间序列、模拟与定价。", [
        E("monte-carlo", "蒙特卡洛模拟", "Monte Carlo Simulation", ["随机模拟"], "蒙特卡洛模拟通过大量随机路径估计结果分布与不确定性。", ["scenario-analysis", "option-pricing"]),
        E("time-series", "时间序列", "Time Series", ["时序数据"], "时间序列是按时间顺序记录的观察值，其相关结构会影响建模。", ["stationarity", "forecasting"]),
        E("mean-reversion", "均值回归", "Mean Reversion", ["回归均值"], "均值回归假设变量偏离长期水平后存在回归倾向。", ["pair-trading", "half-life"]),
        E("volatility-model", "波动率模型", "Volatility Model", ["GARCH"], "波动率模型描述收益波动随时间聚集和变化的特征。", ["historical-volatility", "var"]),
        E("machine-learning-finance", "金融机器学习", "Machine Learning in Finance", ["ML finance"], "金融机器学习用数据驱动模型完成预测、分类或特征提取，需要严格防范泄漏与过拟合。", ["overfitting", "cross-validation"])
      ])
    ]),

    C("financial-math", "金融数学", "Financial Mathematics", "数", "quant", "复利、贴现、概率与衍生品定价基础。", [
      G("time-value", "货币时间价值", "Time value of money", "比较不同时间点的现金流。", [
        E("simple-interest", "单利", "Simple Interest", ["simple rate"], "单利只对原始本金计息，不把已产生利息加入下一期本金。", ["compound-interest", "future-value"]),
        E("compound-interest", "复利", "Compound Interest", ["利滚利"], "复利把已产生利息加入本金，后续利息基于更高余额计算。", ["simple-interest", "effective-rate"]),
        E("present-value", "现值", "Present Value", ["PV"], "现值是未来现金流按要求回报率折算到今天的价值。", ["future-value", "discount-rate"]),
        E("future-value", "终值", "Future Value", ["FV"], "终值是当前资金按给定收益率增长到未来某时点的金额。", ["present-value", "compound-interest"]),
        E("discount-rate", "折现率", "Discount Rate", ["贴现率"], "折现率把未来现金流转换为现值，并体现时间价值与风险补偿。", ["present-value", "wacc"]),
        E("annuity", "年金", "Annuity", ["定期现金流"], "年金是在固定间隔支付的一系列相同或规则化现金流。", ["present-value", "amortization"])
      ]),
      G("pricing-math", "定价数学", "Pricing mathematics", "概率与无套利框架。", [
        E("probability", "概率", "Probability", ["可能性"], "概率量化事件发生的不确定程度。", ["expected-return", "distribution"]),
        E("normal-distribution", "正态分布", "Normal Distribution", ["高斯分布"], "正态分布是对称钟形分布，但金融收益常表现出厚尾和偏度。", ["standard-deviation", "tail-risk"]),
        E("black-scholes", "Black-Scholes模型", "Black-Scholes Model", ["BSM", "期权定价模型"], "Black-Scholes在一组理想化假设下给出欧式期权的理论定价关系。", ["implied-volatility", "delta"]),
        E("no-arbitrage", "无套利原则", "No-arbitrage Principle", ["一价定律"], "无套利原则要求相同未来现金流在同一条件下不应长期存在不同价格。", ["arbitrage", "risk-neutral-pricing"]),
        E("risk-neutral-pricing", "风险中性定价", "Risk-neutral Pricing", ["风险中性测度"], "风险中性定价在调整后的概率框架下按无风险利率折现预期现金流。", ["no-arbitrage", "option-pricing"])
      ])
    ]),

    C("strategies", "交易策略", "Trading Strategies", "策", "strategy", "趋势、反转、套利和执行方法。", [
      G("directional-strategies", "方向策略", "Directional strategies", "跟随或逆向处理价格变化。", [
        E("trend-following", "趋势跟随", "Trend Following", ["顺势交易"], "趋势跟随在价格形成持续方向后进入，并用退出规则控制反转风险。", ["moving-average", "breakout"]),
        E("mean-reversion-strategy", "均值回归策略", "Mean-reversion Strategy", ["反转策略"], "均值回归策略押注价格或价差偏离典型水平后回归。", ["mean-reversion", "bollinger-bands"]),
        E("breakout-strategy", "突破策略", "Breakout Strategy", ["破位交易"], "突破策略在价格离开区间或关键水平时建立方向头寸。", ["breakout", "donchian-channel"]),
        E("momentum-strategy", "动量策略", "Momentum Strategy", ["强者恒强"], "动量策略买入相对强势资产或卖出相对弱势资产，假设趋势短期延续。", ["momentum", "factor-investing"]),
        E("swing-trading", "波段交易", "Swing Trading", ["波段"], "波段交易试图捕捉持续数天到数周的价格摆动。", ["trend", "position-size"]),
        E("scalping", "剥头皮", "Scalping", ["超短线"], "剥头皮通过大量极短持仓争取小幅价差，对成本与执行质量高度敏感。", ["spread", "slippage"])
      ]),
      G("relative-strategies", "相对价值策略", "Relative-value strategies", "交易两个或多个相关价格之间的关系。", [
        E("pair-trading", "配对交易", "Pairs Trading", ["统计套利"], "配对交易同时持有相关资产的多空头寸，押注价差关系恢复。", ["mean-reversion", "correlation"]),
        E("carry-strategy", "Carry策略", "Carry Strategy", ["持有收益策略"], "Carry策略获取持有资产、期限或利差产生的收益，同时承担价格反转风险。", ["carry-trade", "roll-yield"]),
        E("market-neutral", "市场中性", "Market Neutral", ["beta中性"], "市场中性策略通过多空配置降低整体市场方向暴露。", ["beta", "long-short"]),
        E("grid-trading", "网格交易", "Grid Trading", ["网格", "grid"], "网格交易在预设价格间隔反复挂单，震荡时可能获利，单边趋势中风险会累积。", ["range", "martingale"]),
        E("martingale", "马丁格尔策略", "Martingale", ["马丁", "加仓摊平"], "马丁格尔在亏损后增加仓位试图一次回本，可能造成非线性爆仓风险。", ["grid-trading", "liquidation"])
      ])
    ]),

    C("personal-finance", "个人与家庭金融", "Personal & Family Finance", "家", "personal", "从工资、银行卡、房贷到家庭现金流：每天都会用到的金融。", [
      G("income-and-benefits", "工资、税与保障", "Income, tax & benefits", "先看懂工资条，再理解到手收入和长期保障。", [
        E("payslip", "工资怎么看", "How to Read a Payslip", ["工资条", "薪资单"], "工资条把基本工资、加班、奖金、税费和其他扣款列在一起，解释为什么合同工资不等于到账工资。", ["gross-net-income", "personal-income-tax", "pension"]),
        E("gross-net-income", "税前工资和税后工资", "Gross vs Net Income", ["到手工资", "实发工资"], "税前工资是扣款前的收入，税后工资是扣除税费和个人缴费后真正到账的钱。", ["payslip", "personal-income-tax"]),
        E("personal-income-tax", "个人所得税", "Personal Income Tax", ["个税", "PAYE"], "个人所得税是个人取得工资等收入后，按当地规则向政府缴纳的税。", ["gross-net-income", "payslip"]),
        E("social-security", "社会保障缴费", "Social Security Contributions", ["社保", "社会保险"], "社会保障缴费把个人和单位的一部分资金放进养老、医疗等公共保障体系。", ["pension", "personal-health-insurance"]),
        E("pension", "养老金", "Pension", ["退休金", "养老账户"], "养老金是在工作期间积累或由社会制度提供、用于退休后生活的长期收入。", ["retirement-account", "compound-interest"]),
        E("retirement-account", "退休账户", "Retirement Account", ["KiwiSaver", "养老投资账户"], "退休账户把长期储蓄集中投资，通常设有税收、雇主缴款或提取限制。", ["pension", "asset-allocation"]),
        E("housing-provident-fund", "住房公积金", "Housing Provident Fund", ["公积金"], "住房公积金是部分地区由职工和单位共同缴存、主要用于住房相关支出的长期资金。", ["mortgage-home", "gross-net-income"])
      ]),
      G("everyday-banking", "银行账户与存款", "Everyday banking", "钱放在哪里、为什么有利息、什么时候能取。", [
        E("bank-account", "银行账户", "Bank Account", ["储蓄卡账户", "银行卡账户"], "银行账户是银行替你记录存款、收付款和余额变化的一本电子账。", ["demand-deposit", "payment-system"]),
        E("demand-deposit", "活期存款", "Demand Deposit", ["活期", "current account"], "活期存款可以随时使用，流动性高，但利率通常较低。", ["fixed-deposit", "deposit-rate"]),
        E("fixed-deposit", "定期存款", "Term Deposit", ["定存", "定期"], "定期存款把钱按约定时间存入银行，通常用较高利率换取较低的随时使用自由。", ["demand-deposit", "deposit-rate"]),
        E("deposit-rate", "存款利率", "Deposit Rate", ["储蓄利率"], "存款利率决定银行为使用你的存款而支付多少利息。", ["fixed-deposit", "compound-interest"]),
        E("payment-system", "支付系统", "Payment System", ["银行卡支付", "转账系统"], "支付系统负责在付款人、银行、商户和收款人之间传递并结算付款指令。", ["bank-account", "third-party-payment"]),
        E("third-party-payment", "第三方支付", "Third-party Payment", ["支付宝", "微信支付"], "第三方支付把你的付款指令连接到银行卡、余额或商户收款账户。", ["payment-system", "bank-account"])
      ]),
      G("credit-and-installments", "信用卡、分期与消费贷", "Credit & instalments", "今天先买、以后还钱的真实成本。", [
        E("credit-card", "信用卡", "Credit Card", ["贷记卡"], "信用卡让银行先替你付款，你在账单日后按规则还钱。", ["minimum-payment", "credit-card-interest"]),
        E("minimum-payment", "信用卡最低还款", "Minimum Payment", ["最低还款额"], "最低还款只是避免立即严重逾期的最低金额，不代表剩余欠款不用付利息。", ["credit-card", "credit-card-interest"]),
        E("credit-card-interest", "信用卡利息", "Credit Card Interest", ["循环利息"], "信用卡利息是没有在免息期内按规则还清欠款时产生的借款成本。", ["minimum-payment", "apr"]),
        E("huabei", "花呗与先买后付", "Buy Now Pay Later", ["花呗", "BNPL"], "先买后付把购物款推迟或分期支付，方便不等于没有成本和逾期后果。", ["installment-payment", "consumer-loan"]),
        E("installment-payment", "分期付款", "Instalment Payment", ["分期", "月供"], "分期付款把一次性支出拆成多期偿还，总成本可能包含利息、服务费或商品溢价。", ["huabei", "effective-rate"]),
        E("consumer-loan", "消费贷", "Consumer Loan", ["个人消费贷款"], "消费贷是个人为购物、装修或其他消费取得的贷款，需要按期偿还本金和利息。", ["installment-payment", "credit-score"])
      ]),
      G("home-and-car-loans", "房贷与车贷", "Home & car loans", "大额长期负债怎么还、利率变化会怎样。", [
        E("car-loan", "车贷", "Car Loan", ["汽车贷款"], "车贷是为购买汽车取得的分期贷款，车辆可能同时作为担保物。", ["consumer-loan", "ltv"]),
        E("mortgage-home", "房贷", "Home Mortgage", ["住房贷款", "按揭贷款"], "房贷是用房产作抵押、分很多年偿还的长期贷款。", ["mortgage", "equal-principal-interest"]),
        E("equal-principal", "等额本金", "Equal Principal", ["本金等额"], "等额本金每期偿还相同本金，利息随剩余本金减少，所以前期月供较高、之后逐步下降。", ["equal-principal-interest", "early-repayment"]),
        E("equal-principal-interest", "等额本息", "Equal Principal and Interest", ["固定月供"], "等额本息把本金和利息安排成大致相同的每期还款额，前期利息占比通常更高。", ["equal-principal", "amortization"]),
        E("early-repayment", "提前还贷", "Early Loan Repayment", ["提前还款"], "提前还贷是按合同在原定期限前归还部分或全部本金，需要比较节省的利息、罚金和资金机会成本。", ["mortgage-home", "discount-rate"])
      ]),
      G("family-protection", "家庭保险", "Family protection", "用小额确定支出对抗大额不确定损失。", [
        E("personal-insurance", "家庭保险规划", "Family Insurance Planning", ["家庭保障"], "家庭保险规划先识别家庭承受不起的事故，再决定用哪些保险转移风险。", ["personal-health-insurance", "personal-life-insurance"]),
        E("personal-health-insurance", "医疗保险", "Personal Health Insurance", ["医保", "医疗险"], "医疗保险按合同或公共制度承担部分合格医疗费用。", ["health-insurance", "deductible"]),
        E("personal-life-insurance", "寿险", "Personal Life Insurance", ["人寿保险"], "寿险在被保险人身故等约定情形下向受益人给付资金，用于保护家庭收入缺口。", ["life-insurance", "personal-insurance"]),
        E("car-insurance", "车险", "Motor Insurance", ["汽车保险"], "车险覆盖车辆损失、第三方责任或其他约定风险，具体以保单条款为准。", ["property-insurance", "liability-insurance"])
      ]),
      G("household-management", "家庭财务管理", "Household money management", "知道钱从哪来、到哪去、家庭能扛多久。", [
        E("household-balance-sheet", "家庭资产负债表", "Household Balance Sheet", ["家庭财务盘点"], "家庭资产负债表把你拥有的东西和欠的钱放在一起，算出家庭净资产。", ["household-cashflow", "household-debt-ratio"]),
        E("household-cashflow", "家庭现金流", "Household Cash Flow", ["收支表", "家庭预算"], "家庭现金流记录一段时间内进来的钱和花出去的钱。", ["household-balance-sheet", "savings-rate"]),
        E("emergency-fund", "应急资金", "Emergency Fund", ["紧急备用金"], "应急资金是为失业、疾病或突发支出预留的高流动性现金。", ["demand-deposit", "household-cashflow"]),
        E("savings-rate", "储蓄率", "Savings Rate", ["存钱比例"], "储蓄率表示收入中有多少没有被当期消费掉。", ["household-cashflow", "emergency-fund"]),
        E("household-debt-ratio", "家庭负债率", "Household Debt Ratio", ["负债收入比", "DTI"], "家庭负债率用来观察债务或每月还款相对收入和资产是否过重。", ["household-balance-sheet", "mortgage-home"]),
        E("inflation-household", "通胀与生活成本", "Inflation & Cost of Living", ["物价上涨", "生活成本"], "通胀会让同样的钱能买到的东西变少，并改变存款、工资和贷款的实际价值。", ["inflation", "cpi"]),
        E("compound-household", "复利与长期储蓄", "Compounding for Households", ["利滚利", "长期复利"], "复利让本金和过去产生的收益一起继续产生新收益，时间越长影响越明显。", ["compound-interest", "retirement-account"])
      ])
    ]),

    C("regulation", "金融监管", "Financial Regulation", "规", "institutions", "市场准入、投资者保护、反洗钱与审慎监管。", [
      G("regulation-core", "监管基础", "Regulatory basics", "为什么监管金融机构和市场行为。", [
        E("financial-regulation", "金融监管", "Financial Regulation", ["金融法规"], "金融监管通过准入、行为和审慎规则维护市场诚信、消费者权益与金融稳定。", ["conduct-regulation", "prudential-regulation"]),
        E("conduct-regulation", "行为监管", "Conduct Regulation", ["市场行为监管"], "行为监管关注销售、披露、利益冲突和客户公平待遇。", ["investor-protection", "financial-regulation"]),
        E("prudential-regulation", "审慎监管", "Prudential Regulation", ["资本监管"], "审慎监管要求金融机构保持资本、流动性和风险治理能力。", ["capital-adequacy", "systemic-risk"]),
        E("investor-protection", "投资者保护", "Investor Protection", ["消费者保护"], "投资者保护包括真实披露、资产隔离、适当性和争议处理等机制。", ["disclosure", "conduct-regulation"]),
        E("market-manipulation", "市场操纵", "Market Manipulation", ["操纵市场"], "市场操纵是通过虚假交易、误导信息或其他手段不当影响市场价格或交易。", ["insider-trading", "market-surveillance"]),
        E("insider-trading", "内幕交易", "Insider Trading", ["内幕信息交易"], "内幕交易通常指利用未公开重大信息交易证券，具体违法边界依司法辖区。", ["market-manipulation", "material-information"]),
        E("aml", "反洗钱", "AML", ["Anti-Money Laundering", "反洗钱合规"], "反洗钱制度要求机构识别客户、监测可疑活动并履行报告义务。", ["kyc", "sanctions"]),
        E("kyc", "了解你的客户", "KYC", ["Know Your Customer", "实名认证"], "KYC是机构识别和核实客户身份、风险与业务目的的过程。", ["aml", "customer-due-diligence"]),
        E("suitability", "适当性", "Suitability", ["投资者适当性"], "适当性要求产品或建议与客户知识、经验、财务状况和目标相匹配。", ["investor-protection", "risk-disclosure"]),
        E("risk-disclosure", "风险披露", "Risk Disclosure", ["风险提示"], "风险披露向客户说明产品机制、费用、利益冲突和重要损失情景。", ["suitability", "conduct-regulation"])
      ])
    ])
  ];

  const articles = {
    "bollinger-bands": {
      definition: "布林带由一条中轨和上下两条波动带组成。经典设置以20周期简单移动平均线为中轨，上下轨分别位于中轨正负2个标准差。由于标准差随波动变化，通道会自动收缩或扩张。",
      principle: "它把“价格相对近期均值的位置”和“近期波动大小”放在同一张图里。波动上升时带宽扩大，波动下降时带宽收窄；价格触及上轨只说明处于近期分布的较高位置，并不自动等于超买或卖出信号。",
      formula: { main: "Middle = SMAₙ(P)\nUpper = Middle + k × σₙ(P)\nLower = Middle − k × σₙ(P)", note: "常用 n = 20、k = 2；P通常取收盘价。" },
      params: [["20", "统计窗口", "决定均值和标准差观察长度"], ["2", "标准差倍数", "决定上下轨距离"], ["Close", "价格来源", "也可按策略改用典型价格"]],
      example: "若20日均价为100，20日价格标准差为3，使用2倍标准差时，上轨约为106，下轨约为94。价格到106不代表必跌；强趋势中价格可能沿上轨持续运行。",
      understanding: "把布林带想成一条会随市场呼吸的河道：平静时河道变窄，波动时河道变宽。价格在河道边缘出现，只说明它远离近期平均位置。",
      uses: ["观察波动收缩后的潜在扩张（Bollinger Squeeze）", "判断价格相对近期均值的位置", "与趋势、成交量或结构信号组合使用", "构建均值回归或趋势跟随规则"],
      pros: ["同时呈现均值与波动", "参数直观、跨市场通用", "可用于趋势与震荡两类框架"],
      limitations: ["基于历史价格，存在滞后", "价格触轨并非独立买卖信号", "固定参数不适合所有周期与资产"],
      mistakes: ["看到上轨就做空、下轨就做多", "忽略强趋势中的“贴轨”现象", "为了回测结果频繁调参造成过拟合"],
      risk: "布林带不能预测下一根K线，也不能替代仓位、止损与流动性管理。"
    },
    "macd": {
      definition: "MACD是以指数移动平均线为基础的趋势动量指标。常见版本由MACD线、信号线和柱状图组成。",
      principle: "短周期EMA比长周期EMA更快响应新价格。两者差值扩大，表示短期与长期价格趋势分离；差值收窄，表示动量减弱。信号线用于平滑MACD线，柱状图展示二者距离。",
      formula: { main: "MACD Line = EMA₁₂ − EMA₂₆\nSignal Line = EMA₉(MACD Line)\nHistogram = MACD Line − Signal Line", note: "12、26、9是传统参数，不是任何市场的最优保证。" },
      params: [["12", "快线周期", "近期价格变化权重更高"], ["26", "慢线周期", "反映更长期的均衡"], ["9", "信号线周期", "平滑MACD线并形成交叉"]],
      example: "当12期EMA为105、26期EMA为101时，MACD线为4。若信号线为3.2，柱状图为0.8，表示短期动量仍高于其平滑趋势。",
      understanding: "可以把它理解为两辆不同速度的车：快车与慢车的距离反映趋势动量，距离开始缩短意味着快车正在减速，但不一定已经掉头。",
      uses: ["观察趋势方向与动量变化", "识别MACD线与信号线交叉", "观察零轴上下位置", "寻找价格与指标背离，但需后续确认"],
      pros: ["结构清晰，兼顾趋势与动量", "适合观察中短期方向变化", "参数和计算透明"],
      limitations: ["横盘中交叉噪声较多", "依赖历史价格并具有滞后", "背离可能持续很久"],
      mistakes: ["把金叉理解成必涨", "忽略零轴与大周期趋势", "仅凭柱状图缩短立即反向交易"],
      risk: "MACD是描述工具，不是收益承诺。使用杠杆时，滞后信号可能放大亏损。"
    },
    "treasury-bond": {
      definition: "国债是中央政府发行的债务证券。投资者把资金借给政府，政府按条款支付利息并在到期时偿还本金。不同国家对短、中、长期国债有不同命名与制度。",
      principle: "国债价格由未来现金流、市场利率、通胀预期、期限和主权信用共同决定。其他条件相同时，市场收益率上升会让既有固定息票债券价格下降，反之亦然。",
      formula: { main: "Price = Σ [Couponₜ / (1 + y)ᵗ] + Face Value / (1 + y)ⁿ", note: "y为对应期间到期收益率；现金流频率需与折现率匹配。" },
      params: [["面值", "到期本金", "通常也是票息计算基础"], ["票面利率", "合同利息", "不等于当前市场收益率"], ["到期日", "现金流期限", "影响久期与利率敏感度"]],
      example: "一张面值1,000、票息3%的固定利率国债每年支付30。若市场要求收益率升至4%，旧债券的3%票息吸引力下降，其价格通常会低于面值。",
      understanding: "国债像一份政府出具的借条。借条写死的利息不会因为市场利率变化而改变，所以市场通过调整这张借条的买卖价格来匹配新的收益要求。",
      uses: ["政府财政融资", "机构流动性与抵押品管理", "建立无风险或基准收益率曲线", "资产配置与风险对冲"],
      pros: ["通常具有较高流动性和透明度", "现金流相对明确", "可作为利率和资产定价基准"],
      limitations: ["仍有利率、通胀与汇率风险", "不同主权信用差异很大", "提前出售可能产生资本损失"],
      mistakes: ["认为政府债券价格不会下跌", "把票面利率等同于到期收益率", "忽视以外币计价国债的汇率风险"],
      risk: "“国债”不等于绝对无风险；应核对发行主体、币种、期限、法律条款和税务规则。"
    },
    "leverage": {
      definition: "杠杆用较少自有资金控制更大名义头寸。杠杆倍数通常等于名义头寸除以占用保证金。",
      principle: "价格变动作用于整个名义头寸，而不是只作用于保证金。因此，同样1%的市场波动，在10倍杠杆下约对应保证金的10%变化，尚未计入费用、滑点与维持保证金。",
      formula: { main: "Leverage = Notional Position / Margin\nP&L = Direction × Quantity × (Exit − Entry)\nReturn on Margin = P&L / Margin", note: "真实强平价还取决于维持保证金、费用、资金费率和平台规则。" },
      params: [["名义头寸", "实际市场敞口", "决定价格每跳对应的盈亏"], ["保证金", "占用资金", "是风险缓冲，不是最大损失承诺"], ["维持保证金", "持续持仓门槛", "跌破后可能被强制减仓"]],
      example: "用1,000保证金控制10,000名义头寸即10倍杠杆。标的反向变动5%，理论亏损约500，相当于保证金的50%，未计费用。",
      understanding: "杠杆像把价格变化的音量放大：市场只动一点，账户权益却可能大幅变化。它不提高预测准确率，只提高结果幅度。",
      uses: ["提高资本使用效率", "建立套期保值头寸", "以较少资金获得特定市场敞口"],
      pros: ["资金占用较少", "便于精确配置风险敞口", "多空方向通常都可使用"],
      limitations: ["亏损和费用同步放大", "可能在判断最终正确前先被强平", "波动和跳空会让计划失效"],
      mistakes: ["把可开最大仓位当成适合仓位", "只看杠杆倍数而不看总名义敞口", "忽略相关仓位同时亏损"],
      risk: "高杠杆可能在极短时间内造成全部保证金损失，部分市场还可能出现负余额或追加责任。"
    },
    "delta": {
      definition: "Delta是期权价格对标的价格的一阶敏感度。它近似表示标的价格变动一个单位时，期权理论价格变化多少。",
      principle: "Call的Delta通常在0到1之间，Put通常在-1到0之间。Delta会随标的价格、时间和波动率变化，因此不是固定常数。它也常用于构建Delta中性对冲。",
      formula: { main: "Delta = ∂V / ∂S\nApprox. option change ≈ Delta × underlying change", note: "这是小幅变化的一阶近似；较大变化需要考虑Gamma等高阶效应。" },
      params: [["V", "期权价值", "受多项定价因素共同影响"], ["S", "标的价格", "Delta针对它的边际变化"], ["Gamma", "Delta变化率", "解释Delta为什么会漂移"]],
      example: "某Call的Delta为0.60。若标的上涨1元，在其他条件变化不大的短区间内，期权价格大约上涨0.60元；实际结果会受Gamma、波动率和时间影响。",
      understanding: "Delta像期权暂时复制了多少份标的：0.60 Delta的Call，在非常小的价格变化下，表现近似0.60份标的，但这个比例会不断变化。",
      uses: ["估计小幅标的变动对期权的影响", "比较不同执行价的方向暴露", "构建Delta对冲", "监控组合净方向风险"],
      pros: ["直观量化方向敏感度", "便于组合风险汇总", "是动态对冲的核心变量"],
      limitations: ["只是一阶局部近似", "会随市场条件不断变化", "不能单独描述时间和波动率风险"],
      mistakes: ["把Delta当成固定胜率", "忽略Gamma导致的大幅变化", "只对冲Delta而忽略Vega与流动性"],
      risk: "真实对冲存在离散调整、交易成本、跳空和模型误差，Delta中性不等于无风险。"
    },
    "etf": {
      definition: "ETF是一种基金，同时像股票一样在交易所连续买卖。许多ETF按规则跟踪指数，也有主动型、商品型和债券型产品。",
      principle: "ETF具有一级市场与二级市场。普通投资者在交易所买卖份额；授权参与者可用一篮子资产创设或赎回大额份额，套利机制通常促使市场价格靠近基金净值。",
      formula: { main: "NAV per share = (Fair value of assets − Liabilities) / Shares outstanding", note: "盘中市场价格由订单供需决定，可能相对NAV出现折价或溢价。" },
      params: [["跟踪指数", "投资规则", "决定主要风险来源"], ["费率", "持有成本", "会长期侵蚀回报"], ["跟踪误差", "复制偏离", "衡量基金与基准差异"]],
      example: "若ETF每份净值为100，而市场价为100.30，则处于约0.3%的溢价。是否值得套利还要考虑申赎门槛、费用、税务和执行风险。",
      understanding: "ETF像一个装着一篮子资产的透明盒子，盒子的份额能在交易所随时交易；大机构还能把盒子拆成资产或用资产组装成盒子。",
      uses: ["低成本获得市场或行业敞口", "资产配置与再平衡", "盘中交易或套期保值", "获取债券、商品或因子策略敞口"],
      pros: ["分散化和交易便利结合", "多数产品持仓与规则透明", "费用常低于传统主动基金"],
      limitations: ["可能有折溢价和跟踪误差", "复杂ETF存在路径依赖", "流动性需同时看份额和底层资产"],
      mistakes: ["认为所有ETF都被动且低风险", "只看成交量不看底层资产流动性", "长期持有日度杠杆ETF却忽略复利路径"],
      risk: "ETF不会消除其底层资产风险；交易前应阅读产品说明、复制方法、费用和税务安排。"
    },
    "cfd": {
      definition: "差价合约是客户与提供商之间的场外衍生合约，按标的从开仓到平仓的价格变化结算现金差额，通常不转移标的资产所有权。",
      principle: "交易者选择方向和规模并缴纳保证金。盈亏随全部名义头寸变化，持仓还可能产生点差、佣金、隔夜融资和货币转换等成本。",
      formula: { main: "P&L = Direction × Contract size × Quantity × (Close − Open) − Costs", note: "不同经纪商对合约规模、报价、强平与费用的定义不同。" },
      params: [["合约规模", "每手对应数量", "决定每点盈亏"], ["保证金率", "最低资金比例", "与杠杆互为近似倒数"], ["融资费率", "跨夜成本", "长期持有可能显著累积"]],
      example: "若1手合约代表100单位标的，从50做多至51，毛盈利为100；再扣点差、佣金和融资费用。若价格跌至49，则毛亏损100。",
      understanding: "你不是买下资产，而是与提供商签一份“从现在到平仓，价格差由谁付给谁”的合同。",
      uses: ["多空交易股票、指数、外汇或商品价格", "短期套期保值", "以保证金方式管理市场敞口"],
      pros: ["多市场集中接入", "做多做空便利", "名义仓位调整灵活"],
      limitations: ["属于场外合约并有对手方风险", "杠杆与融资成本显著", "报价和强平规则因提供商不同"],
      mistakes: ["把CFD当作真正持有股票", "只比较点差而忽略总成本", "在高波动时使用接近上限的杠杆"],
      risk: "CFD是高风险杠杆产品，可能迅速亏损。应确认提供商监管实体、客户资金安排和负余额规则。"
    },
    "perpetual-contract": {
      definition: "永续合约是没有固定到期日的期货式衍生品。交易者不必换月，但会按规则定期支付或收取资金费率。",
      principle: "当永续价格高于现货指数时，资金费率通常鼓励空头、抑制多头；反之亦然。平台常用标记价格而非最后成交价评估未实现盈亏和清算。",
      formula: { main: "Funding payment ≈ Position notional × Funding rate\nMargin ratio = Account equity / Position notional", note: "方向、结算频率、标记价格和清算公式均以平台规则为准。" },
      params: [["资金费率", "多空周期支付", "会随市场偏离变化"], ["标记价格", "风险参考价", "常用于清算而非实际成交"], ["维持保证金率", "最低权益比例", "仓位越大通常要求越高"]],
      example: "持有10,000美元名义多头，资金费率为+0.01%且多头支付时，本期费用约1美元；多期叠加后会影响长期持仓回报。",
      understanding: "它像一张永不到期的期货票，但为了不让票价长期偏离现货，多空双方会定期互付“校准费”。",
      uses: ["无需换月的方向交易", "对冲加密现货敞口", "资金费率或基差策略"],
      pros: ["没有固定到期日", "多空和杠杆操作便利", "流动性常集中于主流合约"],
      limitations: ["资金费率可持续侵蚀收益", "交易所和合约规则差异大", "极端行情存在清算与ADL风险"],
      mistakes: ["只看方向不看资金费率", "用最后成交价估计强平而忽略标记价格", "把逐仓理解成不会继续追加保证金"],
      risk: "永续合约可在全天候市场中迅速强平。平台、托管、稳定币和自动减仓风险也需要一并考虑。"
    },
    "ytm": {
      definition: "到期收益率是让债券全部未来现金流的现值等于当前市场价格的单一折现率。它便于比较不同价格、票息和期限的债券。",
      principle: "债券价格下降时，为使相同现金流折现后等于更低价格，YTM会上升；反之亦然。YTM计算隐含持有至到期且票息以同一收益率再投资等假设。",
      formula: { main: "Price = Σ [Couponₜ / (1 + YTM)ᵗ] + Face Value / (1 + YTM)ⁿ", note: "多数附息债的YTM需要数值迭代求解；注意年化与付息频率。" },
      params: [["市场价格", "当前买入成本", "与YTM反向变化"], ["票息现金流", "期间收入", "再投资假设会影响实现收益"], ["剩余期限", "折现期数", "期限越长通常越敏感"]],
      example: "面值1,000、票息5%的债券若以950买入并持有至到期，除票息外还可能获得50的到期资本回升，因此YTM通常高于5%。",
      understanding: "YTM像把债券所有未来收款折成一个统一年化回报率，但它是基于假设的比较尺，不是提前卖出时保证拿到的收益。",
      uses: ["比较不同附息结构的债券", "形成收益率曲线", "债券估值和相对价值分析"],
      pros: ["把价格与全部现金流统一", "市场通用且便于比较", "可直接进入久期等风险计算"],
      limitations: ["假设持有至到期", "假设票息按同率再投资", "不直接计入违约、税务和交易成本"],
      mistakes: ["把YTM等同票面利率", "认为YTM一定会成为实际持有收益", "比较不同信用或币种时忽略风险差异"],
      risk: "高YTM可能反映高违约概率或低流动性，而不是免费获得的高回报。"
    },
    "rsi": {
      definition: "RSI是0到100之间的动量振荡器，比较指定周期内平均上涨幅度与平均下跌幅度。经典参数为14。",
      principle: "近期上涨幅度相对更大时RSI上升，近期下跌幅度相对更大时RSI下降。70与30常被用作观察区间，但不是固定的反转开关。",
      formula: { main: "RS = Average Gainₙ / Average Lossₙ\nRSI = 100 − 100 / (1 + RS)", note: "Wilder原始算法采用平滑平均，不同平台初始化可能略有差异。" },
      params: [["14", "观察周期", "越短越敏感、噪声也更多"], ["70", "高位参考", "强趋势中可长期保持高位"], ["30", "低位参考", "低位不等于立即反弹"]],
      example: "若14期平均上涨为1.2、平均下跌为0.8，则RS=1.5，RSI约为60。它表示近期上涨动量较强，并不直接给出目标价。",
      understanding: "RSI像速度表，不是路线预测器。速度很快可能继续快，也可能减速；要结合道路方向，也就是趋势和结构。",
      uses: ["观察动量强弱", "识别高低区间", "研究价格与RSI背离", "辅助区间与趋势策略"],
      pros: ["范围固定、易于比较", "反应速度可调", "跨市场适用"],
      limitations: ["强趋势中容易长期钝化", "阈值选择依赖品种与周期", "背离不是精确入场信号"],
      mistakes: ["RSI超过70立即做空", "忽略大级别趋势", "只优化周期参数而不做样本外验证"],
      risk: "任何振荡器都可能在单边行情中连续给出逆势提示，应结合仓位和退出规则。"
    },
    "duration": {
      definition: "麦考利久期是债券现金流回收时间的现值加权平均；修正久期则把它转换为价格对收益率变化的一阶敏感度。",
      principle: "现金流越晚、票息越低、到期越长，久期通常越高。收益率小幅上升时，债券价格约按修正久期所示比例下降。",
      formula: { main: "Macaulay Duration = Σ[t × PV(CFₜ)] / Price\nModified Duration = Macaulay Duration / (1 + y/m)\nΔP/P ≈ −Modified Duration × Δy", note: "m为每年付息次数；较大利率变化需加入凸性修正。" },
      params: [["现金流时间", "回收速度", "越晚权重通常越高"], ["收益率", "折现权重", "改变远期现金流现值"], ["凸性", "二阶修正", "改善较大变动的估计"]],
      example: "修正久期为6的债券，若收益率平行上升0.50个百分点，价格一阶近似下跌约3%，未计凸性。",
      understanding: "久期不是简单的到期期限，而是所有现金流“平均多久拿回来”以及价格对利率多敏感的一把尺。",
      uses: ["比较债券利率敏感度", "匹配资产与负债期限风险", "构建利率对冲", "组合久期预算"],
      pros: ["把复杂现金流浓缩为单一敏感度", "便于组合层面汇总", "可快速估计小幅利率变化"],
      limitations: ["一阶近似忽略曲率", "默认收益率曲线平行变化", "含权债券需使用有效久期等方法"],
      mistakes: ["把久期当作债券剩余年限", "用久期估计巨大利率变化", "忽略不同期限利率非平行移动"],
      risk: "久期是模型敏感度，不保证真实价格按估计幅度变化，信用利差也会同时影响价格。"
    }
  };

  window.FIN_DATA = {
    meta: {
      title: "Finpedia 金融百科",
      description: "先用生活把金融讲懂，再进入专业知识。",
      updated: "2026-09"
    },
    categories,
    articles,
    featured: ["common-stock", "interest-rate", "credit-card", "mortgage-home", "etf", "leverage", "inflation", "emergency-fund", "macd", "treasury-bond"],
    searchExpansions: {
      "爆仓": ["liquidation", "forced-liquidation", "margin-call", "maintenance-margin"],
      "布林": ["bollinger-bands"],
      "国债": ["treasury-bond", "government-bonds", "yield-curve", "duration"],
      "delta": ["delta", "gamma", "option-greeks"],
      "杠杆": ["leverage", "margin", "liquidation"],
      "强平": ["forced-liquidation", "liquidation", "maintenance-margin"],
      "基金": ["public-fund", "etf", "index-fund", "nav"],
      "均线": ["moving-average", "sma", "ema", "wma"]
      ,"工资": ["payslip", "gross-net-income", "personal-income-tax"]
      ,"房贷": ["mortgage-home", "equal-principal", "equal-principal-interest", "early-repayment"]
      ,"信用卡": ["credit-card", "minimum-payment", "credit-card-interest"]
      ,"存钱": ["demand-deposit", "fixed-deposit", "deposit-rate", "savings-rate"]
      ,"家庭理财": ["household-cashflow", "household-balance-sheet", "emergency-fund"]
    }
  };
})();
