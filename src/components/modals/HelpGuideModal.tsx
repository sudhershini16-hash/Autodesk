import React from 'react';
import {
  X,
  HelpCircle,
  MousePointer,
  RotateCw,
  ZoomIn,
  Move,
  Layers,
  Sparkles,
} from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
                User Guide & 3D Navigation
              </h2>
              <p className="text-xs text-slate-400">Master 3D site controls and analysis tools</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div>
            <h4 className="font-bold uppercase tracking-wider text-cyan-400 text-[11px] mb-2">
              3D Viewport Controls
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-slate-400" />
                  <strong>Rotate / Orbit Camera</strong>
                </span>
                <span className="font-mono text-cyan-300">Left Click + Drag</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Move className="w-4 h-4 text-slate-400" />
                  <strong>Pan / Move Canvas</strong>
                </span>
                <span className="font-mono text-cyan-300">Right Click + Drag (or Shift + Drag)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ZoomIn className="w-4 h-4 text-slate-400" />
                  <strong>Zoom In / Out</strong>
                </span>
                <span className="font-mono text-cyan-300">Mouse Scroll Wheel</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-slate-400" />
                  <strong>Select Object / Place Tool</strong>
                </span>
                <span className="font-mono text-cyan-300">Left Click Object / Terrain</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-cyan-400 text-[11px] mb-2">
              Camera Modes
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Use the floating 3D camera widget on the right to toggle between <strong>Perspective Orbit</strong>, <strong>Top Plan (2D)</strong>, <strong>Isometric</strong>, and <strong>Street Level Exploration</strong>.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-cyan-400 text-[11px] mb-2">
              Environmental Simulations
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Navigate to the <strong>Analysis</strong> tab to scrub the time-of-day slider for real-time solar shadow paths, alter wind vectors, and evaluate 15-minute walkability heatmaps.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
          >
            Got it, Let's Plan
          </button>
        </div>
      </div>
    </div>
  );
};
