import { useState, useCallback } from 'react';
import { ContentItem, ContentVersion } from '@/lib/content-manager';

interface UseContentManagerReturn {
  content: ContentItem[];
  loading: boolean;
  error: string | null;
  fetchContent: (locale?: string, type?: string, query?: string) => Promise<void>;
  getContent: (id: string, locale?: string) => Promise<ContentItem | null>;
  createContent: (content: Omit<ContentItem, 'metadata'>) => Promise<ContentItem | null>;
  updateContent: (id: string, updates: Partial<ContentItem>, author?: string, changeLog?: string) => Promise<ContentItem | null>;
  deleteContent: (id: string, locale?: string) => Promise<boolean>;
  publishContent: (id: string, locale?: string) => Promise<ContentItem | null>;
  unpublishContent: (id: string, locale?: string) => Promise<ContentItem | null>;
  getVersions: (id: string, locale?: string) => Promise<ContentVersion[]>;
  rollbackToVersion: (id: string, version: number, locale?: string) => Promise<ContentItem | null>;
}

export function useContentManager(): UseContentManagerReturn {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: any, defaultMessage: string) => {
    console.error(error);
    setError(error.message || defaultMessage);
    setLoading(false);
  }, []);

  const fetchContent = useCallback(async (locale = 'en', type?: string, query?: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ locale });
      if (type) params.append('type', type);
      if (query) params.append('q', query);

      const response = await fetch(`/api/content?${params}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setContent(result.data);
    } catch (error) {
      handleError(error, 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getContent = useCallback(async (id: string, locale = 'en'): Promise<ContentItem | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${id}?locale=${locale}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    } catch (error) {
      handleError(error, 'Failed to get content');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const createContent = useCallback(async (contentData: Omit<ContentItem, 'metadata'>): Promise<ContentItem | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: contentData }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Refresh content list
      await fetchContent();

      return result.data;
    } catch (error) {
      handleError(error, 'Failed to create content');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError, fetchContent]);

  const updateContent = useCallback(async (
    id: string, 
    updates: Partial<ContentItem>, 
    author = 'system', 
    changeLog = 'Content updated'
  ): Promise<ContentItem | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates, author, changeLog }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update local content state
      setContent(prev => prev.map(item => 
        item.id === id ? result.data : item
      ));

      return result.data;
    } catch (error) {
      handleError(error, 'Failed to update content');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const deleteContent = useCallback(async (id: string, locale = 'en'): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${id}?locale=${locale}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Remove from local state
      setContent(prev => prev.filter(item => item.id !== id));

      return true;
    } catch (error) {
      handleError(error, 'Failed to delete content');
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const publishContent = useCallback(async (id: string, locale = 'en'): Promise<ContentItem | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${id}/publish?locale=${locale}`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update local content state
      setContent(prev => prev.map(item => 
        item.id === id ? result.data : item
      ));

      return result.data;
    } catch (error) {
      handleError(error, 'Failed to publish content');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const unpublishContent = useCallback(async (id: string, locale = 'en'): Promise<ContentItem | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${id}/publish?locale=${locale}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update local content state
      setContent(prev => prev.map(item => 
        item.id === id ? result.data : item
      ));

      return result.data;
    } catch (error) {
      handleError(error, 'Failed to unpublish content');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getVersions = useCallback(async (id: string, locale = 'en'): Promise<ContentVersion[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${id}/versions?locale=${locale}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    } catch (error) {
      handleError(error, 'Failed to get content versions');
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const rollbackToVersion = useCallback(async (
    id: string, 
    version: number, 
    locale = 'en'
  ): Promise<ContentItem | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/content/${id}/rollback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ version, locale }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update local content state
      setContent(prev => prev.map(item => 
        item.id === id ? result.data : item
      ));

      return result.data;
    } catch (error) {
      handleError(error, 'Failed to rollback content');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  return {
    content,
    loading,
    error,
    fetchContent,
    getContent,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    unpublishContent,
    getVersions,
    rollbackToVersion,
  };
}