import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  VolumeX,
  PauseCircle,
  Sparkles,
  Trash2,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';
import type { UserSettings } from '../types/arcade';
import { soundService } from '../services/soundService';

interface SettingsPageProps {
  settings: UserSettings;
  onUpdateSettings: (partial: Partial<UserSettings>) => void;
  onResetProgress: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetMessage, setResetMessage] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="bg-[#111633] border border-indigo-500/30 rounded-2xl p-6 shadow-neon-purple">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-cyan-400" />
          ตั้งค่าระบบ (Arcade Settings)
        </h1>
        <p className="text-slate-300 text-sm mt-1">
          ปรับแต่งเสียง โหมดการเล่น และการหยุดเวลาอัตโนมัติให้เหมาะกับจังหวะการทำงานของคุณ
        </p>
      </div>

      {/* Settings Controls */}
      <div className="bg-[#111633] border border-indigo-500/25 rounded-2xl divide-y divide-slate-800/80">
        {/* Sound Toggle */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 mt-0.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="font-display font-bold text-white text-base">
                เสียงเอฟเฟกต์ในเกม (Sound Effects)
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ค่าเริ่มต้นจะปิดเสียงไว้เพื่อไม่ให้รบกวนที่ทำงาน สามารถเปิดได้เมื่อต้องการ
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="settings-sound-toggle"
            onClick={() => {
              const next = !settings.soundEnabled;
              onUpdateSettings({ soundEnabled: next });
              if (next) {
                setTimeout(() => soundService.playClick(), 30);
              }
            }}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm transition ${
              settings.soundEnabled
                ? 'bg-cyan-500 text-slate-950 shadow-neon-cyan'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            {settings.soundEnabled ? 'เปิดอยู่ (ON)' : 'ปิดอยู่ (OFF)'}
          </button>
        </div>

        {/* Preferred Game Mode */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-300 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-base">
                โหมดการเล่นเริ่มต้น (Preferred Mode)
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                เลือกโหมดที่ต้องการใช้เป็นค่าเริ่มต้นเมื่อเข้าสู่หน้าเลือกด่าน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="settings-mode-relax"
              onClick={() => onUpdateSettings({ preferredMode: 'relax' })}
              className={`px-3.5 py-2 rounded-xl font-display font-semibold text-xs sm:text-sm transition ${
                settings.preferredMode === 'relax'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              โหมดพักสมอง (Relax)
            </button>
            <button
              type="button"
              data-testid="settings-mode-challenge"
              onClick={() => onUpdateSettings({ preferredMode: 'challenge' })}
              className={`px-3.5 py-2 rounded-xl font-display font-semibold text-xs sm:text-sm transition ${
                settings.preferredMode === 'challenge'
                  ? 'bg-pink-500 text-white'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              โหมดท้าทาย (Challenge)
            </button>
          </div>
        </div>

        {/* Auto-Pause on Tab Switch */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-300 mt-0.5">
              <PauseCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-base">
                หยุดเวลาอัตโนมัติเมื่อสลับแท็บ (Auto-Pause on Tab Switch)
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                เมื่อคุณสลับไปทำงานแท็บอื่น ระบบจะหยุดเวลาชั่วคราวให้อัตโนมัติทันที
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="settings-autopause-toggle"
            onClick={() =>
              onUpdateSettings({
                autoPauseOnTabSwitch: !settings.autoPauseOnTabSwitch,
              })
            }
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm transition ${
              settings.autoPauseOnTabSwitch
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            {settings.autoPauseOnTabSwitch ? 'เปิดอยู่ (ON)' : 'ปิดอยู่ (OFF)'}
          </button>
        </div>

        {/* Haptics Toggle */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-300 mt-0.5">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-base">
                ระบบสั่นตอบสนอง (Haptic Feedback)
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                สั่นเบา ๆ เมื่อค้นพบจุดแตกต่างบนอุปกรณ์ที่รองรับ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onUpdateSettings({ hapticsEnabled: !settings.hapticsEnabled })
            }
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm transition ${
              settings.hapticsEnabled
                ? 'bg-purple-500 text-white'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            {settings.hapticsEnabled ? 'เปิดอยู่ (ON)' : 'ปิดอยู่ (OFF)'}
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Player Progress */}
      <div className="bg-[#111633] border border-rose-500/30 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-base text-rose-300 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              ล้างข้อมูลสถิติและความคืบหน้า (Reset Progress)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              รีเซ็ตด่านที่ปลดล็อกและคะแนนสะสมทั้งหมดเพื่อเริ่มต้นเล่นใหม่ตั้งแต่ด่านที่ 1
            </p>
          </div>

          {!confirmReset ? (
            <button
              type="button"
              data-testid="reset-progress-init-btn"
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-display font-semibold text-xs sm:text-sm transition self-start sm:self-center"
            >
              ล้างข้อมูลความคืบหน้า
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="reset-progress-confirm-btn"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                  setResetMessage(true);
                  setTimeout(() => setResetMessage(false), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-display font-bold text-xs sm:text-sm transition"
              >
                ยืนยันการรีเซ็ต
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs sm:text-sm"
              >
                ยกเลิก
              </button>
            </div>
          )}
        </div>

        {resetMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            รีเซ็ตความคืบหน้าเรียบร้อยแล้ว!
          </div>
        )}
      </div>
    </div>
  );
};
