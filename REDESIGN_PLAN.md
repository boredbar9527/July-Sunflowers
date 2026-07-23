# July Sunflowers → WebstaurantStore 风格改造方案

> 目标：在**不改动业务内容（产品、文案、联系方式）**的前提下，把网站一（July Sunflowers，`/Users/bozhang/July-Sunflowers-fresh`）的 UI 尽量改造成网站二（[WebstaurantStore](https://www.webstaurantstore.com/)）那种**密集型 B2B 电商货架**风格。
>
> 本文件只是方案，不含任何实际代码改动。

---

## 1. 两个网站的定位差异（改造的核心矛盾）

| 维度 | 网站一（现状） | 网站二（目标） |
|---|---|---|
| 类型 | 单页 editorial 品牌故事站 | 多品类电商 marketplace |
| 气质 | 暖米色、柔和、留白大、boutique | 纯白、信息密集、货架式、务实 |
| 主色 | 森林绿 `#167a58` + 暖沙/太阳黄 | 亮叶绿 CTA + 橙/红促销色 |
| 背景 | 米色渐变 + 网格 + 光晕 | 纯白 `#ffffff` + 浅灰分隔 |
| 字体 | "July Bloom" 手写体 + Avenir | 无衬线系统字体（Arial/Helvetica 类），紧凑 |
| 圆角 | 大圆角 28px，卡片漂浮 | 小圆角 3–4px，方正、细边框 |
| 导航 | 4 个锚点（Home/Collections/Story/Contact） | 顶部工具条 + 大搜索框 + 品类 mega menu |
| 产品卡 | 大图、故事化、mood 标签 | 缩略图 + 星级 + 价格（Case/Each）+ 绿色按钮 |
| 转化点 | "View details" 打开抽屉 | "Add to Cart" / 价格优先 |

**结论**：改造本质是"从品牌故事页 → 电商货架页"的视觉语言迁移。不需要重写业务数据，主要重做**设计 token、头部/导航、产品卡、页脚**四大块，并把 editorial 段落降级为电商促销区块。

---

## 2. 设计 Token 改造（`src/styles.css` 的 `:root`）

这是整个改造的地基，先改这里，全站气质立刻转向。

```css
:root {
  /* 背景：米色 → 纯白/浅灰 */
  --bg: #ffffff;
  --bg-deep: #f4f4f4;          /* 区块交替底色 */
  --surface: #ffffff;
  --surface-strong: #ffffff;
  --card: #ffffff;

  /* 文字：墨绿 → 近黑深灰 */
  --ink: #1a1a1a;
  --ink-soft: #595959;
  --line: #d6d6d6;             /* 细边框，电商感关键 */

  /* 品牌色：CTA 绿 + 促销橙/红（需用 DevTools 校准精确值） */
  --green: #5b9a1f;            /* WebstaurantStore 主 CTA 绿，近似值，建议实测校准 */
  --green-deep: #4a7d19;       /* hover 态 */
  --accent-orange: #f47c20;    /* 促销/横幅橙 */
  --sale-red: #c8102e;         /* 促销价红 */
  --star: #f5a623;             /* 星级评分黄 */

  /* 阴影：漂浮大阴影 → 极轻或无阴影 */
  --shadow: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-soft: 0 1px 2px rgba(0,0,0,0.08);

  /* 圆角：28px → 3px */
  --radius: 4px;
  --radius-sm: 3px;

  /* 容器：加宽到电商级 */
  --container: min(1400px, calc(100vw - 24px));
}
```

同时要做的全局调整：
- **删除/关闭** `body` 上的米色 `radial-gradient` 光晕、`body::before` 网格 mask 背景 → 换成纯白。
- **字体**：把 `font-family` 换成 `-apple-system, "Segoe UI", Arial, sans-serif`；`@font-face "July Bloom"` 可保留定义但不再用于正文/标题（电商站不用手写体）。整体字号调小、行高收紧（正文 14–15px）。
- 去掉全站 `data-reveal` 的入场渐显动画（或大幅缩短），电商站讲求"即时可见"。

---

## 3. 逐区块改造清单（`src/main.js` 的 `app.innerHTML`）

### 3.1 头部 Header（改动最大）
现状：logo + 4 锚点 nav + 一个 email chip，sticky。

改造成 WebstaurantStore 三层头部：

1. **顶部工具条 utility bar**（新增，浅色细条）：左侧 `Sign In / Create an Account / Rewards`，右侧 `Track Your Order` + 购物车图标（带数量角标）。纯展示即可，链接指向锚点或 `#`。
2. **主头部 main header**（白底）：
   - 左：现有 logo（保留 `logo-LCTJEtBP.png`，可去掉旁边的 "Sunny softness" eyebrow 副标）。
   - 中：**大搜索框**（占据大部分宽度），placeholder `What are you looking for?`，右端一个绿色搜索按钮。这是电商头部的视觉核心，务必做出来。
   - 右：账户 / 购物车图标区。
3. **品类导航条 category nav**（把原 4 个锚点扩成横向品类菜单）：用现有内容映射成品类项，如 `Facial Tissue`、`Bath Tissue`、`All Products`、`Our Story`、`Contact`，做成 WebstaurantStore 那种绿色/深色横条 + hover 下拉（下拉可先做静态 mega-menu 占位）。

### 3.2 Hero → 促销 Banner 轮播
现状：editorial hero（光晕、旋转 ring、hero-card、metric-card）。

改造：
- 删除 `hero-glow`、`hero-ring`、`hero__facts` 这些装饰。
- 改成 **横幅式促销 banner**：左文案（大标题 + 副文案 + 一个绿色 CTA 按钮 `Shop Now`）+ 右产品图，整体放在一个浅色/彩色块里，方正、满宽。
- 底部加 **轮播指示点 (1·2·3)**（可先做静态，不必真轮播）。

### 3.3 新增：品类瓷片 Category Tiles
WebstaurantStore 首页有一排 icon 品类瓷片。
- 新增一个 `Shop by Category` 网格区：用现有产品图做成 4–6 个方形瓷片（Facial 10 / Facial 24 / Bath 24 / Bath 6 / Bundle …），每片 = 图 + 品类名，点击滚动到对应产品并触发筛选（复用现有 `data-filter-select`）。

### 3.4 Proof 区 → 卖点条 / 服务承诺条
现状：3 张 proof-card（大圆角漂浮卡）。
- 改成 WebstaurantStore 那种**横向服务承诺条**（Fast Shipping / Responsible Sourcing / Septic-Safe 之类），小图标 + 短句，一行排开，细边框分隔，去掉漂浮阴影。文案沿用现有 `proofPoints`。

### 3.5 Products 区（核心：产品卡重做）
现状：故事化大卡（mood 标签、story、大图、"View details"）。保留 `#collections`、筛选 pill（All/Facial/Bath）逻辑。

产品卡改造为电商 SKU 卡：
- 结构：`缩略图（白底居中）` → `产品名（蓝色可点链接感）` → `星级评分 + 评价数（可用占位如 ★★★★★ 4.8 (120)）` → `价格区（$XX.XX / Case，副行 $X.XX / Each）` → `绿色 "Add to Cart" 按钮`。
- 视觉：白底、`1px solid var(--line)` 细边框、圆角 3px、hover 时轻微阴影 + 边框变绿。去掉 `product-card--wide` 大卡差异，统一为等宽网格（`grid-template-columns: repeat(auto-fill, minmax(220px,1fr))`，一行 4–5 个）。
- 保留 `data-open-product` → 点击卡片/图仍可打开详情抽屉，作为"商品详情"。
- **数据补充**：现有 `products` 数组缺 `price` / `rating` / `reviews` / `unit` 字段，需新增（见 §5）。

### 3.6 Categories 大分栏区
现状：facial / bath 两个大 category-card（editorial 图文分栏）。
- 可**保留但降密度**：改成 WebstaurantStore 的"促销大块"样式（浅色底、方正、图文左右分栏、绿色文字链接 `Shop Facial Tissue →`），去掉大圆角和柔和阴影。或直接合并进 §3.3 品类瓷片以精简。

### 3.7 Story 区 → 折叠/弱化
电商首页几乎不放长篇品牌故事拼贴。
- 建议把 `story` 区**大幅缩短**为一个窄条 "About July Sunflowers" 简介 + "Learn More" 链接，或移到页脚上方的单栏区块。founder 拼贴图 collage 去掉漂浮/错位排版，改成规整单图或小图排。

### 3.8 Contact 区 → 规整信息条
- 保留电话/邮箱/地址三卡，但改成方正、细边框、无大圆角的规整卡片，或并入页脚。

### 3.9 页脚 Footer（改动第二大）
现状：两行版权小 footer。
- 扩成 WebstaurantStore **多列大页脚**：深色或浅灰底，分 `Customer Service` / `Resources` / `About Us` / `Contact` 若干列链接（链接可指向现有锚点或 `#`），下方一条：社交图标 + `© 2026 July Sunflowers` + 隐私/条款占位链接。把现有电话、邮箱、地址收进 Contact 列。

### 3.10 产品详情抽屉 Product Drawer
- 结构基本可复用，但把内部样式对齐电商 PDP：加价格、星级、数量选择器占位、绿色 `Add to Cart` 大按钮；去掉大圆角与柔和抽屉动画，改成右侧规整面板。

---

## 4. 组件级视觉规则速查（改造时统一遵守）

- **按钮**：主按钮 = 绿底白字、圆角 3px、无渐变、hover 加深绿；次按钮 = 白底 + 灰边框 + 深字。促销按钮可用橙色。
- **卡片**：白底 + `1px solid #d6d6d6` + 圆角 3–4px + 极轻阴影；hover 才浮起一点。
- **价格**：加粗、深色；促销价用 `--sale-red`；单位小字灰色（`/ Case`、`/ Each`）。
- **链接**：产品名/品类用可点的蓝或绿，带 hover 下划线。
- **间距**：整体收紧，section 间距从超大留白降到中等；信息密度提高。
- **图片**：产品图统一白底居中、等比、留白一致，去掉倾斜/漂浮/光晕。

---

## 5. 数据模型补充（`src/main.js` 的 `products` 数组）

为支持电商产品卡，给每个产品对象加字段（示例）：

```js
{
  // …现有字段保留…
  price: "42.99",        // Case 价
  unitPrice: "1.79",     // Each 价
  unit: "Case",
  rating: 4.8,
  reviews: 126,
  badge: "Plus"          // 可选：订阅/促销角标
}
```

价格/评分可用占位值（标注为演示数据），不影响真实业务。

---

## 6. 实施阶段（建议顺序，每步可独立验证）

1. **P0 设计 Token**：改 `:root` 颜色/圆角/阴影 + 去背景光晕网格 + 换字体。→ 全站立即"变白变方"。
2. **P1 头部**：utility bar + 大搜索框 + 品类导航条。→ 电商识别度最强的一块。
3. **P2 产品卡 + 数据字段**：重做 product-card + 补 price/rating。→ 货架感成型。
4. **P3 Hero → 促销 banner** + 品类瓷片 + 服务承诺条。
5. **P4 页脚**扩成多列。
6. **P5 弱化 Story / 规整 Contact / 对齐详情抽屉**。
7. **P6 细节收尾**：hover 态、响应式断点（头部搜索框/导航在移动端塌缩）、去掉多余动画。

每阶段用 `npm run dev`（Vite）本地预览对照 WebstaurantStore 首页核对。

---

## 7. 需要准备的素材

- 图标：搜索放大镜、购物车、账户、星级、社交（Facebook/Instagram/YouTube）——用内联 SVG 即可，无需外链。
- 现有产品图可直接复用（`public/assets/*.png`），只需改为白底居中展示。
- logo 保留现有 `logo-LCTJEtBP.png`（WebstaurantStore 头部也是纯图形 logo，风格兼容）。

---

## 8. 风险与取舍

- **精确品牌色需实测**：方案里的绿/橙为近似值，落地时建议用浏览器 DevTools 吸取 WebstaurantStore 实际 CTA 绿与促销橙，替换 `:root` 里的近似值。
- **单页 vs 多页**：网站一是单页锚点结构，网站二是多页电商。本方案保持单页，用"锚点 + 静态 mega-menu 占位"模拟电商导航，不真正搭建多页/购物车后端。
- **内容密度**：WebstaurantStore 的密集感来自海量 SKU；本站只有 5 个产品，需靠"品类瓷片 + 重复卡 + 促销块"补足货架氛围，避免页面显空。
- **业务内容不变**：产品、SKU、规格、电话/邮箱/地址、公司名全部沿用，只改视觉与结构，符合"只改 UI"的要求。

---

*本方案基于对现有代码（`src/main.js` 599 行、`src/styles.css` 1192 行）和 WebstaurantStore 首页当前 UI 的分析编写。*
