import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Star,
  Maximize2,
  Tag,
  Package,
  Boxes,
  Scale,
  Sparkles,
  Save,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductStatus } from '../../types';
import { api } from '../../services/api';

interface ProductManagementModalProps {
  product: Product | null;
  isOpen: boolean;
  isNew?: boolean;
  onClose: () => void;
  onSaved: (savedProduct: Product) => void;
  onDeleted?: (productId: string) => void;
}

const FACTORY_GALLERY_IMAGES = [
  { url: '/images/products/gallery/confection_img_1.jpg', label: 'Mint & Fruit Candy Packaging (علبة وكيس)' },
  { url: '/images/products/gallery/confection_img_2.jpg', label: 'Toffee Eclairs Stuffed with Chocolate (برطمان وكيس)' },
  { url: '/images/products/gallery/confection_img_3.jpg', label: 'Butter Bonbon Stuffed Chocolate (Zahra)' },
  { url: '/images/products/gallery/confection_img_4.jpg', label: 'Fruit Bonbon Spec Sheet 4' },
  { url: '/images/products/gallery/confection_img_5.jpg', label: 'Fruit Bonbon Spec Sheet 5' },
  { url: '/images/products/gallery/confection_img_6.jpg', label: 'Fruit Bonbon Spec Sheet 6' },
  { url: '/images/products/gallery/confection_img_7.jpg', label: 'Fruit Bonbon Spec Sheet 7' },
  { url: '/images/products/gallery/confection_img_8.jpg', label: 'Fruit Bonbon Spec Sheet 8' },
  { url: '/images/products/mango_sunbeam.jpg', label: 'Mango Sunbeam Pouch' },
  { url: '/images/products/berry_afterglow.jpg', label: 'Berry Afterglow Pouch' },
  { url: '/images/products/citrus_comet.jpg', label: 'Citrus Comet Pouch' },
  { url: '/images/products/sun_chaser_box.jpg', label: 'Sun Chaser Keepsake Box' },
  { url: '/images/products/orchard_reserve.jpg', label: 'Orchard Reserve Wood Box' },
  { url: '/images/products/evening_citrus.jpg', label: 'Evening Citrus Pouch' },
];

export const ProductManagementModal: React.FC<ProductManagementModalProps> = ({
  product,
  isOpen,
  isNew = false,
  onClose,
  onSaved,
  onDeleted,
}) => {
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    price: 220,
    weight: '250g',
    weight_value: 250,
    weight_unit: 'g',
    box_quantity: 10,
    box_quantity_label: '10 Boxes / Carton',
    pack_quantity: '250g Pouch',
    pack_quantity_pieces: 24,
    flavor: '',
    description: '',
    tasting_notes: [],
    status: 'available',
    images: ['/images/products/mango_sunbeam.jpg'],
    stock_quantity: 50,
    badge: 'POPULAR',
    category: 'all',
  });

  // UI State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [newTagInput, setNewTagInput] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewZoomUrl, setPreviewZoomUrl] = useState<string | null>(null);

  // Initialize or reset form when product opens
  useEffect(() => {
    if (product) {
      const imgList = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [product.image || '/images/products/mango_sunbeam.jpg'];

      const parsedWeight = parseFloat(product.weight) || product.weight_value || 250;
      const unitMatch = String(product.weight || '').match(/[a-zA-Z]+/);
      const parsedUnit = (unitMatch ? unitMatch[0] : (product.weight_unit || 'g')).toLowerCase();

      const notes = Array.isArray(product.tasting_notes) && product.tasting_notes.length > 0
        ? product.tasting_notes
        : (Array.isArray(product.fruitNotes) && product.fruitNotes.length > 0 ? product.fruitNotes : ['Wild Orchard Fruits', 'Cultured Cream']);

      setFormData({
        id: product.id,
        name: product.name || '',
        sku: product.sku || `TMK-${(product.name || 'CONFECTION').slice(0, 6).toUpperCase()}-001`,
        price: Number(product.price) || 220,
        weight: product.weight || `${parsedWeight}${parsedUnit}`,
        weight_value: parsedWeight,
        weight_unit: parsedUnit,
        box_quantity: product.box_quantity ?? 10,
        box_quantity_label: product.box_quantity_label || `${product.box_quantity ?? 10} Boxes / Carton`,
        pack_quantity: product.pack_quantity || `${parsedWeight}${parsedUnit} Pouch`,
        pack_quantity_pieces: product.pieces_per_pack || product.pack_quantity_pieces || 24,
        flavor: product.flavor || product.flavor_name || product.name || '',
        description: product.description || '',
        tasting_notes: notes,
        status: (product.status as ProductStatus) || (product.in_stock ? 'available' : 'out_of_stock'),
        images: imgList,
        stock_quantity: product.stock_quantity ?? 50,
        badge: product.badge || '',
        category: product.category || 'all',
        accentColor: product.accentColor || '#C26715',
        lightBgColor: product.lightBgColor || '#FAF5EE',
      });
      setSelectedImageIndex(0);
    } else if (isNew) {
      setFormData({
        name: '',
        sku: `TMK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        price: 220,
        weight: '250g',
        weight_value: 250,
        weight_unit: 'g',
        box_quantity: 10,
        box_quantity_label: '10 Boxes / Carton',
        pack_quantity: '250g Pouch',
        pack_quantity_pieces: 24,
        flavor: '',
        description: '',
        tasting_notes: ['Wild Forest Berries', 'European Cultured Butter'],
        status: 'available',
        images: ['/images/products/gallery/confection_img_1.jpg'],
        stock_quantity: 50,
        badge: 'NEW',
        category: 'all',
      });
      setSelectedImageIndex(0);
    }
    setErrors({});
    setSaveSuccess(false);
  }, [product, isNew, isOpen]);

  if (!isOpen) return null;

  const images = formData.images && formData.images.length > 0 ? formData.images : ['/images/products/mango_sunbeam.jpg'];
  const activeImage = images[selectedImageIndex] || images[0];

  // Validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errs.name = 'Product name is required';
    }
    if (formData.price === undefined || Number(formData.price) <= 0 || isNaN(Number(formData.price))) {
      errs.price = 'Price must be a valid positive amount';
    }
    if (formData.weight_value === undefined || Number(formData.weight_value) <= 0) {
      errs.weight = 'Weight must be greater than 0';
    }
    if (formData.box_quantity === undefined || Number(formData.box_quantity) < 1) {
      errs.box_quantity = 'Box quantity must be at least 1 box';
    }
    if (!formData.pack_quantity?.trim()) {
      errs.pack_quantity = 'Pack quantity/specification is required';
    }
    if (formData.stock_quantity === undefined || Number(formData.stock_quantity) < 0) {
      errs.stock = 'Stock quantity cannot be negative';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save handler
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const weightString = `${formData.weight_value}${formData.weight_unit || 'g'}`;
      const payload: any = {
        ...formData,
        weight: weightString,
        image_url: images[0],
        images,
        image: images[0],
        status: formData.status,
        in_stock: (formData.status === 'available' || formData.status === 'published') && (Number(formData.stock_quantity) > 0),
      };

      let result: Product;
      if (isNew || !formData.id) {
        result = await api.createProduct(payload);
      } else {
        result = await api.updateProduct(formData.id, payload);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        onSaved(result || (payload as Product));
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Failed to save confection:', err);
      setErrors({ form: err.message || 'Failed to save confection data. Please check connection.' });
    } finally {
      setSaving(false);
    }
  };

  // Image actions
  const handleAddImage = (url: string) => {
    if (!url.trim()) return;
    const updated = [...images, url.trim()];
    setFormData({ ...formData, images: updated });
    setSelectedImageIndex(updated.length - 1);
    setShowImagePicker(false);
    setCustomImageUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (images.length <= 1) return;
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setFormData({ ...formData, images: updated });
    if (selectedImageIndex >= updated.length) {
      setSelectedImageIndex(updated.length - 1);
    }
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    if (indexToPrimary === 0) return;
    const selected = images[indexToPrimary];
    const remaining = images.filter((_, idx) => idx !== indexToPrimary);
    const updated = [selected, ...remaining];
    setFormData({ ...formData, images: updated });
    setSelectedImageIndex(0);
  };

  // Tasting notes chips
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const current = formData.tasting_notes || [];
    if (!current.includes(newTagInput.trim())) {
      setFormData({ ...formData, tasting_notes: [...current, newTagInput.trim()] });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const current = formData.tasting_notes || [];
    setFormData({ ...formData, tasting_notes: current.filter(t => t !== tagToRemove) });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-5xl bg-[#FAF7F2] dark:bg-[#0C080A] rounded-2xl border border-[#E8E2D7] dark:border-[#2A1622] shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto"
        >
          {/* Modal Header */}
          <div className="px-5 py-4 border-b border-[#E8E2D7] dark:border-[#2A1622] bg-white/70 dark:bg-[#140C12]/90 backdrop-blur-md flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FAF5EE] dark:bg-[#20101B] border border-[#E8E2D7] dark:border-[#381B2D] flex items-center justify-center text-[#1A1A1A] dark:text-[#FAF5EE]">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-serif font-medium text-[#1A1A1A] dark:text-[#FAF5EE]">
                  {isNew ? 'Create New Confection' : `Product Specifications: ${formData.name || 'Confection'}`}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-mono font-medium text-[#736B63] dark:text-[#B0A396]">
                    SKU: {formData.sku || 'PENDING'}
                  </span>
                  <span className="text-[10px] text-[#A89F91]">•</span>
                  <span className="text-[11px] text-[#736B63] dark:text-[#B0A396]">
                    Atelier Batch #{formData.id ? String(formData.id).slice(0, 6) : 'NEW'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Selector Badge */}
              <div className="relative">
                <select
                  value={formData.status || 'available'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer appearance-none pr-7 transition-colors ${
                    formData.status === 'available' || formData.status === 'published'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                      : formData.status === 'out_of_stock'
                      ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                      : formData.status === 'coming_soon'
                      ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                      : 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700'
                  }`}
                >
                  <option value="available">Available (In Stock)</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="hidden">Hidden / Archived</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] opacity-70">
                  ▼
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#736B63] hover:text-[#1A1A1A] dark:hover:text-[#FAF5EE] hover:bg-[#FAF7F2] dark:hover:bg-[#20101B] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errors.form && (
            <div className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/50 border-b border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Modal Body - 2 Columns Layout */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ======================================================== */}
            {/* LEFT COLUMN: PRODUCT IMAGES & GALLERY                    */}
            {/* ======================================================== */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#736B63] dark:text-[#B0A396] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Product Images ({images.length})
                </label>
                <button
                  type="button"
                  onClick={() => setShowImagePicker(true)}
                  className="text-xs font-semibold text-[#8B2D5C] dark:text-[#E0A8C4] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Image
                </button>
              </div>

              {/* Main Showcase Image */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] group shadow-xs">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt={formData.name || 'Confection image'}
                    initial={{ opacity: 0.3, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.3 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full object-contain p-2"
                  />
                </AnimatePresence>

                {/* Primary Badge */}
                {selectedImageIndex === 0 && (
                  <div className="absolute top-2.5 left-2.5 bg-[#FAF5EE]/95 dark:bg-[#0C080A]/90 backdrop-blur-xs text-[#1A1A1A] dark:text-[#FAF5EE] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#E8E2D7] dark:border-[#381B2D] flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 text-[#FFD147] fill-current" />
                    Cover Image
                  </div>
                )}

                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 dark:bg-black/60 text-[#1A1A1A] dark:text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                      title="Previous Image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 dark:bg-black/60 text-[#1A1A1A] dark:text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                      title="Next Image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Quick Expand Button */}
                <button
                  type="button"
                  onClick={() => setPreviewZoomUrl(activeImage)}
                  className="absolute bottom-2.5 right-2.5 p-1.5 rounded-md bg-white/80 dark:bg-black/60 text-[#1A1A1A] dark:text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                  title="Expand Full Resolution"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Thumbnails Gallery */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#736B63] dark:text-[#B0A396]">
                  <span>Gallery Thumbnails</span>
                  <span>{selectedImageIndex + 1} of {images.length}</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5">
                  {images.map((img, idx) => {
                    const isSelected = idx === selectedImageIndex;
                    return (
                      <div
                        key={`${img}-${idx}`}
                        className={`relative group/thumb flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#8B2D5C] ring-2 ring-[#8B2D5C]/30 scale-102'
                            : 'border-[#E8E2D7] dark:border-[#2A1622] hover:border-[#736B63] opacity-80 hover:opacity-100'
                        }`}
                        onClick={() => setSelectedImageIndex(idx)}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover bg-white dark:bg-[#140C12]" />
                        
                        {/* Thumbnail Action Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleSetPrimaryImage(idx); }}
                              className="p-1 rounded bg-white text-[#1A1A1A] hover:text-[#8B2D5C] cursor-pointer"
                              title="Set as Cover"
                            >
                              <Star className="w-3 h-3" />
                            </button>
                          )}
                          {images.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                              className="p-1 rounded bg-white text-rose-600 hover:text-rose-800 cursor-pointer"
                              title="Delete Image"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Image Thumbnail Button */}
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(true)}
                    className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-[#E8E2D7] dark:border-[#2A1622] hover:border-[#8B2D5C] text-[#736B63] hover:text-[#8B2D5C] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer"
                    title="Add new image"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-[9px] font-medium">Add</span>
                  </button>
                </div>
              </div>

              {/* Image Picker Drawer (Interactive Gallery Selection) */}
              {showImagePicker && (
                <div className="p-3.5 bg-white dark:bg-[#140C12] rounded-xl border border-[#E8E2D7] dark:border-[#2A1622] space-y-3 shadow-md">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1A1A1A] dark:text-[#FAF5EE]">
                    <span>Select Factory Packaging Photo</span>
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(false)}
                      className="text-[#736B63] hover:text-[#1A1A1A] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Preloaded Gallery Photos */}
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                    {FACTORY_GALLERY_IMAGES.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddImage(item.url)}
                        className="group relative aspect-square rounded-md overflow-hidden border border-[#E8E2D7] dark:border-[#2A1622] hover:border-[#8B2D5C] cursor-pointer bg-white"
                        title={item.label}
                      >
                        <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-[#8B2D5C]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Plus className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Or Custom URL Input */}
                  <div className="space-y-1.5 pt-2 border-t border-[#E8E2D7] dark:border-[#2A1622]">
                    <span className="text-[11px] text-[#736B63] dark:text-[#B0A396]">Or enter custom Image URL / Path:</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="/images/products/... or https://"
                        className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#0C080A] border border-[#E8E2D7] dark:border-[#2A1622] text-[#1A1A1A] dark:text-[#FAF5EE]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddImage(customImageUrl)}
                        disabled={!customImageUrl.trim()}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1A1A1A] text-white dark:bg-[#FAF5EE] dark:text-[#1A1A1A] disabled:opacity-40 cursor-pointer"
                      >
                        Insert
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: STRUCTURED PRODUCT INFORMATION             */}
            {/* ======================================================== */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Product Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#FAF5EE]">
                    Product Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Berry Afterglow"
                    className={`w-full text-sm font-medium px-3 py-2 rounded-xl bg-white dark:bg-[#140C12] border ${
                      errors.name ? 'border-rose-400 ring-1 ring-rose-400' : 'border-[#E8E2D7] dark:border-[#2A1622]'
                    } text-[#1A1A1A] dark:text-[#FAF5EE] focus:outline-hidden focus:border-[#8B2D5C]`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-medium text-[#736B63] dark:text-[#B0A396]">
                    Product SKU / ID
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="TMK-BERRY-001"
                    className="w-full text-sm font-mono px-3 py-2 rounded-xl bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] text-[#1A1A1A] dark:text-[#FAF5EE] focus:outline-hidden focus:border-[#8B2D5C]"
                  />
                </div>
              </div>

              {/* Flavor / Variant & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-7 space-y-1">
                  <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#FAF5EE]">
                    Flavor / Variant
                  </label>
                  <input
                    type="text"
                    value={formData.flavor || ''}
                    onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                    placeholder="e.g. Dark Forest Blackberry"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] text-[#1A1A1A] dark:text-[#FAF5EE] focus:outline-hidden focus:border-[#8B2D5C]"
                  />
                </div>

                <div className="sm:col-span-5 space-y-1">
                  <label className="text-xs font-medium text-[#736B63] dark:text-[#B0A396]">
                    Badge / Highlight
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="BEST SELLER / POPULAR"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] text-[#1A1A1A] dark:text-[#FAF5EE] focus:outline-hidden focus:border-[#8B2D5C]"
                  />
                </div>
              </div>

              {/* Pricing, Weight & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Price */}
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#FAF5EE]">
                    Product Price <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#736B63] dark:text-[#B0A396]">
                      EGP
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={formData.price !== undefined ? formData.price : 220}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className={`w-full text-sm font-bold pl-12 pr-3 py-2 rounded-xl bg-white dark:bg-[#140C12] border ${
                        errors.price ? 'border-rose-400 ring-1 ring-rose-400' : 'border-[#E8E2D7] dark:border-[#2A1622]'
                      } text-[#1A1A1A] dark:text-[#FAF5EE] focus:outline-hidden focus:border-[#8B2D5C]`}
                    />
                  </div>
                  {errors.price && <p className="text-[11px] text-rose-500">{errors.price}</p>}
                </div>

                {/* Structured Weight */}
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#FAF5EE] flex items-center gap-1">
                    <Scale className="w-3 h-3 text-[#736B63]" />
                    Weight
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min="1"
                      value={formData.weight_value !== undefined ? formData.weight_value : 250}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setFormData({
                          ...formData,
                          weight_value: val,
                          weight: `${val}${formData.weight_unit || 'g'}`,
                        });
                      }}
                      className="w-2/3 text-xs font-medium px-3 py-2 rounded-xl bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] text-[#1A1A1A] dark:text-[#FAF5EE] focus:outline-hidden focus:border-[#8B2D5C]"
                    />
                    <select
                      value={formData.weight_unit || 'g'}
                      onChange={(e) => {
                        const u = e.target.value;
                        setFormData({
                          ...formData,
                          weight_unit: u,
                          weight: `${formData.weight_value || 250}${u}`,
                        });
                      }}
                      className="w-1/3 text-xs font-medium px-2 py-2 rounded-xl bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] text-[#1A1A1A] dark:text-[#FAF5EE] cursor-pointer"
                    >
                      <option value="g">g (جرام)</option>
                      <option value="kg">kg (كيلو)</option>
                      <option value="ml">ml</option>
                      <option value="tin">Tin</option>
                      <option value="box">Box</option>
                    </select>
                  </div>
                </div>

                {/* Stock Quantity */}
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#FAF5EE]">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock_quantity ?? 50}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value, 10) || 0 })}
                    className="w-full text-xs font-mono font-medium px-3 py-2 rounded-xl bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] text-[#1A1A1A] dark:text-[#FAF5EE] focus:outline-hidden focus:border-[#8B2D5C]"
                  />
                </div>
              </div>

              {/* ======================================================== */}
              {/* QUANTITY SYSTEM ARCHITECTURE (CRYSTAL CLEAR SEPARATION)  */}
              {/* ======================================================== */}
              <div className="p-3.5 rounded-xl bg-[#FAF5EE] dark:bg-[#1A0E18] border border-[#E8E2D7] dark:border-[#2E1826] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3C1322] dark:text-[#E8BDD4]">
                  <Boxes className="w-3.5 h-3.5" />
                  <span>Packaging Architecture & Quantity Separation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Box Quantity */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#FAF5EE] flex items-center justify-between">
                      <span>Box Quantity (كرتونة)</span>
                      <span className="text-[10px] text-[#736B63] dark:text-[#B0A396]">Outer Container</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.box_quantity ?? 10}
                      onChange={(e) => {
                        const count = parseInt(e.target.value, 10) || 1;
                        setFormData({
                          ...formData,
                          box_quantity: count,
                          box_quantity_label: `${count} Boxes / Carton`,
                        });
                      }}
                      className="w-full text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] text-[#1A1A1A] dark:text-[#FAF5EE]"
                    />
                    <p className="text-[10px] text-[#736B63] dark:text-[#B0A396]">
                      Number of individual boxes/items inside a shipping carton (e.g. 10 Boxes).
                    </p>
                  </div>

                  {/* Pack Quantity */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#FAF5EE] flex items-center justify-between">
                      <span>Pack Quantity (العبوة)</span>
                      <span className="text-[10px] text-[#736B63] dark:text-[#B0A396]">Inner Contents</span>
                    </label>
                    <input
                      type="text"
                      value={formData.pack_quantity || ''}
                      onChange={(e) => setFormData({ ...formData, pack_quantity: e.target.value })}
                      placeholder="e.g. 250g Pouch / 24 Pieces"
                      className="w-full text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] text-[#1A1A1A] dark:text-[#FAF5EE]"
                    />
                    <p className="text-[10px] text-[#736B63] dark:text-[#B0A396]">
                      Packs or individual items sealed inside each box (e.g. 250g Pouch or 20 Pieces).
                    </p>
                  </div>
                </div>
              </div>

              {/* Tasting Notes / Highlights */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#FAF5EE] flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#736B63]" />
                  Tasting Notes & Flavor Notes
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] min-h-[42px] items-center">
                  {(formData.tasting_notes || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#FAF5EE] dark:bg-[#20101B] text-[#1A1A1A] dark:text-[#FAF5EE] border border-[#E8E2D7] dark:border-[#381B2D]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-500 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1 flex-1 min-w-[120px]">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="+ Add tasting note..."
                      className="text-xs bg-transparent border-none focus:outline-hidden text-[#1A1A1A] dark:text-[#FAF5EE] w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#FAF5EE]">
                  Product Description & Craft Profile
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Cold-macerated wild alpine strawberries, raspberries, and dark forest berries swirling in velvety cultured sweet cream..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-[#140C12] border border-[#E8E2D7] dark:border-[#2A1622] text-[#1A1A1A] dark:text-[#FAF5EE] focus:outline-hidden focus:border-[#8B2D5C] resize-none"
                />
              </div>

            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="px-5 py-3.5 border-t border-[#E8E2D7] dark:border-[#2A1622] bg-white/70 dark:bg-[#140C12]/90 backdrop-blur-md flex items-center justify-between flex-shrink-0">
            <div>
              {!isNew && formData.id && onDeleted && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${formData.name}?`)) {
                      onDeleted(formData.id!);
                      onClose();
                    }
                  }}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Confection
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 text-xs font-medium rounded-full border border-[#E8E2D7] dark:border-[#2A1622] text-[#736B63] dark:text-[#B0A396] hover:text-[#1A1A1A] dark:hover:text-[#FAF5EE] hover:bg-[#FAF7F2] dark:hover:bg-[#20101B] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 text-xs font-semibold rounded-full bg-[#1A1A1A] text-white dark:bg-[#FAF5EE] dark:text-[#1A1A1A] hover:bg-[#3C1322] dark:hover:bg-[#E8BDD4] transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{isNew ? 'Create Confection' : 'Save Product Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Image Preview Zoom Modal */}
      {previewZoomUrl && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setPreviewZoomUrl(null)}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewZoomUrl}
            alt="Preview High Resolution"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </AnimatePresence>
  );
};
