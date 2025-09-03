import { BrandLogo } from "@/components/brand-logo"

export default function LogoDemo() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <h1 className="text-3xl font-serif font-bold text-center mb-8">
        bibiere Brand Logo Variants
      </h1>
      
      {/* Header Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Header Variant</h2>
        <div className="p-6 bg-sidebar rounded-lg">
          <BrandLogo variant="header" />
        </div>
      </section>

      {/* Footer Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Footer Variant</h2>
        <div className="p-6 bg-sidebar rounded-lg">
          <BrandLogo variant="footer" />
        </div>
      </section>

      {/* Mobile Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Mobile Variant</h2>
        <div className="p-6 bg-sidebar rounded-lg">
          <BrandLogo variant="mobile" />
        </div>
      </section>

      {/* Large Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Large Variant</h2>
        <div className="p-6 bg-sidebar rounded-lg">
          <BrandLogo variant="large" />
        </div>
      </section>

      {/* Icon Only Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Icon Only Variants</h2>
        <div className="p-6 bg-sidebar rounded-lg flex gap-6 items-center">
          <BrandLogo variant="header" showText={false} />
          <BrandLogo variant="footer" showText={false} />
          <BrandLogo variant="mobile" showText={false} />
          <BrandLogo variant="large" showText={false} />
        </div>
      </section>

      {/* Without Link */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Without Link (Static)</h2>
        <div className="p-6 bg-sidebar rounded-lg">
          <BrandLogo variant="header" href="" />
        </div>
      </section>

      {/* Color Demonstration */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Color Behavior</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg border">
            <p className="text-sm text-gray-600 mb-4">On Light Background</p>
            <BrandLogo variant="header" />
          </div>
          <div className="p-6 bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-300 mb-4">On Dark Background</p>
            <BrandLogo variant="header" className="text-white" />
          </div>
        </div>
      </section>

      {/* Hover State Instructions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Interactive Features</h2>
        <div className="p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-700">
            Hover over any logo to see the color transition from burgundy to gold.
            The transition duration is 300ms for smooth interaction feedback.
          </p>
        </div>
      </section>
    </div>
  )
}