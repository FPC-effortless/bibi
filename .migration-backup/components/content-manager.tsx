'use client';

import { useState, useEffect } from 'react';
import { useContentManager } from '@/hooks/use-content-manager';
import { ContentItem } from '@/lib/content-manager';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ContentManagerProps {
  locale?: string;
  onContentSelect?: (content: ContentItem) => void;
}

export function ContentManager({ locale = 'en', onContentSelect }: ContentManagerProps) {
  const {
    content,
    loading,
    error,
    fetchContent,
    publishContent,
    unpublishContent,
    deleteContent
  } = useContentManager();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchContent(locale);
  }, [locale, fetchContent]);

  const handleSearch = () => {
    const type = selectedType === 'all' ? undefined : selectedType;
    const query = searchQuery.trim() || undefined;
    fetchContent(locale, type, query);
  };

  const handlePublishToggle = async (item: ContentItem) => {
    if (item.metadata.status === 'published') {
      await unpublishContent(item.id, locale);
    } else {
      await publishContent(item.id, locale);
    }
  };

  const handleDelete = async (item: ContentItem) => {
    if (confirm(`Are you sure you want to archive "${item.title}"?`)) {
      await deleteContent(item.id, locale);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page': return 'bg-blue-100 text-blue-800';
      case 'product': return 'bg-purple-100 text-purple-800';
      case 'collection': return 'bg-indigo-100 text-indigo-800';
      case 'blog': return 'bg-green-100 text-green-800';
      case 'static': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && content.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="page">Pages</option>
          <option value="product">Products</option>
          <option value="collection">Collections</option>
          <option value="blog">Blog Posts</option>
          <option value="static">Static Content</option>
        </select>
        <Button onClick={handleSearch} disabled={loading}>
          Search
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Content List */}
      <div className="space-y-4">
        {content.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No content found. Try adjusting your search criteria.
          </div>
        ) : (
          content.map((item) => (
            <div
              key={`${item.id}-${item.metadata.locale}`}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <Badge className={getTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                    <Badge className={getStatusColor(item.metadata.status)}>
                      {item.metadata.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    Slug: /{item.slug}
                  </p>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Version: {item.metadata.version}</p>
                    <p>Updated: {new Date(item.metadata.updatedAt).toLocaleDateString()}</p>
                    <p>Author: {item.metadata.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {onContentSelect && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onContentSelect(item)}
                    >
                      Edit
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePublishToggle(item)}
                    disabled={loading}
                    className={
                      item.metadata.status === 'published'
                        ? 'text-orange-600 hover:text-orange-700'
                        : 'text-green-600 hover:text-green-700'
                    }
                  >
                    {item.metadata.status === 'published' ? 'Unpublish' : 'Publish'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700"
                  >
                    Archive
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {loading && content.length > 0 && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}
    </div>
  );
}