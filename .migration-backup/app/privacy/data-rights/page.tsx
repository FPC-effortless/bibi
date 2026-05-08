import { Metadata } from 'next';
import DataRightsManager from '@/components/data-rights-manager';

export const metadata: Metadata = {
  title: 'Your Data Rights | Bibiere - Privacy Center',
  description: 'Manage your personal data rights including data export, deletion, and portability requests under GDPR and CCPA.',
  keywords: ['data rights', 'privacy', 'GDPR', 'CCPA', 'data export', 'right to be forgotten', 'bibiere'],
  openGraph: {
    title: 'Your Data Rights | Bibiere Privacy Center',
    description: 'Manage your personal data rights and privacy preferences.',
    type: 'website',
  },
  robots: {
    index: false, // Privacy pages should not be indexed
    follow: false,
  },
};

export default function DataRightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Data Rights
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You have rights regarding your personal data. Use the tools below to 
            exercise your rights under GDPR, CCPA, and other privacy regulations.
          </p>
        </div>

        <DataRightsManager />
      </div>
    </div>
  );
}