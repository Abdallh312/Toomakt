import React, { useState } from 'react';
import {
  Star,
  Plus,
  Trash2,
  Check,
  X,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { api } from '../../services/api';

interface ReviewsTabProps {
  reviews: any[];
  setReviews: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (msg: string) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  reviews,
  setReviews,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Review Form State
  const [author, setAuthor] = useState('');
  const [productTag, setProductTag] = useState('Mango Sunbeam');
  const [rating, setRating] = useState('5');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('Cairo, Egypt');

  const filteredReviews = reviews.filter((r: any) => {
    const text = `${r.author || ''} ${r.title || ''} ${r.content || ''} ${r.product_tag || ''}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());
    const matchesRating = filterRating === 'all' || Number(r.rating) === filterRating;
    return matchesSearch && matchesRating;
  });

  const handleToggleStatus = async (id: string, currentFeatured: boolean) => {
    try {
      const next = !currentFeatured;
      await api.updateReviewStatus(id, next ? 'approved' : 'pending');
      setReviews(prev =>
        prev.map(r => (r.id === id ? { ...r, is_featured: next, status: next ? 'approved' : 'pending' } : r))
      );
      showToast(next ? 'Review approved & featured' : 'Review unfeatured');
    } catch {
      showToast('Error updating review');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this customer review from the database?')) return;
    try {
      await api.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      showToast('Review removed');
    } catch {
      setReviews(prev => prev.filter(r => r.id !== id));
      showToast('Review removed');
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    try {
      const created = await api.createReview({
        author: author.trim(),
        product_tag: productTag,
        rating: Number(rating),
        title: title.trim(),
        content: content.trim(),
        location: location.trim(),
        role: 'Verified Buyer'
      });

      if (created) {
        setReviews(prev => [created, ...prev]);
      } else {
        setReviews(prev => [
          {
            id: String(Date.now()),
            author,
            product_tag: productTag,
            rating: Number(rating),
            title,
            content,
            location,
            is_verified: true,
            is_featured: true,
            created_at: new Date().toISOString()
          },
          ...prev
        ]);
      }

      showToast('Review added to database!');
      setIsAddModalOpen(false);
      setAuthor('');
      setTitle('');
      setContent('');
    } catch {
      showToast('Failed to add review');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal tracking-tight">
            Customer Reviews & Ratings Moderation
          </h1>
          <p className="text-xs text-[#736B63] font-light mt-1">
            Real customer feedback stored in Supabase `toomakt_reviews`. Approved reviews appear on storefront.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer shadow-soft"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Official Review</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl border border-[#E8E2D7] p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#736B63]" />
          <input
            type="text"
            placeholder="Search reviewer, product, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl pl-8 pr-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>

        <div className="flex items-center gap-1 text-xs">
          <span className="text-[#736B63] mr-1">Rating:</span>
          {(['all', 5, 4, 3] as const).map(val => (
            <button
              key={val}
              onClick={() => setFilterRating(val)}
              className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer ${
                filterRating === val
                  ? 'bg-[#3C1322] text-[#FAF7F2] border-[#3C1322] font-bold'
                  : 'bg-[#FAF7F2] border-[#E8E2D7] text-[#736B63]'
              }`}
            >
              {val === 'all' ? 'All' : `${val} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* REVIEWS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((rev: any) => {
          const isFeatured = rev.is_featured !== false;
          return (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-[#E8E2D7] p-5 shadow-soft flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (rev.rating || 5)
                            ? 'text-[#FFD147] fill-[#FFD147]'
                            : 'text-[#E8E2D7]'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-bold ml-1 text-[#1A1A1A]">
                      {rev.rating}.0
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      isFeatured
                        ? 'bg-[#E8F5E9] text-[#2E7D32]'
                        : 'bg-[#FFF9E6] text-[#B7791F]'
                    }`}
                  >
                    {isFeatured ? 'Approved & Live' : 'Pending Moderation'}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-[#1A1A1A] mb-1">
                  {rev.title || 'Exceptional Confection'}
                </h4>
                <p className="text-xs text-[#736B63] leading-relaxed mb-3">
                  "{rev.content}"
                </p>

                <div className="flex items-center gap-2 text-[11px] text-[#736B63]">
                  <span className="font-bold text-[#1A1A1A]">{rev.author}</span>
                  <span>•</span>
                  <span>{rev.location || 'Cairo, Egypt'}</span>
                  <span>•</span>
                  <span className="bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8E2D7] text-[10px] font-mono text-[#3C1322]">
                    {rev.product_tag || 'Canister'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E2D7] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(rev.id, isFeatured)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors ${
                    isFeatured
                      ? 'border-[#E8E2D7] text-[#736B63] hover:text-[#C53030]'
                      : 'bg-[#3C1322] text-[#FAF7F2] border-[#3C1322]'
                  }`}
                >
                  {isFeatured ? 'Hide from Store' : 'Approve Review'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteReview(rev.id)}
                  className="p-1.5 text-[#736B63] hover:text-[#C53030] hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#E8E2D7] p-8 text-xs text-[#736B63]">
          No customer reviews found matching filter criteria.
        </div>
      )}

      {/* ADD REVIEW MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D7]">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Add Verified Customer Review
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#736B63] hover:text-[#1A1A1A] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farida Hassan"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zamalek, Cairo"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                    Product Tag
                  </label>
                  <input
                    type="text"
                    value={productTag}
                    onChange={(e) => setProductTag(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                    Rating (Stars)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1A1A1A]"
                  >
                    <option value="5">5 ★★★★★ (Exceptional)</option>
                    <option value="4">4 ★★★★☆ (Very Good)</option>
                    <option value="3">3 ★★★☆☆ (Average)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                  Headline / Review Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unbelievable texture and real fruit burst"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                  Review Content
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed customer experience..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="pt-3 border-t border-[#E8E2D7] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D7] rounded-full text-xs text-[#736B63] hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs px-5 py-2 cursor-pointer shadow-soft flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Publish Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
