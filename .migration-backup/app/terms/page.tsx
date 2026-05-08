import { Metadata } from 'next';
import { Shield, FileText, Users, CreditCard, Truck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Bibiere - Luxury Fashion',
  description: 'Terms of Service and User Agreement for Bibiere luxury fashion e-commerce platform. Learn about our policies, user rights, and legal obligations.',
  keywords: ['terms of service', 'user agreement', 'legal', 'policies', 'bibiere', 'luxury fashion'],
  openGraph: {
    title: 'Terms of Service | Bibiere',
    description: 'Terms of Service and User Agreement for Bibiere luxury fashion platform.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: <FileText className="w-6 h-6" />,
    content: `By accessing and using the Bibiere website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
  },
  {
    id: 'definitions',
    title: 'Definitions',
    icon: <Shield className="w-6 h-6" />,
    content: `"Service" refers to the Bibiere e-commerce platform, website, and related services. "User" refers to any individual who accesses or uses our Service. "Products" refers to luxury fashion items available for purchase through our platform.`,
  },
  {
    id: 'user-accounts',
    title: 'User Accounts',
    icon: <Users className="w-6 h-6" />,
    content: `You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.`,
  },
  {
    id: 'purchases',
    title: 'Purchases and Payments',
    icon: <CreditCard className="w-6 h-6" />,
    content: `All purchases are subject to product availability. We reserve the right to refuse or cancel orders at our discretion. Payment must be received before products are shipped. All prices are subject to change without notice.`,
  },
  {
    id: 'shipping',
    title: 'Shipping and Returns',
    icon: <Truck className="w-6 h-6" />,
    content: `Shipping times and costs vary by location and shipping method selected. Returns are accepted within 30 days of delivery in original condition. Return shipping costs may apply unless the item was defective or incorrectly shipped.`,
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    icon: <AlertTriangle className="w-6 h-6" />,
    content: `Bibiere shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service. Our total liability shall not exceed the amount paid by you for the specific product or service.`,
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our services. 
              These terms govern your use of the Bibiere platform.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>Version: 1.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
          <nav className="space-y-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center space-x-3 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <div className="text-blue-500">
                  {section.icon}
                </div>
                <span>{section.title}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {section.icon}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {index + 1}. {section.title}
                  </h2>
                </div>
              </div>
              
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </div>

              {/* Additional detailed content for specific sections */}
              {section.id === 'user-accounts' && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Account Requirements</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>You must be at least 18 years old to create an account</li>
                    <li>You must provide accurate and complete information</li>
                    <li>You are responsible for keeping your account information updated</li>
                    <li>One account per person is permitted</li>
                  </ul>
                </div>
              )}

              {section.id === 'purchases' && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Terms</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>We accept major credit cards and PayPal</li>
                    <li>All transactions are processed securely</li>
                    <li>Prices include applicable taxes where required</li>
                    <li>Currency conversion rates may apply for international orders</li>
                  </ul>
                </div>
              )}

              {section.id === 'liability' && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Warranty Disclaimer</h3>
                  <p className="text-gray-700">
                    The service is provided "as is" without any representations or warranties, 
                    express or implied. We make no representations or warranties in relation to 
                    this website or the information and materials provided on this website.
                  </p>
                </div>
              )}
            </section>
          ))}

          {/* Additional Legal Sections */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              7. Privacy and Data Protection
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Our Privacy Policy explains how we collect, 
                use, and protect your information when you use our Service. By using our Service, 
                you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We comply with applicable data protection laws, including GDPR and CCPA. 
                You have rights regarding your personal data, including the right to access, 
                correct, or delete your information.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              8. Intellectual Property
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are and will 
                remain the exclusive property of Bibiere and its licensors. The Service is 
                protected by copyright, trademark, and other laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not reproduce, distribute, modify, create derivative works of, publicly 
                display, publicly perform, republish, download, store, or transmit any of the 
                material on our Service without our prior written consent.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              9. Governing Law
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be interpreted and governed by the laws of the jurisdiction 
                in which Bibiere operates, without regard to its conflict of law provisions. 
                Any disputes arising from these terms will be resolved through binding arbitration.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              10. Changes to Terms
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision 
                is material, we will try to provide at least 30 days notice prior to any new 
                terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </div>
          </section>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 rounded-lg p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p>Email: legal@bibiere.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Fashion Avenue, New York, NY 10001</p>
          </div>
        </div>
      </div>
    </div>
  );
}