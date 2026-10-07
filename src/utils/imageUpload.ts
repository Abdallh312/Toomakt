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
  { label: 'Cappuccino Candies (1 EGP)', url: '/images/products/cappuccino_candies_thumb.jpg' },
  { label: 'Milk Toffee (1 EGP)', url: '/images/products/milk_toffee_thumb.jpg' },
  { label: 'Eclairs Chocolate (0.5 EGP)', url: '/images/products/eclairs_05_thumb.jpg' },
  { label: 'Butter Eclairs (1 EGP)', url: '/images/products/butter_eclairs_1_thumb.jpg' },
  { label: 'Fruit Toffee (0.5 EGP)', url: '/images/products/fruit_toffee_05_thumb.jpg' },
  { label: 'Fruit Toffee (1 EGP)', url: '/images/products/fruit_toffee_1_thumb.jpg' },
  { label: 'Peanut & Chocolate (0.5 EGP)', url: '/images/products/peanut_chocolate_05_thumb.jpg' },
  { label: 'Peanut Eclairs (1 EGP)', url: '/images/products/peanut_eclairs_1_thumb.jpg' },
  { label: 'Butterm Caramel (0.5 EGP)', url: '/images/products/butterm_caramel_thumb.jpg' },
  { label: 'Coconut Chocolate (1 EGP)', url: '/images/products/coconut_chocolate_thumb.jpg' },
  { label: 'Mint Fruit Candy (0.5 EGP)', url: '/images/products/mint_fruit_thumb.jpg' },
  { label: 'Fruity Milk Cream (0.5 EGP)', url: '/images/products/fruity_milk_thumb.jpg' },
  { label: 'Royal Blue Butter Chocolate (0.5 EGP)', url: '/images/products/butter_chocolate_royalblue_thumb.jpg' },
  { label: 'Zahra Butter Bonbon', url: '/images/products/zahra_butter_bonbon_thumb.jpg' },
  { label: 'Brand Hero Spec', url: '/images/hero/hero_spec.jpg' },
];
