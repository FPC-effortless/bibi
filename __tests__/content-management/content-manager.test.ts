import { ContentManager, ContentItem } from '@/lib/content-manager';
import { promises as fs } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';

// Mock fs operations
jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  mkdir: jest.fn(),
  readdir: jest.fn(),
  stat: jest.fn(),
}));

const mockFs = fs as jest.Mocked<typeof fs>;
const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;

describe('ContentManager', () => {
  let contentManager: ContentManager;
  const testContentDir = 'test-content';

  beforeEach(() => {
    contentManager = new ContentManager(testContentDir);
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should create content directories if they do not exist', async () => {
      mockExistsSync.mockReturnValue(false);
      mockFs.mkdir.mockResolvedValue(undefined);

      await contentManager.initialize();

      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining(testContentDir),
        { recursive: true }
      );
      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('.versions'),
        { recursive: true }
      );
    });

    it('should not create directories if they already exist', async () => {
      mockExistsSync.mockReturnValue(true);

      await contentManager.initialize();

      expect(mockFs.mkdir).not.toHaveBeenCalled();
    });
  });

  describe('content creation', () => {
    const mockContent = {
      id: 'test-page',
      type: 'page' as const,
      title: 'Test Page',
      slug: 'test-page',
      content: { body: 'Test content' }
    };

    it('should create new content with proper metadata', async () => {
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.mkdir.mockResolvedValue(undefined);
      mockExistsSync.mockReturnValue(false);

      const result = await contentManager.createContent(mockContent);

      expect(result).toMatchObject({
        ...mockContent,
        metadata: expect.objectContaining({
          author: 'system',
          version: 1,
          status: 'draft',
          locale: 'en'
        })
      });

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('test-page.en.json'),
        expect.stringContaining('"version":1')
      );
    });

    it('should create version history for new content', async () => {
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.mkdir.mockResolvedValue(undefined);
      mockExistsSync.mockReturnValue(false);

      await contentManager.createContent(mockContent);

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('.versions/test-page.en.versions.json'),
        expect.any(String)
      );
    });
  });

  describe('content retrieval', () => {
    it('should return content when file exists', async () => {
      const mockContentData: ContentItem = {
        id: 'test-page',
        type: 'page',
        title: 'Test Page',
        slug: 'test-page',
        content: { body: 'Test content' },
        metadata: {
          author: 'system',
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          status: 'published',
          locale: 'en'
        }
      };

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockContentData));

      const result = await contentManager.getContent('test-page', 'en');

      expect(result).toEqual(mockContentData);
      expect(mockFs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('test-page.en.json'),
        'utf-8'
      );
    });

    it('should return null when content does not exist', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      const result = await contentManager.getContent('nonexistent', 'en');

      expect(result).toBeNull();
    });
  });

  describe('content updates', () => {
    const existingContent: ContentItem = {
      id: 'test-page',
      type: 'page',
      title: 'Test Page',
      slug: 'test-page',
      content: { body: 'Original content' },
      metadata: {
        author: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        status: 'draft',
        locale: 'en'
      }
    };

    it('should update content and increment version', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(existingContent));
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.mkdir.mockResolvedValue(undefined);
      mockExistsSync.mockReturnValue(false);

      const updates = {
        title: 'Updated Test Page',
        content: { body: 'Updated content' }
      };

      const result = await contentManager.updateContent(
        'test-page',
        updates,
        'test-author',
        'Updated title and content'
      );

      expect(result).toMatchObject({
        ...existingContent,
        ...updates,
        metadata: expect.objectContaining({
          version: 2,
          author: 'test-author'
        })
      });
    });

    it('should throw error when updating non-existent content', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(
        contentManager.updateContent('nonexistent', { title: 'New Title' })
      ).rejects.toThrow('Content with id nonexistent not found');
    });
  });

  describe('content search', () => {
    const mockContentList: ContentItem[] = [
      {
        id: 'page-1',
        type: 'page',
        title: 'About Us',
        slug: 'about-us',
        content: { body: 'Learn about our company' },
        metadata: {
          author: 'system',
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          status: 'published',
          locale: 'en'
        }
      },
      {
        id: 'page-2',
        type: 'product',
        title: 'Luxury Dress',
        slug: 'luxury-dress',
        content: { description: 'Beautiful evening dress' },
        metadata: {
          author: 'system',
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          status: 'published',
          locale: 'en'
        }
      }
    ];

    beforeEach(() => {
      mockFs.readdir.mockResolvedValue(['page-1.en.json', 'page-2.en.json'] as any);
      mockFs.readFile
        .mockResolvedValueOnce(JSON.stringify(mockContentList[0]))
        .mockResolvedValueOnce(JSON.stringify(mockContentList[1]));
    });

    it('should search content by title', async () => {
      const results = await contentManager.searchContent('about', 'en');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('About Us');
    });

    it('should search content by content body', async () => {
      const results = await contentManager.searchContent('evening', 'en');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Luxury Dress');
    });

    it('should return empty array when no matches found', async () => {
      const results = await contentManager.searchContent('nonexistent', 'en');

      expect(results).toHaveLength(0);
    });
  });

  describe('content versioning', () => {
    it('should retrieve content versions', async () => {
      const mockVersions = [
        {
          version: 2,
          content: {} as ContentItem,
          timestamp: new Date(),
          author: 'test-author',
          changeLog: 'Updated content'
        },
        {
          version: 1,
          content: {} as ContentItem,
          timestamp: new Date(),
          author: 'system',
          changeLog: 'Initial creation'
        }
      ];

      mockExistsSync.mockReturnValue(true);
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockVersions));

      const result = await contentManager.getContentVersions('test-page', 'en');

      expect(result).toHaveLength(2);
      expect(result[0].version).toBe(2); // Should be sorted by version desc
      expect(result[1].version).toBe(1);
    });

    it('should return empty array when no versions exist', async () => {
      mockExistsSync.mockReturnValue(false);

      const result = await contentManager.getContentVersions('test-page', 'en');

      expect(result).toHaveLength(0);
    });
  });

  describe('content publishing', () => {
    const draftContent: ContentItem = {
      id: 'test-page',
      type: 'page',
      title: 'Test Page',
      slug: 'test-page',
      content: { body: 'Test content' },
      metadata: {
        author: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        status: 'draft',
        locale: 'en'
      }
    };

    it('should publish draft content', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(draftContent));
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.mkdir.mockResolvedValue(undefined);
      mockExistsSync.mockReturnValue(false);

      const result = await contentManager.publishContent('test-page', 'en');

      expect(result?.metadata.status).toBe('published');
    });

    it('should unpublish published content', async () => {
      const publishedContent = {
        ...draftContent,
        metadata: { ...draftContent.metadata, status: 'published' as const }
      };

      mockFs.readFile.mockResolvedValue(JSON.stringify(publishedContent));
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.mkdir.mockResolvedValue(undefined);
      mockExistsSync.mockReturnValue(false);

      const result = await contentManager.unpublishContent('test-page', 'en');

      expect(result?.metadata.status).toBe('draft');
    });
  });
});