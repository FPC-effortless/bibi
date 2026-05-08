import { readFile, writeFile, mkdir, readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

export interface ContentItem {
  id: string;
  type: 'page' | 'product' | 'collection' | 'blog' | 'static';
  title: string;
  slug: string;
  content: Record<string, any>;
  metadata: {
    author: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
    status: 'draft' | 'published' | 'archived';
    locale: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

export interface ContentVersion {
  version: number;
  content: ContentItem;
  timestamp: Date;
  author: string;
  changeLog: string;
}

export class ContentManager {
  private contentDir: string;
  private versionsDir: string;

  constructor(baseDir: string = 'content') {
    this.contentDir = join(process.cwd(), baseDir);
    this.versionsDir = join(this.contentDir, '.versions');
  }

  async initialize(): Promise<void> {
    try {
      if (!existsSync(this.contentDir)) {
        await mkdir(this.contentDir, { recursive: true });
      }
      if (!existsSync(this.versionsDir)) {
        await mkdir(this.versionsDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to initialize content manager:', error);
      throw error;
    }
  }

  async createContent(content: Omit<ContentItem, 'metadata'>): Promise<ContentItem> {
    const contentItem: ContentItem = {
      ...content,
      metadata: {
        author: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        status: 'draft',
        locale: 'en'
      }
    };

    await this.saveContent(contentItem);
    await this.createVersion(contentItem, 'Initial creation');
    
    return contentItem;
  }

  async updateContent(
    id: string, 
    updates: Partial<ContentItem>, 
    author: string = 'system',
    changeLog: string = 'Content updated'
  ): Promise<ContentItem> {
    const existing = await this.getContent(id);
    if (!existing) {
      throw new Error(`Content with id ${id} not found`);
    }

    const updated: ContentItem = {
      ...existing,
      ...updates,
      metadata: {
        ...existing.metadata,
        ...updates.metadata,
        updatedAt: new Date(),
        version: existing.metadata.version + 1,
        author
      }
    };

    await this.saveContent(updated);
    await this.createVersion(updated, changeLog);
    
    return updated;
  }

  async getContent(id: string, locale: string = 'en'): Promise<ContentItem | null> {
    try {
      const filePath = join(this.contentDir, `${id}.${locale}.json`);
      const fileContent = await readFile(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      return null;
    }
  }

  async getAllContent(locale: string = 'en'): Promise<ContentItem[]> {
    try {
      const files = await readdir(this.contentDir);
      const contentFiles = files.filter(file => 
        file.endsWith(`.${locale}.json`) && !file.startsWith('.')
      );

      const content: ContentItem[] = [];
      for (const file of contentFiles) {
        try {
          const filePath = join(this.contentDir, file);
          const fileContent = await readFile(filePath, 'utf-8');
          content.push(JSON.parse(fileContent));
        } catch (error) {
          console.error(`Error reading content file ${file}:`, error);
        }
      }

      return content.sort((a, b) => 
        new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime()
      );
    } catch (error) {
      console.error('Error getting all content:', error);
      return [];
    }
  }

  async deleteContent(id: string, locale: string = 'en'): Promise<boolean> {
    try {
      const filePath = join(this.contentDir, `${id}.${locale}.json`);
      if (existsSync(filePath)) {
        // Archive instead of delete
        const content = await this.getContent(id, locale);
        if (content) {
          await this.updateContent(id, { 
            metadata: { ...content.metadata, status: 'archived' } 
          }, 'system', 'Content archived');
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting content:', error);
      return false;
    }
  }

  async getContentVersions(id: string, locale: string = 'en'): Promise<ContentVersion[]> {
    try {
      const versionFile = join(this.versionsDir, `${id}.${locale}.versions.json`);
      if (!existsSync(versionFile)) {
        return [];
      }

      const versionsContent = await readFile(versionFile, 'utf-8');
      const versions = JSON.parse(versionsContent);
      
      return versions.sort((a: ContentVersion, b: ContentVersion) => b.version - a.version);
    } catch (error) {
      console.error('Error getting content versions:', error);
      return [];
    }
  }

  async rollbackToVersion(id: string, version: number, locale: string = 'en'): Promise<ContentItem | null> {
    try {
      const versions = await this.getContentVersions(id, locale);
      const targetVersion = versions.find(v => v.version === version);
      
      if (!targetVersion) {
        throw new Error(`Version ${version} not found for content ${id}`);
      }

      const rolledBackContent = await this.updateContent(
        id,
        targetVersion.content,
        'system',
        `Rolled back to version ${version}`
      );

      return rolledBackContent;
    } catch (error) {
      console.error('Error rolling back content:', error);
      return null;
    }
  }

  private async saveContent(content: ContentItem): Promise<void> {
    const filePath = join(this.contentDir, `${content.id}.${content.metadata.locale}.json`);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(content, null, 2));
  }

  private async createVersion(content: ContentItem, changeLog: string): Promise<void> {
    const versionFile = join(this.versionsDir, `${content.id}.${content.metadata.locale}.versions.json`);
    
    let versions: ContentVersion[] = [];
    if (existsSync(versionFile)) {
      const versionsContent = await readFile(versionFile, 'utf-8');
      versions = JSON.parse(versionsContent);
    }

    const newVersion: ContentVersion = {
      version: content.metadata.version,
      content: { ...content },
      timestamp: new Date(),
      author: content.metadata.author,
      changeLog
    };

    versions.push(newVersion);
    
    // Keep only last 50 versions
    if (versions.length > 50) {
      versions = versions.slice(-50);
    }

    await writeFile(versionFile, JSON.stringify(versions, null, 2));
  }

  async searchContent(query: string, locale: string = 'en'): Promise<ContentItem[]> {
    const allContent = await this.getAllContent(locale);
    const searchTerm = query.toLowerCase();

    return allContent.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.slug.toLowerCase().includes(searchTerm) ||
      JSON.stringify(item.content).toLowerCase().includes(searchTerm) ||
      (item.seo?.description && item.seo.description.toLowerCase().includes(searchTerm))
    );
  }

  async getContentByType(type: ContentItem['type'], locale: string = 'en'): Promise<ContentItem[]> {
    const allContent = await this.getAllContent(locale);
    return allContent.filter(item => item.type === type);
  }

  async publishContent(id: string, locale: string = 'en'): Promise<ContentItem | null> {
    const existing = await this.getContent(id);
    if (!existing) return null;
    
    return this.updateContent(
      id,
      { 
        metadata: { 
          ...existing.metadata,
          status: 'published' 
        } 
      },
      'system',
      'Content published'
    );
  }

  async unpublishContent(id: string, locale: string = 'en'): Promise<ContentItem | null> {
    const existing = await this.getContent(id);
    if (!existing) return null;
    
    return this.updateContent(
      id,
      { 
        metadata: { 
          ...existing.metadata,
          status: 'draft' 
        } 
      },
      'system',
      'Content unpublished'
    );
  }
}

export const contentManager = new ContentManager();