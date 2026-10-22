import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Check, Loader2, X, RefreshCw, Sparkles } from 'lucide-react';
import { readAndOptimizeImage, ATELIER_LIBRARY_IMAGES } from '../../utils/imageUpload';

interface ImageUploadButtonProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  compact?: boolean;
  className?: string;
}

export const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  value = '',
  onChange,
  label = 'Upload Image',
  compact = false,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file triggers event
    e.target.value = '';

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const optimizedDataUrl = await readAndOptimizeImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.88,
        format: 'image/jpeg'
      });

      onChange(optimizedDataUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Compact Mode (for quick image swap right on the product card or table row)
  if (compact) {
    return (
      <div className={`relative inline-block ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={handleTriggerUpload}
          disabled={isProcessing}
          className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-[#1A1A1A] hover:text-[#3C1322] border border-[#E8E2D7] shadow-soft transition cursor-pointer flex items-center gap-1 text-xs"
          title="Click to upload a new confection image"
        >
          {isProcessing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3C1322]" />
          ) : uploadSuccess ? (
            <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    );
  }

  // Full Editor Mode (for detail modal or SEO section)
  return (
    <div className={`space-y-2.5 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
          {label}
        </label>
        
        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-[#736B63] hover:text-[#1A1A1A] transition cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-[#FFD147]" />
            <span>{showPresets ? 'Hide Presets' : 'Atelier Presets'}</span>
          </button>

          <span className="text-[#E8E2D7]">|</span>

          <button
            type="button"
            onClick={() => setShowUrlField(!showUrlField)}
            className="text-[#736B63] hover:text-[#1A1A1A] transition cursor-pointer"
          >
            {showUrlField ? 'Hide URL Input' : 'Enter URL Manually'}
          </button>
        </div>
      </div>

      {/* Main Upload Box & Live Preview */}
      <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D7] flex flex-col sm:flex-row items-center gap-4">
        {/* Thumbnail Preview */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-[#E8E2D7] shrink-0 flex items-center justify-center group shadow-2xs">
          {value ? (
            <>
              <img
                src={value}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              <div
                onClick={handleTriggerUpload}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white"
                title="Replace photo"
              >
                <RefreshCw className="w-4 h-4" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-[#736B63]">
              <ImageIcon className="w-6 h-6 stroke-1 mb-1" />
              <span className="text-[9px] font-mono">No Image</span>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-[#3C1322] animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Action Button & Details */}
        <div className="flex-1 flex flex-col items-start gap-1.5 w-full">
          <div className="flex flex-wrap items-center gap-2 w-full">
            <button
              type="button"
              onClick={handleTriggerUpload}
              disabled={isProcessing}
              className="px-4 py-2 bg-[#3C1322] hover:bg-[#280A15] disabled:opacity-50 text-[#FAF7F2] rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-2 shadow-soft"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Optimizing Image...</span>
                </>
              ) : uploadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#88C057]" />
                  <span>Image Uploaded!</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device</span>
                </>
              )}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-2 bg-white hover:bg-rose-50 text-[#736B63] hover:text-rose-700 border border-[#E8E2D7] hover:border-rose-200 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                title="Clear image"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <span className="text-[10px] text-[#736B63] font-light">
            Supports PNG, JPG, WebP, HEIC up to 10MB. Automatically optimized for retina displays.
          </span>

          {errorMsg && (
            <span className="text-[11px] text-rose-600 font-medium">
              {errorMsg}
            </span>
          )}
        </div>
      </div>

      {/* Collapsible Atelier Library Preset Picker */}
      {showPresets && (
        <div className="p-3 bg-white rounded-xl border border-[#E8E2D7] space-y-2 animate-fade-in shadow-soft">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block font-semibold">
            Choose from Atelier Confection Library:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ATELIER_LIBRARY_IMAGES.map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition cursor-pointer ${
                  value === preset.url
                    ? 'border-[#3C1322] bg-[#FAF7F2]'
                    : 'border-[#E8E2D7] hover:border-[#1A1A1A] bg-white'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-7 h-7 rounded object-cover border border-[#E8E2D7]"
                />
                <span className="text-[11px] text-[#1A1A1A] truncate">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible Manual URL Input */}
      {showUrlField && (
        <div className="space-y-1 animate-fade-in">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/products/mango_sunbeam.jpg or https://..."
            className="w-full bg-[#FAF7F2] border border-[#E8E2D7] focus:border-[#3C1322] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
