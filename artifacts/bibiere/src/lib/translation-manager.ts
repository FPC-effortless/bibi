/**
 * Translation Management and Quality Assurance System for Bibiere
 * Handles translation validation, consistency checks, and quality metrics
 */

import { Locale, SUPPORTED_LOCALES } from './i18n'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface TranslationKey {
  key: string
  value: string
  context?: string
  maxLength?: number
  pluralizable?: boolean
  interpolations?: string[]
}

export interface TranslationFile {
  locale: Locale
  keys: Record<string, any>
  metadata: {
    version: string
    lastUpdated: Date
    translator?: string
    reviewer?: string
    status: 'draft' | 'review' | 'approved' | 'published'
  }
}

export interface TranslationQualityMetrics {
  locale: Locale
  completeness: number // 0-100%
  consistency: number // 0-100%
  accuracy: number // 0-100%
  culturalAdaptation: number // 0-100%
  lastUpdated: Date
  issues: TranslationIssue[]
}

export interface TranslationIssue {
  type: 'missing' | 'inconsistent' | 'too_long' | 'cultural' | 'interpolation' | 'plural'
  severity: 'low' | 'medium' | 'high' | 'critical'
  key: string
  description: string
  suggestion?: string
  context?: string
}

export interface TranslationWorkflow {
  locale: Locale
  status: 'not_started' | 'in_progress' | 'review' | 'approved' | 'published'
  assignedTranslator?: string
  assignedReviewer?: string
  dueDate?: Date
  progress: number // 0-100%
  lastActivity: Date
}

export interface TranslationMemory {
  sourceText: string
  targetText: string
  locale: Locale
  context?: string
  domain?: string
  quality: number // 0-100%
  lastUsed: Date
  frequency: number
}

export class TranslationManager {
  private translationFiles: Map<Locale, TranslationFile> = new Map()
  private qualityMetrics: Map<Locale, TranslationQualityMetrics> = new Map()
  private workflows: Map<Locale, TranslationWorkflow> = new Map()
  private translationMemory: TranslationMemory[] = []
  private baseLocale: Locale = 'en'
  private localesPath: string

  constructor(localesPath: string = './locales') {
    this.localesPath = localesPath
    this.loadAllTranslations()
    this.initializeWorkflows()
  }

  // Translation file management
  private loadAllTranslations(): void {
    for (const locale of Object.keys(SUPPORTED_LOCALES) as Locale[]) {
      this.loadTranslationFile(locale)
    }
  }

  private loadTranslationFile(locale: Locale): void {
    const filePath = join(this.localesPath, `${locale}.json`)
    
    if (!existsSync(filePath)) {
      console.warn(`Translation file not found for locale: ${locale}`)
      return
    }

    try {
      const content = readFileSync(filePath, 'utf-8')
      const keys = JSON.parse(content)
      
      const translationFile: TranslationFile = {
        locale,
        keys,
        metadata: {
          version: '1.0.0',
          lastUpdated: new Date(),
          status: 'published'
        }
      }

      this.translationFiles.set(locale, translationFile)
    } catch (error) {
      console.error(`Failed to load translation file for ${locale}:`, error)
    }
  }

  private saveTranslationFile(locale: Locale): void {
    const translationFile = this.translationFiles.get(locale)
    if (!translationFile) {
      throw new Error(`No translation file found for locale: ${locale}`)
    }

    const filePath = join(this.localesPath, `${locale}.json`)
    
    try {
      const content = JSON.stringify(translationFile.keys, null, 2)
      writeFileSync(filePath, content, 'utf-8')
      
      // Update metadata
      translationFile.metadata.lastUpdated = new Date()
      translationFile.metadata.version = this.incrementVersion(translationFile.metadata.version)
    } catch (error) {
      console.error(`Failed to save translation file for ${locale}:`, error)
      throw error
    }
  }

  private incrementVersion(version: string): string {
    const parts = version.split('.').map(Number)
    parts[2]++ // Increment patch version
    return parts.join('.')
  }

  // Translation validation and quality assurance
  validateTranslations(locale: Locale): TranslationQualityMetrics {
    const baseFile = this.translationFiles.get(this.baseLocale)
    const targetFile = this.translationFiles.get(locale)

    if (!baseFile || !targetFile) {
      throw new Error(`Translation files not found for validation`)
    }

    const issues: TranslationIssue[] = []
    const baseKeys = this.flattenKeys(baseFile.keys)
    const targetKeys = this.flattenKeys(targetFile.keys)

    // Check completeness
    const missingKeys = this.findMissingKeys(baseKeys, targetKeys)
    missingKeys.forEach(key => {
      issues.push({
        type: 'missing',
        severity: this.getKeySeverity(key),
        key,
        description: `Missing translation for key: ${key}`,
        suggestion: `Add translation for: ${baseKeys[key]}`
      })
    })

    // Check consistency
    const inconsistentKeys = this.findInconsistentKeys(baseKeys, targetKeys)
    inconsistentKeys.forEach(({ key, issue }) => {
      issues.push({
        type: 'inconsistent',
        severity: 'medium',
        key,
        description: issue,
        suggestion: 'Review translation for consistency'
      })
    })

    // Check length constraints
    const lengthIssues = this.checkLengthConstraints(targetKeys)
    issues.push(...lengthIssues)

    // Check interpolations
    const interpolationIssues = this.checkInterpolations(baseKeys, targetKeys)
    issues.push(...interpolationIssues)

    // Check cultural adaptation
    const culturalIssues = this.checkCulturalAdaptation(locale, targetKeys)
    issues.push(...culturalIssues)

    // Calculate metrics
    const totalKeys = Object.keys(baseKeys).length
    const translatedKeys = totalKeys - missingKeys.length
    const completeness = (translatedKeys / totalKeys) * 100

    const criticalIssues = issues.filter(i => i.severity === 'critical').length
    const highIssues = issues.filter(i => i.severity === 'high').length
    const consistency = Math.max(0, 100 - (criticalIssues * 25 + highIssues * 10))

    const accuracy = this.calculateAccuracy(locale, issues)
    const culturalAdaptation = this.calculateCulturalAdaptation(locale, issues)

    const metrics: TranslationQualityMetrics = {
      locale,
      completeness,
      consistency,
      accuracy,
      culturalAdaptation,
      lastUpdated: new Date(),
      issues
    }

    this.qualityMetrics.set(locale, metrics)
    return metrics
  }

  private flattenKeys(obj: any, prefix = ''): Record<string, string> {
    const flattened: Record<string, string> = {}

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(flattened, this.flattenKeys(value, fullKey))
      } else if (typeof value === 'string') {
        flattened[fullKey] = value
      }
    }

    return flattened
  }

  private findMissingKeys(baseKeys: Record<string, string>, targetKeys: Record<string, string>): string[] {
    return Object.keys(baseKeys).filter(key => !(key in targetKeys))
  }

  private findInconsistentKeys(
    baseKeys: Record<string, string>, 
    targetKeys: Record<string, string>
  ): Array<{ key: string; issue: string }> {
    const inconsistent: Array<{ key: string; issue: string }> = []

    for (const [key, baseValue] of Object.entries(baseKeys)) {
      const targetValue = targetKeys[key]
      if (!targetValue) continue

      // Check for brand name consistency
      if (baseValue.includes('bibiere') && !targetValue.includes('bibiere')) {
        inconsistent.push({
          key,
          issue: 'Brand name "bibiere" should remain consistent across translations'
        })
      }

      // Check for placeholder consistency
      const basePlaceholders = this.extractPlaceholders(baseValue)
      const targetPlaceholders = this.extractPlaceholders(targetValue)
      
      if (basePlaceholders.length !== targetPlaceholders.length) {
        inconsistent.push({
          key,
          issue: 'Placeholder count mismatch between source and target'
        })
      }

      // Check for HTML tag consistency
      const baseHtmlTags = this.extractHtmlTags(baseValue)
      const targetHtmlTags = this.extractHtmlTags(targetValue)
      
      if (baseHtmlTags.length !== targetHtmlTags.length) {
        inconsistent.push({
          key,
          issue: 'HTML tag count mismatch between source and target'
        })
      }
    }

    return inconsistent
  }

  private checkLengthConstraints(targetKeys: Record<string, string>): TranslationIssue[] {
    const issues: TranslationIssue[] = []
    
    // Define length constraints for different key types
    const lengthConstraints: Record<string, number> = {
      'navigation.': 20,
      'header.': 30,
      'products.add_to_cart': 15,
      'products.add_to_wishlist': 20,
      'common.': 15,
      'seo.tagline': 60,
      'seo.default_title': 60,
      'seo.default_description': 160
    }

    for (const [key, value] of Object.entries(targetKeys)) {
      for (const [pattern, maxLength] of Object.entries(lengthConstraints)) {
        if (key.startsWith(pattern) && value.length > maxLength) {
          issues.push({
            type: 'too_long',
            severity: 'medium',
            key,
            description: `Translation exceeds maximum length of ${maxLength} characters (current: ${value.length})`,
            suggestion: `Shorten translation to fit within ${maxLength} characters`
          })
          break
        }
      }
    }

    return issues
  }

  private checkInterpolations(
    baseKeys: Record<string, string>, 
    targetKeys: Record<string, string>
  ): TranslationIssue[] {
    const issues: TranslationIssue[] = []

    for (const [key, baseValue] of Object.entries(baseKeys)) {
      const targetValue = targetKeys[key]
      if (!targetValue) continue

      const basePlaceholders = this.extractPlaceholders(baseValue)
      const targetPlaceholders = this.extractPlaceholders(targetValue)

      // Check for missing placeholders
      const missingPlaceholders = basePlaceholders.filter(p => !targetPlaceholders.includes(p))
      if (missingPlaceholders.length > 0) {
        issues.push({
          type: 'interpolation',
          severity: 'high',
          key,
          description: `Missing placeholders: ${missingPlaceholders.join(', ')}`,
          suggestion: `Include all placeholders: ${basePlaceholders.join(', ')}`
        })
      }

      // Check for extra placeholders
      const extraPlaceholders = targetPlaceholders.filter(p => !basePlaceholders.includes(p))
      if (extraPlaceholders.length > 0) {
        issues.push({
          type: 'interpolation',
          severity: 'medium',
          key,
          description: `Extra placeholders: ${extraPlaceholders.join(', ')}`,
          suggestion: `Remove extra placeholders or verify they are intentional`
        })
      }
    }

    return issues
  }

  private checkCulturalAdaptation(locale: Locale, targetKeys: Record<string, string>): TranslationIssue[] {
    const issues: TranslationIssue[] = []
    const localeConfig = SUPPORTED_LOCALES[locale]

    // Check currency formatting
    for (const [key, value] of Object.entries(targetKeys)) {
      if (key.includes('price') || key.includes('currency')) {
        if (value.includes('$') && localeConfig.currency !== 'USD') {
          issues.push({
            type: 'cultural',
            severity: 'medium',
            key,
            description: 'Currency symbol may not be appropriate for this locale',
            suggestion: `Consider using ${localeConfig.currency} currency format`
          })
        }
      }

      // Check date format references
      if (key.includes('date') && value.includes('MM/DD/YYYY') && locale !== 'en') {
        issues.push({
          type: 'cultural',
          severity: 'low',
          key,
          description: 'Date format may not match local conventions',
          suggestion: `Consider using ${localeConfig.dateFormat} format`
        })
      }
    }

    // RTL-specific checks for Arabic
    if (locale === 'ar') {
      for (const [key, value] of Object.entries(targetKeys)) {
        if (value.includes('→') || value.includes('←')) {
          issues.push({
            type: 'cultural',
            severity: 'medium',
            key,
            description: 'Directional arrows may need adjustment for RTL layout',
            suggestion: 'Review arrow directions for RTL compatibility'
          })
        }
      }
    }

    return issues
  }

  private extractPlaceholders(text: string): string[] {
    const matches = text.match(/\{\{(\w+)\}\}/g)
    return matches ? matches.map(match => match.slice(2, -2)) : []
  }

  private extractHtmlTags(text: string): string[] {
    const matches = text.match(/<[^>]+>/g)
    return matches || []
  }

  private getKeySeverity(key: string): TranslationIssue['severity'] {
    if (key.startsWith('seo.') || key.startsWith('navigation.') || key.startsWith('header.')) {
      return 'high'
    }
    if (key.startsWith('products.') || key.startsWith('cart.') || key.startsWith('checkout.')) {
      return 'medium'
    }
    return 'low'
  }

  private calculateAccuracy(locale: Locale, issues: TranslationIssue[]): number {
    const criticalIssues = issues.filter(i => i.severity === 'critical').length
    const highIssues = issues.filter(i => i.severity === 'high').length
    const mediumIssues = issues.filter(i => i.severity === 'medium').length
    
    return Math.max(0, 100 - (criticalIssues * 30 + highIssues * 15 + mediumIssues * 5))
  }

  private calculateCulturalAdaptation(locale: Locale, issues: TranslationIssue[]): number {
    const culturalIssues = issues.filter(i => i.type === 'cultural')
    const criticalCultural = culturalIssues.filter(i => i.severity === 'critical').length
    const highCultural = culturalIssues.filter(i => i.severity === 'high').length
    
    return Math.max(0, 100 - (criticalCultural * 40 + highCultural * 20))
  }

  // Workflow management
  private initializeWorkflows(): void {
    for (const locale of Object.keys(SUPPORTED_LOCALES) as Locale[]) {
      if (locale === this.baseLocale) continue

      const workflow: TranslationWorkflow = {
        locale,
        status: 'published', // Assume existing translations are published
        progress: 100,
        lastActivity: new Date()
      }

      this.workflows.set(locale, workflow)
    }
  }

  updateWorkflowStatus(locale: Locale, status: TranslationWorkflow['status']): void {
    const workflow = this.workflows.get(locale)
    if (workflow) {
      workflow.status = status
      workflow.lastActivity = new Date()
      this.workflows.set(locale, workflow)
    }
  }

  assignTranslator(locale: Locale, translator: string): void {
    const workflow = this.workflows.get(locale)
    if (workflow) {
      workflow.assignedTranslator = translator
      workflow.lastActivity = new Date()
      this.workflows.set(locale, workflow)
    }
  }

  // Translation memory management
  addToTranslationMemory(
    sourceText: string, 
    targetText: string, 
    locale: Locale, 
    context?: string
  ): void {
    const existing = this.translationMemory.find(
      tm => tm.sourceText === sourceText && tm.locale === locale
    )

    if (existing) {
      existing.targetText = targetText
      existing.lastUsed = new Date()
      existing.frequency++
    } else {
      this.translationMemory.push({
        sourceText,
        targetText,
        locale,
        context,
        quality: 100, // Default quality
        lastUsed: new Date(),
        frequency: 1
      })
    }
  }

  searchTranslationMemory(sourceText: string, locale: Locale): TranslationMemory[] {
    return this.translationMemory
      .filter(tm => tm.locale === locale && tm.sourceText.includes(sourceText))
      .sort((a, b) => b.quality - a.quality)
  }

  // Reporting and analytics
  generateTranslationReport(): {
    overallProgress: number
    localeProgress: Record<Locale, number>
    qualityScores: Record<Locale, number>
    criticalIssues: number
    pendingReviews: number
    lastUpdated: Date
  } {
    const localeProgress: Record<string, number> = {}
    const qualityScores: Record<string, number> = {}
    let totalProgress = 0
    let totalQuality = 0
    let criticalIssues = 0
    let pendingReviews = 0

    for (const [locale, workflow] of Array.from(this.workflows.entries())) {
      localeProgress[locale] = workflow.progress
      totalProgress += workflow.progress

      if (workflow.status === 'review') {
        pendingReviews++
      }

      const metrics = this.qualityMetrics.get(locale)
      if (metrics) {
        const avgQuality = (metrics.completeness + metrics.consistency + metrics.accuracy + metrics.culturalAdaptation) / 4
        qualityScores[locale] = avgQuality
        totalQuality += avgQuality
        criticalIssues += metrics.issues.filter(i => i.severity === 'critical').length
      }
    }

    const localeCount = this.workflows.size
    const overallProgress = localeCount > 0 ? totalProgress / localeCount : 0

    return {
      overallProgress,
      localeProgress: localeProgress as Record<Locale, number>,
      qualityScores: qualityScores as Record<Locale, number>,
      criticalIssues,
      pendingReviews,
      lastUpdated: new Date()
    }
  }

  // Export/Import functionality
  exportTranslations(locale: Locale, format: 'json' | 'csv' | 'xlsx' = 'json'): string {
    const translationFile = this.translationFiles.get(locale)
    if (!translationFile) {
      throw new Error(`No translation file found for locale: ${locale}`)
    }

    switch (format) {
      case 'json':
        return JSON.stringify(translationFile.keys, null, 2)
      case 'csv':
        return this.convertToCSV(translationFile.keys)
      case 'xlsx':
        throw new Error('XLSX export not implemented yet')
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }

  private convertToCSV(keys: Record<string, any>): string {
    const flattened = this.flattenKeys(keys)
    const rows = [['Key', 'Value']]
    
    for (const [key, value] of Object.entries(flattened)) {
      rows.push([key, value])
    }

    return rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
  }

  // Public API methods
  getQualityMetrics(locale: Locale): TranslationQualityMetrics | undefined {
    return this.qualityMetrics.get(locale)
  }

  getAllQualityMetrics(): Map<Locale, TranslationQualityMetrics> {
    return new Map(this.qualityMetrics)
  }

  getWorkflow(locale: Locale): TranslationWorkflow | undefined {
    return this.workflows.get(locale)
  }

  getAllWorkflows(): Map<Locale, TranslationWorkflow> {
    return new Map(this.workflows)
  }

  validateAllTranslations(): Map<Locale, TranslationQualityMetrics> {
    const results = new Map<Locale, TranslationQualityMetrics>()
    
    for (const locale of Object.keys(SUPPORTED_LOCALES) as Locale[]) {
      if (locale === this.baseLocale) continue
      
      try {
        const metrics = this.validateTranslations(locale)
        results.set(locale, metrics)
      } catch (error) {
        console.error(`Failed to validate translations for ${locale}:`, error)
      }
    }

    return results
  }
}

// Export singleton instance
export const translationManager = new TranslationManager()

// Utility functions for easy integration
export function validateLocaleTranslations(locale: Locale): TranslationQualityMetrics {
  return translationManager.validateTranslations(locale)
}

export function getTranslationQuality(locale: Locale): TranslationQualityMetrics | undefined {
  return translationManager.getQualityMetrics(locale)
}

export function generateTranslationReport() {
  return translationManager.generateTranslationReport()
}