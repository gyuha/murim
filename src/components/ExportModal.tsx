import { useRef } from 'react';
import { Copy, Download, X } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  geojson: string;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export function ExportModal({ open, geojson, onClose, onToast }: ExportModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(geojson);
      onToast('GeoJSON을 클립보드에 복사했습니다.');
    } catch {
      textareaRef.current?.select();
      document.execCommand('copy');
      onToast('GeoJSON을 클립보드에 복사했습니다.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([geojson], { type: 'application/geo+json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'murim-map-locations.geojson';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast('GeoJSON 파일을 다운로드했습니다.');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card-surface border rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-kr font-bold text-lg">GeoJSON 데이터 내보내기</h2>
          <button
            type="button"
            onClick={onClose}
            className="opacity-60 hover:opacity-100 cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs" style={{ color: 'var(--text-mute)' }}>
          MapLibre GL JS, Leaflet, QGIS에 바로 불러올 수 있는 표준 GeoJSON FeatureCollection입니다.
        </p>

        <textarea
          ref={textareaRef}
          readOnly
          rows={10}
          value={geojson}
          className="w-full panel-surface border rounded-lg p-3 font-mono-code text-xs custom-scroll focus:outline-none"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="panel-surface border rounded-lg px-3.5 py-2 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>복사</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-lg px-3.5 py-2 text-sm font-semibold text-white flex items-center gap-1.5 cursor-pointer"
            style={{ background: 'var(--jade)' }}
          >
            <Download className="w-4 h-4" />
            <span>.geojson 다운로드</span>
          </button>
        </div>
      </div>
    </div>
  );
}
