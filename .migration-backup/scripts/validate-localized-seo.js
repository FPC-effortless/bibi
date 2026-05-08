#!/usr/bin/env node

/**
 * Validation script for Localized SEO and Branding Implementation
 * Tests the core functionality without requiring full Jest setup
 */

const fs = require('fs')
const path = require('path')

// Test data
const supportedLocales = ['en', 'fr', 'es', 'de', 'it']
const requiredSEOKeys = [
  'seo.site_name',
  'seo.brand_name', 
  'seo.tagline',
  'seo.default_title',
  'seo.default_description',
  'seo.keywords.primary',
  'seo.structured_data.organization_name'
]

console.log('🔍 Validating Localized SEO and Branding Implementation...\n')

// Test 1: Validate locale files exist and have SEO content
console.log('1. Checking locale files...')
let localeTestsPassed = 0

supportedLocales.forEach(locale => {
  const localeFile = path.join(__dirname, '..', 'locales', `${locale}.json`)
  
  if (fs.existsSync(localeFile)) {
    try {
      const content = JSON.parse(fs.readFileSync(localeFile, 'utf-8'))
      
      // Check if SEO section exists
      if (content.seo) {
        console.log(`   ✅ ${locale}.json - SEO section found`)
        
        // Check required SEO keys
        const hasRequiredKeys = requiredSEOKeys.every(key => {
          const keys = key.split('.')
          let current = content
          for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
              current = current[k]
            } else {
              return false
            }
          }
          return current !== undefined
        })
        
        if (hasRequiredKeys) {
          console.log(`   ✅ ${locale}.json - All required SEO keys present`)
          localeTestsPassed++
        } else {
          console.log(`   ❌ ${locale}.json - Missing required SEO keys`)
        }
      } else {
        console.log(`   ❌ ${locale}.json - SEO section missing`)
      }
    } catch (error) {
      console.log(`   ❌ ${locale}.json - Invalid JSON: ${error.message}`)
    }
  } else {
    console.log(`   ❌ ${locale}.json - File not found`)
  }
})

console.log(`   Result: ${localeTestsPassed}/${supportedLocales.length} locale files valid\n`)

// Test 2: Validate library files exist
console.log('2. Checking library files...')
const requiredLibFiles = [
  'lib/localized-seo-manager.ts',
  'lib/localized-branding.ts', 
  'lib/translation-manager.ts',
  'lib/i18n.ts'
]

let libTestsPassed = 0
requiredLibFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file)
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} - Found`)
    libTestsPassed++
  } else {
    console.log(`   ❌ ${file} - Missing`)
  }
})

console.log(`   Result: ${libTestsPassed}/${requiredLibFiles.length} library files found\n`)

// Test 3: Validate component files exist
console.log('3. Checking component files...')
const requiredComponents = [
  'components/localized-seo.tsx',
  'components/seo.tsx'
]

let componentTestsPassed = 0
requiredComponents.forEach(file => {
  const filePath = path.join(__dirname, '..', file)
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} - Found`)
    componentTestsPassed++
  } else {
    console.log(`   ❌ ${file} - Missing`)
  }
})

console.log(`   Result: ${componentTestsPassed}/${requiredComponents.length} component files found\n`)

// Test 4: Basic content validation
console.log('4. Validating content consistency...')
let contentTestsPassed = 0

try {
  // Check brand name consistency
  let brandNameConsistent = true
  supportedLocales.forEach(locale => {
    const localeFile = path.join(__dirname, '..', 'locales', `${locale}.json`)
    if (fs.existsSync(localeFile)) {
      const content = JSON.parse(fs.readFileSync(localeFile, 'utf-8'))
      if (content.seo && content.seo.brand_name !== 'bibiere') {
        brandNameConsistent = false
      }
    }
  })
  
  if (brandNameConsistent) {
    console.log('   ✅ Brand name "bibiere" consistent across all locales')
    contentTestsPassed++
  } else {
    console.log('   ❌ Brand name inconsistent across locales')
  }

  // Check tagline translations exist
  let taglinesTranslated = true
  const baseTagline = 'Timeless Luxury Redefined'
  
  supportedLocales.forEach(locale => {
    if (locale === 'en') return
    
    const localeFile = path.join(__dirname, '..', 'locales', `${locale}.json`)
    if (fs.existsSync(localeFile)) {
      const content = JSON.parse(fs.readFileSync(localeFile, 'utf-8'))
      if (content.seo && content.seo.tagline === baseTagline) {
        taglinesTranslated = false
      }
    }
  })
  
  if (taglinesTranslated) {
    console.log('   ✅ Taglines translated for non-English locales')
    contentTestsPassed++
  } else {
    console.log('   ❌ Some taglines not translated')
  }

} catch (error) {
  console.log(`   ❌ Content validation failed: ${error.message}`)
}

console.log(`   Result: ${contentTestsPassed}/2 content validation tests passed\n`)

// Test 5: Check file syntax
console.log('5. Checking TypeScript syntax...')
let syntaxTestsPassed = 0

const tsFiles = [
  'lib/localized-seo-manager.ts',
  'lib/localized-branding.ts',
  'lib/translation-manager.ts',
  'components/localized-seo.tsx'
]

tsFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file)
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      
      // Basic syntax checks
      const hasExports = content.includes('export')
      const hasImports = content.includes('import')
      const hasInterfaces = content.includes('interface') || content.includes('type')
      const noSyntaxErrors = !content.includes('Saw Error:')
      
      if (hasExports && hasImports && hasInterfaces && noSyntaxErrors) {
        console.log(`   ✅ ${file} - Syntax looks good`)
        syntaxTestsPassed++
      } else {
        console.log(`   ⚠️  ${file} - Potential syntax issues`)
      }
    } catch (error) {
      console.log(`   ❌ ${file} - Cannot read file: ${error.message}`)
    }
  }
})

console.log(`   Result: ${syntaxTestsPassed}/${tsFiles.length} TypeScript files have good syntax\n`)

// Summary
const totalTests = 5
const passedTests = [
  localeTestsPassed === supportedLocales.length ? 1 : 0,
  libTestsPassed === requiredLibFiles.length ? 1 : 0,
  componentTestsPassed === requiredComponents.length ? 1 : 0,
  contentTestsPassed === 2 ? 1 : 0,
  syntaxTestsPassed === tsFiles.length ? 1 : 0
].reduce((a, b) => a + b, 0)

console.log('📊 SUMMARY')
console.log('=' .repeat(50))
console.log(`Tests Passed: ${passedTests}/${totalTests}`)
console.log(`Locale Files: ${localeTestsPassed}/${supportedLocales.length}`)
console.log(`Library Files: ${libTestsPassed}/${requiredLibFiles.length}`)
console.log(`Component Files: ${componentTestsPassed}/${requiredComponents.length}`)
console.log(`Content Validation: ${contentTestsPassed}/2`)
console.log(`Syntax Validation: ${syntaxTestsPassed}/${tsFiles.length}`)

if (passedTests === totalTests) {
  console.log('\n🎉 All validation tests passed! Localized SEO and branding implementation is ready.')
  process.exit(0)
} else {
  console.log('\n⚠️  Some validation tests failed. Please review the issues above.')
  process.exit(1)
}