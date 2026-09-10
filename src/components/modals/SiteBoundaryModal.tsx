import React, { useState } from 'react';
import { SiteBoundary } from '../../types';
import {
  X,
  ShieldCheck,
  Upload,
  Square,
  Circle,
  Maximize2,
  Check,
  FileCode,
  Compass,
} from 'lucide-react';

interface SiteBoundaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  boundary: SiteBoundary;
  onSaveBoundary: (updated: SiteBoundary) => void;
  onImportGeoJSON: (geojson: any) => void;
}

export const SiteBoundaryModal: React.FC<SiteBoundaryModalProps> = ({
  isOpen,
  onClose,
  boundary,
  onSaveBoundary,
  onImportGeoJSON,
}) => {
  const [shape, setShape] = useState<'rectangle' | 'polygon' | 'circle'>(boundary.shape);
  const [areaHa, setAreaHa] = useState<number>(boundary.areaHa);
  const [widthM, setWidthM] = useState<number>(boundary.widthM);
  const [lengthM, setLengthM] = useState<number>(boundary.lengthM);
  const [latitude, setLatitude] = useState<number>(boundary.centerCoordinates?.[0] || 37.7749);
  const [longitude, setLongitude] = useState<number>(boundary.centerCoordinates?.[1] || -122.4194);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = () => {
    // 1 ha = 10,000 m2
    const computedAreaHa = Math.round((widthM * lengthM) / 10000);
    onSaveBoundary({
      ...boundary,
      shape,
      areaHa: computedAreaHa,
      widthM,
      lengthM,
      centerCoordinates: [latitude, longitude],
    });
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImportGeoJSON(json);
        setImportStatus(`Successfully parsed "${file.name}"`);
        setTimeout(() => setImportStatus(null), 3000);
      } catch (err) {
        setImportStatus('Invalid JSON/GeoJSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
                Site Boundary & Parcel Delimitation
              </h2>
              <p className="text-xs text-slate-400">Configure spatial masterplan footprint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SHAPE SELECTOR */}
        <div className="mb-5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Boundary Geometry Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setShape('rectangle')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all ${
                shape === 'rectangle'
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Square className="w-4 h-4" />
              <span>Rectangle</span>
            </button>
            <button
              onClick={() => setShape('circle')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all ${
                shape === 'circle'
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Circle className="w-4 h-4" />
              <span>Radial Circle</span>
            </button>
            <button
              onClick={() => setShape('polygon')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all ${
                shape === 'polygon'
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Polygon Grid</span>
            </button>
          </div>
        </div>

        {/* DIMENSIONS */}
        <div className="space-y-4 mb-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Parcel Width (Meters)</span>
              <span className="font-mono text-cyan-300 font-bold">{widthM} m</span>
            </div>
            <input
              type="range"
              min="500"
              max="4000"
              step="100"
              value={widthM}
              onChange={(e) => setWidthM(parseInt(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Parcel Length (Meters)</span>
              <span className="font-mono text-cyan-300 font-bold">{lengthM} m</span>
            </div>
            <input
              type="range"
              min="500"
              max="4000"
              step="100"
              value={lengthM}
              onChange={(e) => setLengthM(parseInt(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Calculated Masterplan Area:</span>
            <span className="text-base font-black text-cyan-400 font-mono">
              {Math.round((widthM * lengthM) / 10000)} Hectares ({Math.round(((widthM * lengthM) / 10000) * 2.471)} Acres)
            </span>
          </div>
        </div>

        {/* GEO-REFERENCE COORDINATES */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Center Latitude (WGS84)
            </label>
            <input
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Center Longitude (WGS84)
            </label>
            <input
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* IMPORT FILE */}
        <div className="mb-5 p-3 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Import GeoJSON / Shapefile / JSON</span>
          </div>
          <label className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer">
            Browse File
            <input
              type="file"
              accept=".json,.geojson"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <p className="text-xs text-cyan-400 mb-3 text-center font-medium">
            {importStatus}
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Check className="w-4 h-4" />
            Update Site Boundary
          </button>
        </div>
      </div>
    </div>
  );
};
