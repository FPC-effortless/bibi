import { NextRequest } from 'next/server'
import crypto from 'crypto'

// PCI DSS compliance configuration
export interface PCIConfig {
  encryptionKey: string
  tokenizationEnabled: boolean
  auditLogging: boolean
  dataRetentionDays: number
  allowedCardTypes: string[]
  requireCVV: boolean
  require3DS: boolean
}

// Default PCI configuration
export const defaultPCIConfig: PCIConfig = {
  encryptionKey: process.env.PCI_ENCRYPTION_KEY || 'change-this-32-char-key-in-production',
  tokenizationEnabled: true,
  auditLogging: true,
  dataRetentionDays: 90, // Minimize data retention
  allowedCardTypes: ['visa', 'mastercard', 'amex', 'discover'],
  requireCVV: true,
  require3DS: process.env.NODE_ENV === 'production'
}

// Payment data interfaces
export interface PaymentData {
  amount: number
  currency: string
  orderId: string
  customerId?: string
  description?: string
  metadata?: Record<string, any>
}

export interface CardData {
  number: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  holderName: string
}

export interface TokenizedCard {
  token: string
  lastFour: string
  brand: string
  expiryMonth: string
  expiryYear: string
}

// PCI DSS compliant payment processor
export class PaymentSecurityManager {
  private config: PCIConfig

  constructor(config: PCIConfig = defaultPCIConfig) {
    this.config = config
    
    // Validate encryption key
    if (!config.encryptionKey || config.encryptionKey.length < 32) {
      throw new Error('PCI encryption key must be at least 32 characters long')
    }
  }

  // Validate card number using Luhn algorithm
  validateCardNumber(cardNumber: string): boolean {
    // Remove spaces and non-digits
    const cleaned = cardNumber.replace(/\D/g, '')
    
    // Check length
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false
    }
    
    // Luhn algorithm
    let sum = 0
    let isEven = false
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i])
      
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  }

  // Detect card brand
  detectCardBrand(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\D/g, '')
    
    // Visa
    if (/^4/.test(cleaned)) {
      return 'visa'
    }
    
    // Mastercard
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) {
      return 'mastercard'
    }
    
    // American Express
    if (/^3[47]/.test(cleaned)) {
      return 'amex'
    }
    
    // Discover
    if (/^6(?:011|5)/.test(cleaned)) {
      return 'discover'
    }
    
    return 'unknown'
  }

  // Validate CVV
  validateCVV(cvv: string, cardBrand: string): boolean {
    const cleaned = cvv.replace(/\D/g, '')
    
    // American Express uses 4-digit CVV
    if (cardBrand === 'amex') {
      return cleaned.length === 4
    }
    
    // Other cards use 3-digit CVV
    return cleaned.length === 3
  }

  // Validate expiry date
  validateExpiryDate(month: string, year: string): boolean {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    
    const expiryMonth = parseInt(month)
    const expiryYear = parseInt(year)
    
    // Validate month
    if (expiryMonth < 1 || expiryMonth > 12) {
      return false
    }
    
    // Validate year (support both 2-digit and 4-digit years)
    let fullYear = expiryYear
    if (expiryYear < 100) {
      fullYear = 2000 + expiryYear
    }
    
    // Check if card is expired
    if (fullYear < currentYear) {
      return false
    }
    
    if (fullYear === currentYear && expiryMonth < currentMonth) {
      return false
    }
    
    // Check if expiry is too far in the future (more than 20 years)
    if (fullYear > currentYear + 20) {
      return false
    }
    
    return true
  }

  // Encrypt sensitive data
  encryptData(data: string): string {
    const algorithm = 'aes-256-gcm'
    const key = crypto.scryptSync(this.config.encryptionKey, 'salt', 32)
    const iv = crypto.randomBytes(16)
    
    const cipher = crypto.createCipher(algorithm, key)
    cipher.setAAD(Buffer.from('payment-data'))
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  }

  // Decrypt sensitive data
  decryptData(encryptedData: string): string {
    try {
      const [ivHex, authTagHex, encrypted] = encryptedData.split(':')
      const algorithm = 'aes-256-gcm'
      const key = crypto.scryptSync(this.config.encryptionKey, 'salt', 32)
      const iv = Buffer.from(ivHex, 'hex')
      const authTag = Buffer.from(authTagHex, 'hex')
      
      const decipher = crypto.createDecipher(algorithm, key)
      decipher.setAAD(Buffer.from('payment-data'))
      decipher.setAuthTag(authTag)
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      throw new Error('Failed to decrypt payment data')
    }
  }

  // Tokenize card data (PCI DSS requirement)
  tokenizeCard(cardData: CardData): TokenizedCard {
    if (!this.config.tokenizationEnabled) {
      throw new Error('Card tokenization is disabled')
    }
    
    // Validate card data
    if (!this.validateCardNumber(cardData.number)) {
      throw new Error('Invalid card number')
    }
    
    const cardBrand = this.detectCardBrand(cardData.number)
    if (!this.config.allowedCardTypes.includes(cardBrand)) {
      throw new Error(`Card type ${cardBrand} is not accepted`)
    }
    
    if (!this.validateExpiryDate(cardData.expiryMonth, cardData.expiryYear)) {
      throw new Error('Invalid or expired card')
    }
    
    if (this.config.requireCVV && !this.validateCVV(cardData.cvv, cardBrand)) {
      throw new Error('Invalid CVV')
    }
    
    // Generate secure token
    const tokenData = {
      cardNumber: cardData.number,
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      holderName: cardData.holderName,
      timestamp: Date.now()
    }
    
    const token = crypto.randomBytes(32).toString('hex')
    const encryptedData = this.encryptData(JSON.stringify(tokenData))
    
    // In production, store the encrypted data in a secure database
    // For this example, we'll simulate token storage
    this.storeTokenData(token, encryptedData)
    
    return {
      token,
      lastFour: cardData.number.slice(-4),
      brand: cardBrand,
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear
    }
  }

  // Simulate secure token storage (in production, use encrypted database)
  private tokenStorage = new Map<string, string>()
  
  private storeTokenData(token: string, encryptedData: string): void {
    this.tokenStorage.set(token, encryptedData)
    
    // Set expiration for token (PCI DSS requirement)
    setTimeout(() => {
      this.tokenStorage.delete(token)
    }, this.config.dataRetentionDays * 24 * 60 * 60 * 1000)
  }

  // Retrieve card data from token
  getCardFromToken(token: string): CardData | null {
    const encryptedData = this.tokenStorage.get(token)
    if (!encryptedData) {
      return null
    }
    
    try {
      const decryptedData = this.decryptData(encryptedData)
      const tokenData = JSON.parse(decryptedData)
      
      return {
        number: tokenData.cardNumber,
        expiryMonth: tokenData.expiryMonth,
        expiryYear: tokenData.expiryYear,
        cvv: '', // Never store CVV
        holderName: tokenData.holderName
      }
    } catch (error) {
      return null
    }
  }

  // Validate payment amount
  validatePaymentAmount(amount: number, currency: string): boolean {
    // Check for positive amount
    if (amount <= 0) {
      return false
    }
    
    // Check for reasonable maximum (prevent overflow attacks)
    if (amount > 1000000) { // $1M limit
      return false
    }
    
    // Validate currency format
    const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY']
    if (!validCurrencies.includes(currency.toUpperCase())) {
      return false
    }
    
    // Check decimal places based on currency
    const decimalPlaces = currency.toUpperCase() === 'JPY' ? 0 : 2
    const multiplier = Math.pow(10, decimalPlaces)
    
    return Math.round(amount * multiplier) === amount * multiplier
  }

  // Generate secure payment reference
  generatePaymentReference(orderId: string): string {
    const timestamp = Date.now().toString()
    const random = crypto.randomBytes(8).toString('hex')
    const hash = crypto.createHash('sha256')
      .update(`${orderId}:${timestamp}:${random}`)
      .digest('hex')
      .substring(0, 16)
    
    return `PAY_${hash.toUpperCase()}`
  }

  // Log payment audit event (PCI DSS requirement)
  logAuditEvent(event: string, data: any, request?: NextRequest): void {
    if (!this.config.auditLogging) {
      return
    }
    
    const auditLog = {
      timestamp: new Date().toISOString(),
      event,
      data: this.sanitizeAuditData(data),
      ip: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown',
      userAgent: request?.headers.get('user-agent') || 'unknown',
      sessionId: this.extractSessionId(request)
    }
    
    // In production, send to secure audit logging system
    console.log('[PAYMENT AUDIT]', JSON.stringify(auditLog))
  }

  // Sanitize audit data (remove sensitive information)
  private sanitizeAuditData(data: any): any {
    const sanitized = { ...data }
    
    // Remove or mask sensitive fields
    const sensitiveFields = ['cardNumber', 'cvv', 'password', 'token']
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        if (field === 'cardNumber') {
          sanitized[field] = `****-****-****-${sanitized[field].slice(-4)}`
        } else {
          sanitized[field] = '[REDACTED]'
        }
      }
    }
    
    return sanitized
  }

  // Extract session ID from request
  private extractSessionId(request?: NextRequest): string {
    if (!request) return 'unknown'
    
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) return 'unknown'
    
    const sessionMatch = cookieHeader.match(/session=([^;]+)/)
    return sessionMatch ? sessionMatch[1].substring(0, 16) + '...' : 'unknown'
  }

  // Validate 3D Secure authentication
  validate3DS(threeDSData: any): boolean {
    if (!this.config.require3DS) {
      return true
    }
    
    // In production, validate with 3DS provider
    // This is a simplified validation
    return threeDSData && 
           threeDSData.authenticated === true && 
           threeDSData.transactionId && 
           threeDSData.cavv
  }
}

// Payment processing with security
export async function processSecurePayment(
  paymentData: PaymentData,
  cardToken: string,
  threeDSData?: any
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  const paymentManager = new PaymentSecurityManager()
  
  try {
    // Validate payment amount
    if (!paymentManager.validatePaymentAmount(paymentData.amount, paymentData.currency)) {
      throw new Error('Invalid payment amount or currency')
    }
    
    // Validate 3D Secure if required
    if (!paymentManager.validate3DS(threeDSData)) {
      throw new Error('3D Secure authentication required')
    }
    
    // Get card data from token
    const cardData = paymentManager.getCardFromToken(cardToken)
    if (!cardData) {
      throw new Error('Invalid or expired payment token')
    }
    
    // Generate payment reference
    const paymentReference = paymentManager.generatePaymentReference(paymentData.orderId)
    
    // Log audit event
    paymentManager.logAuditEvent('payment_initiated', {
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentReference
    })
    
    // Simulate payment processing (in production, integrate with payment gateway)
    const transactionId = `txn_${crypto.randomBytes(16).toString('hex')}`
    
    // Log successful payment
    paymentManager.logAuditEvent('payment_completed', {
      orderId: paymentData.orderId,
      transactionId,
      paymentReference,
      status: 'success'
    })
    
    return {
      success: true,
      transactionId
    }
    
  } catch (error) {
    // Log failed payment
    paymentManager.logAuditEvent('payment_failed', {
      orderId: paymentData.orderId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment processing failed'
    }
  }
}

// Default payment security manager instance
export const paymentSecurityManager = new PaymentSecurityManager()