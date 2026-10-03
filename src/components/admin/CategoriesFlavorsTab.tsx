import React, { useState } from 'react';
import {
  FolderTree,
  Palette,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { api } from '../../services/api';

interface CategoriesFlavorsTabProps {
  categories: any[];
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
  flavors: any[];
  setFlavors: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string) => void;
}

export const CategoriesFlavorsTab: React.FC<CategoriesFlavorsTabProps> = ({
  categories,
  setCategories,
  flavors,
  setFlavors,
  showToast
}) => {
  const [subTab, setSubTab] = useState<'categories' | 'flavors'>('categories');

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catDisplayOrder, setCatDisplayOrder] = useState('0');

  // Flavor Modal State
  const [isFlavorModalOpen, setIsFlavorModalOpen] = useState(false);
  const [editingFlavor, setEditingFlavor] = useState<any | null>(null);
  const [flavName, setFlavName] = useState('');
  const [flavSlug, setFlavSlug] = useState('');
  const [flavColor, setFlavColor] = useState('#E58B12');
  const [flavSecondaryColor, setFlavSecondaryColor] = useState('#FEF7EC');
  const [flavDescription, setFlavDescription] = useState('');
  const [flavFeatured, setFlavFeatured] = useState(false);
  const [flavActive, setFlavActive] = useState(true);

  // Open Category Create/Edit
  const openCategoryModal = (cat?: any) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name || '');
      setCatSlug(cat.slug || '');
      setCatDescription(cat.description || '');
      setCatDisplayOrder(String(cat.display_order || 0));
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatSlug('');
      setCatDescription('');
      setCatDisplayOrder(String(categories.length + 1));
    }
    setIsCategoryModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      const payload = {
        name: catName.trim(),
        slug: catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: catDescription.trim(),
        display_order: parseInt(catDisplayOrder) || 0
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
        setCategories(prev =>
          prev.map(c => (c.id === editingCategory.id ? { ...c, ...payload } : c))
        );
        showToast(`Category "${catName}" updated!`);
      } else {
        const created = await api.createCategory(payload);
        setCategories(prev => [...prev, created]);
        showToast(`Category "${catName}" created!`);
      }
      setIsCategoryModalOpen(false);
    } catch {
      showToast('Error saving category');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await api.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      showToast(`Category "${name}" deleted`);
    } catch {
      setCategories(prev => prev.filter(c => c.id !== id));
      showToast(`Deleted "${name}"`);
    }
  };

  // Open Flavor Create/Edit
  const openFlavorModal = (flav?: any) => {
    if (flav) {
      setEditingFlavor(flav);
      setFlavName(flav.name || '');
      setFlavSlug(flav.slug || '');
      setFlavColor(flav.color || '#E58B12');
      setFlavSecondaryColor(flav.secondary_color || '#FEF7EC');
      setFlavDescription(flav.description || '');
      setFlavFeatured(Boolean(flav.is_featured));
      setFlavActive(flav.is_active !== false);
    } else {
      setEditingFlavor(null);
      setFlavName('');
      setFlavSlug('');
      setFlavColor('#E58B12');
      setFlavSecondaryColor('#FEF7EC');
      setFlavDescription('');
      setFlavFeatured(false);
      setFlavActive(true);
    }
    setIsFlavorModalOpen(true);
  };

  // Save Flavor
  const handleSaveFlavor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flavName.trim()) return;

    try {
      const payload = {
        name: flavName.trim(),
        slug: flavSlug.trim() || flavName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        color: flavColor,
        secondary_color: flavSecondaryColor,
        description: flavDescription.trim(),
        is_featured: flavFeatured,
        is_active: flavActive
      };

      if (editingFlavor) {
        await api.updateFlavor(editingFlavor.id, payload);
        setFlavors(prev =>
          prev.map(f => (f.id === editingFlavor.id ? { ...f, ...payload } : f))
        );
        showToast(`Flavor "${flavName}" updated!`);
      } else {
        const created = await api.createFlavor(payload);
        setFlavors(prev => [...prev, created]);
        showToast(`Flavor "${flavName}" created!`);
      }
      setIsFlavorModalOpen(false);
    } catch {
      showToast('Error saving flavor');
    }
  };

  // Delete Flavor
  const handleDeleteFlavor = async (id: string, name: string) => {
    if (!confirm(`Delete flavor "${name}"?`)) return;
    try {
      await api.deleteFlavor(id);
      setFlavors(prev => prev.filter(f => f.id !== id));
      showToast(`Flavor "${name}" deleted`);
    } catch {
      setFlavors(prev => prev.filter(f => f.id !== id));
      showToast(`Deleted "${name}"`);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
            Categories & Flavors Vault
          </h1>
          <p className="text-xs text-[#736B63] font-light mt-1">
            Manage product collections, orchard fruit flavors, and aesthetic confectionery palettes in the database.
          </p>
        </div>

        {/* SUBTAB TOGGLE */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setSubTab('categories')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                subTab === 'categories'
                  ? 'bg-[#3C1322] text-[#FAF7F2] font-medium shadow-xs'
                  : 'text-[#736B63] hover:text-[#1A1A1A]'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Categories ({categories.length})</span>
            </button>
            <button
              onClick={() => setSubTab('flavors')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                subTab === 'flavors'
                  ? 'bg-[#3C1322] text-[#FAF7F2] font-medium shadow-xs'
                  : 'text-[#736B63] hover:text-[#1A1A1A]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Flavors ({flavors.length})</span>
            </button>
          </div>

          <button
            onClick={() => (subTab === 'categories' ? openCategoryModal() : openFlavorModal())}
            className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer shadow-soft"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add {subTab === 'categories' ? 'Category' : 'Flavor'}</span>
          </button>
        </div>
      </div>

      {/* CATEGORIES SECTION */}
      {subTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                Confectionery Product Categories ({categories.length})
              </h3>
              <p className="text-[11px] text-[#736B63]">
                Categories govern storefront filtering, navigation bars, and product organization.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead>
                <tr className="border-b border-[#E8E2D7] text-[#736B63] font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Slug</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right rtl:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D7]">
                {categories.map((cat: any) => (
                  <tr key={cat.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#736B63]">
                      #{cat.display_order ?? 0}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#1A1A1A]">
                      {cat.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-[#736B63]">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-3 text-[#736B63] max-w-xs truncate">
                      {cat.description || 'No description provided.'}
                    </td>
                    <td className="py-3 px-3 text-right rtl:text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openCategoryModal(cat)}
                          className="p-1.5 text-[#736B63] hover:text-[#1A1A1A] hover:bg-white rounded-lg border border-transparent hover:border-[#E8E2D7] cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 text-[#736B63] hover:text-[#C53030] hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FLAVORS SECTION */}
      {subTab === 'flavors' && (
        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                The Flavor Vault ({flavors.length})
              </h3>
              <p className="text-[11px] text-[#736B63]">
                Artisanal fruit flavor profiles, color codes, and visual palette swatches.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {flavors.map((fl: any) => (
              <div
                key={fl.id}
                className="p-4 rounded-xl border border-[#E8E2D7] bg-[#FAF7F2] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: fl.color || '#E58B12' }}
                      />
                      <span className="font-serif font-bold text-sm text-[#1A1A1A]">
                        {fl.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {fl.is_featured && (
                        <span className="px-1.5 py-0.5 bg-[#FFF9E6] text-[#B7791F] border border-[#FFD147]/50 rounded-full text-[9px] font-bold">
                          Featured
                        </span>
                      )}
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                          fl.is_active !== false
                            ? 'bg-[#E8F5E9] text-[#2E7D32]'
                            : 'bg-[#FFEBEE] text-[#C53030]'
                        }`}
                      >
                        {fl.is_active !== false ? 'Active' : 'Archived'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#736B63] line-clamp-2 leading-relaxed">
                    {fl.description || 'Artisanal slow-cooked fruit infusion.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E8E2D7] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#736B63]">{fl.color}</span>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono border border-black/5"
                      style={{ backgroundColor: fl.secondary_color || '#FAF5EE', color: '#1A1A1A' }}
                    >
                      light bg
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openFlavorModal(fl)}
                      className="p-1 text-[#736B63] hover:text-[#1A1A1A] cursor-pointer"
                      title="Edit Flavor"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFlavor(fl.id, fl.name)}
                      className="p-1 text-[#736B63] hover:text-[#C53030] cursor-pointer"
                      title="Delete Flavor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-[#736B63] hover:text-[#1A1A1A] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Molten Bonbons"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. molten-bonbons"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={catDisplayOrder}
                    onChange={(e) => setCatDisplayOrder(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description for category banner..."
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="pt-3 border-t border-[#E8E2D7] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D7] rounded-full text-xs text-[#736B63] hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs px-5 py-2 cursor-pointer shadow-soft flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLAVOR MODAL */}
      {isFlavorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                {editingFlavor ? 'Edit Flavor' : 'Add New Flavor'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFlavorModalOpen(false)}
                className="text-[#736B63] hover:text-[#1A1A1A] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFlavor} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                  Flavor Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Valencia Passion Fruit"
                  value={flavName}
                  onChange={(e) => setFlavName(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={flavColor}
                      onChange={(e) => setFlavColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-[#E8E2D7] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={flavColor}
                      onChange={(e) => setFlavColor(e.target.value)}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-2.5 py-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                    Light Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={flavSecondaryColor}
                      onChange={(e) => setFlavSecondaryColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-[#E8E2D7] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={flavSecondaryColor}
                      onChange={(e) => setFlavSecondaryColor(e.target.value)}
                      className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-2.5 py-2 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                  Flavor Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Aromatic tasting notes..."
                  value={flavDescription}
                  onChange={(e) => setFlavDescription(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="flex items-center gap-4 text-xs">
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flavFeatured}
                    onChange={(e) => setFlavFeatured(e.target.checked)}
                    className="rounded border-[#E8E2D7]"
                  />
                  <span>Featured Flavor</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flavActive}
                    onChange={(e) => setFlavActive(e.target.checked)}
                    className="rounded border-[#E8E2D7]"
                  />
                  <span>Active in Store</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#E8E2D7] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFlavorModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D7] rounded-full text-xs text-[#736B63] hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs px-5 py-2 cursor-pointer shadow-soft flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Flavor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
