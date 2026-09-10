import React, { useState } from 'react';
import {
  X,
  Settings,
  Monitor,
  Grid,
  Sun,
  Eye,
  Check,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gridSnap: number;
  onUpdateGridSnap: (snap: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  gridSnap,
  onUpdateGridSnap,
}) => {
  const [graphicsQuality, setGraphicsQuality] = useState<'ultra' | 'high' | 'medium'>('high');
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [autoSaveInterval, setAutoSaveInterval] = useState<number>(3);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
                Application Preferences
              </h2>
              <p className="text-xs text-slate-400">Viewport rendering & snapping options</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* GRID SNAPPING */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
              Spatial Grid Snapping
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 5, 10].map((val) => (
                <button
                  key={val}
                  onClick={() => onUpdateGridSnap(val)}
                  className={`py-2 rounded-xl border text-center font-mono font-bold transition-all ${
                    gridSnap === val
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {val} Meter Grid
                </button>
              ))}
            </div>
          </div>

          {/* GRAPHICS PRESET */}
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
              3D Shadow & Shading Precision
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['medium', 'high', 'ultra'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setGraphicsQuality(q)}
                  className={`py-2 rounded-xl border text-center capitalize font-semibold transition-all ${
                    graphicsQuality === q
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* LOCAL STORAGE AUTO-SAVE */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-200 block">Local Auto-Save</span>
              <span className="text-[10px] text-slate-400">Stores masterplan locally in browser</span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">Every 3 mins</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
