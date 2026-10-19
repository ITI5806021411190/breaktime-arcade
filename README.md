# BreakTime Arcade v1.0 — พักแป๊บ เกมเพลิน 🎮

**BreakTime Arcade** คือศูนย์รวมมินิเกมอาร์เคดบนเว็บเบราว์เซอร์ที่ออกแบบมาสำหรับการพักสายตาและผ่อนคลายสมองระหว่างทำงาน (3–10 นาทีต่อรอบ) โดยไม่ต้องสมัครสมาชิก ไม่มีโฆษณาคั่น ปิดเสียงเป็นค่าเริ่มต้น และมีระบบหยุดเวลาอัตโนมัติเมื่อสลับไปทำงานแท็บอื่น

---

## ✨ คุณสมบัติเด่นในเวอร์ชัน 1.0

1. **Responsive Arcade Center Dashboard**
   - ธีม Modern Arcade (Midnight Blue, Neon Purple, Electric Cyan, Vibrant Pink)
   - แสดงคลังเกม 10 เกม พร้อมสถานะจริง:
     - **#01 Spot the Difference — จับผิดภาพ** (`พร้อมเล่น` แบบ Lazy-loaded)
     - **#02–#10** (`Coming Soon` ปุ่มกดถูกปิดใช้งานอย่างชัดเจน ไม่สร้างเกมปลอม)
   - แถบแสดงเกมที่เล่นล่าสุด (`Recently Played`) และคะแนนสูงสุดจากข้อมูลจริงของผู้เล่น

2. **Game 01: Spot the Difference (จับผิดภาพ)**
   - **Deterministic Scene Graph Engine**: สร้างภาพซ้าย (ต้นฉบับ) และภาพขวา (ดัดแปลง) จากชุดข้อมูล Scene เดียวกันด้วย Normalized Coordinates (`0..100`)
   - **7 รูปแบบความแตกต่าง**: `remove-object`, `add-object`, `change-color`, `change-size`, `move-position`, `change-shape`, `replace-detail`
   - **24 ด่านที่เล่นได้จริง**:
     - **Easy (ด่าน 1–8)**: 3 จุดแตกต่าง, คำใบ้ 3 ครั้ง
     - **Normal (ด่าน 9–16)**: 5 จุดแตกต่าง, คำใบ้ 2 ครั้ง
     - **Hard (ด่าน 17–24)**: 7 จุดแตกต่าง, คำใบ้ 1 ครั้ง
   - **8 ธีมฉากภาพวาดการ์ตูนเวกเตอร์ (Original SVG Assets)**: สวนหน้าบ้าน, คาเฟ่ริมถนน, ชายหาด, ห้องทำงาน, ตลาดนัดกลางคืน, ฟาร์มสัตว์, สวนสนุก, และมหานครโลกอนาคต
   - **2 โหมดการเล่น**:
     - **Relax Mode (โหมดพักสมอง)**: ไม่จับเวลาถอยหลัง ไม่มี Game Over
     - **Challenge Mode (โหมดท้าทายเวลา)**: จับเวลาถอยหลัง มีโบนัสคอมโบ โบนัสเวลา และหักคะแนนเมื่อกดผิดหรือใช้คำใบ้
   - **Auto-Pause on Tab Switch**: หยุดเวลาให้อัตโนมัติทันทีเมื่อสลับไปทำงานที่แท็บอื่น

3. **Persistence & Multi-Game Architecture**
   - จัดเก็บข้อมูลผ่าน `localStorage` แบบมี Versioned Schema (`breaktime_arcade_storage_v1`) พร้อมระบบป้องกันข้อมูลเสียหาย (Corrupted JSON fallback)
   - หน้า **My Scores** แสดงสถิติจริง เหรียญความสำเร็จ และแสดง Empty State (`"ยังไม่มีสถิติ เริ่มเล่นเกมแรกกันเลย"`) เมื่อผู้เล่นยังไม่เคยเล่น
   - หน้า **Settings** ปรับตั้งค่าเสียง (ปิดเป็นค่าเริ่มต้น), โหมดการเล่นเริ่มต้น, ระบบสั่นตอบสนอง และรีเซ็ตความคืบหน้า

---

## 📁 โครงสร้างโปรเจกต์ (Project Architecture)

```text
breaktime-arcade/
├── e2e/
│   └── breaktime-arcade.spec.ts        # Playwright Browser E2E & Responsive Tests
├── src/
│   ├── app/
│   │   └── App.tsx                     # Main Application Shell & Navigation
│   ├── components/
│   │   ├── ArcadeHeader.tsx            # Top Navigation & Sound Toggle
│   │   ├── ArcadeHome.tsx              # Hero Banner & 10-Game Collection Grid
│   │   ├── GameCoverArt.tsx            # Original SVG Cover Illustrations
│   │   ├── MyScoresPage.tsx            # Player Scores, Stats & Achievements
│   │   └── SettingsPage.tsx            # Audio, Mode & Auto-Pause Preferences
│   ├── games/
│   │   ├── registry/
│   │   │   └── gameRegistry.ts         # Multi-Game Registry with Lazy Loading
│   │   └── spot-the-difference/
│   │       ├── components/             # GamePlayScreen, LevelSelectScreen, SceneCanvas
│   │       ├── engine/                 # sceneEngine.ts (Diff Builder, Hitbox & Validator)
│   │       ├── levels/                 # levels.ts (24 Playable Levels)
│   │       ├── scenes/                 # SceneArtworkRenderer.tsx (Vector Themes & Objects)
│   │       └── tests/                  # Vitest Unit & Gameplay Integration Tests
│   ├── services/
│   │   └── soundService.ts             # Web Audio API Synthesizer & Haptics
│   ├── storage/
│   │   └── storageService.ts           # Versioned localStorage Data Access Layer
│   ├── styles/
│   │   └── index.css                   # Tailwind CSS & Reduced-Motion Support
│   └── types/
│       ├── arcade.ts                   # Core Arcade & Storage Interfaces
│       └── spot.ts                     # Scene Graph & Difference Metadata Types
├── vercel.json                         # Ready-to-deploy Vercel SPA Configuration
├── vite.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

---

## 🚀 การติดตั้งและรันโปรเจกต์ (Getting Started)

```bash
cd breaktime-arcade

# 1. ติดตั้ง Dependencies
npm install

# 2. รันเซิร์ฟเวอร์สำหรับพัฒนา (Development Server)
npm run dev

# 3. ตรวจสอบ Type-safety (TypeScript)
npm run typecheck

# 4. รัน Unit & Component Tests (Vitest)
npm test

# 5. สร้าง Production Build
npm run build

# 6. ทดสอบ E2E ผ่านเบราว์เซอร์จริง (Playwright)
npm run test:e2e
```

---

## 🧩 วิธีเพิ่มเกมใหม่ในอนาคต (Adding a New Game)

1. สร้างโฟลเดอร์เกมใหม่ภายใต้ `src/games/<game-id>/`
2. สร้าง Component หลักที่รับ `GameComponentProps` (`{ onExitToArcade: () => void }`)
3. เปิดไฟล์ `src/games/registry/gameRegistry.ts`:
   - เพิ่ม `React.lazy(() => import('../<game-id>/...'))`
   - เปลี่ยน `status` ของเกมจาก `'coming-soon'` เป็น `'playable'`

---

## ☁️ การ Deploy ขึ้น Vercel

โปรเจกต์นี้เป็น Static SPA ที่พร้อม Deploy บน Vercel ทันทีโดยไม่ต้องใช้ Environment Variables หรือ Paid API Keys:
- ตั้งค่า **Root Directory** เป็น `breaktime-arcade`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- หรือรันผ่าน CLI: `npx vercel --prod` จากภายในโฟลเดอร์ `breaktime-arcade`
