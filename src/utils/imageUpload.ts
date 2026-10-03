/**
 * toomakt Atelier Image Upload & Optimization Utility
 * Handles client-side file reading, responsive canvas optimization, and Data URL generation.
 */

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
}

/**
 * Reads a File and returns an optimized Base64 Data URL.
 * Resizes large photos to appropriate web display dimensions while preserving crisp quality.
 */
export async function readAndOptimizeImage(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    format = 'image/jpeg'
  } = options;

  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file is not an image');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to load image for processing'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data URL if canvas 2D context is unavailable
          resolve(readerEvent.target?.result as string);
          return;
        }

        // High quality interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const optimizedDataUrl = canvas.toDataURL(format, quality);
        resolve(optimizedDataUrl);
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Built-in Atelier Library Presets for quick fallback selection
 */
export const ATELIER_LIBRARY_IMAGES = [
  { label: 'Mango Sunbeam', url: '/images/products/mango_sunbeam.jpg' },
  { label: 'Berry Afterglow', url: '/images/products/berry_afterglow.jpg' },
  { label: 'Citrus Comet', url: '/images/products/citrus_comet.jpg' },
  { label: 'Evening Citrus', url: '/images/products/evening_citrus.jpg' },
  { label: 'Orchard Reserve', url: '/images/products/orchard_reserve.jpg' },
  { label: 'Sun Chaser Box', url: '/images/products/sun_chaser_box.jpg' },
  { label: 'Brand Hero Spec', url: '/images/hero/hero_spec.jpg' },
];
