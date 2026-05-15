
import { Button } from "@/components/ui/button"
import { Link } from "wouter"

type HeroContent = {
  eyebrow?: string
  title?: string
  intro?: string
  values?: string[]
}

export default function HeroSection({ content }: { content?: HeroContent | null }) {
  const titleLines = (content?.title ?? "Timeless Luxury\nRedefined").split("\n")
  const values = content?.values?.length
    ? content.values
    : ["Handcrafted Excellence", "Timeless Design", "Sustainable Luxury"]

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video 
        className="absolute inset-0 h-full w-full object-cover" 
        autoPlay 
        loop 
        muted 
        playsInline
        poster="/placeholder.jpg?height=1080&width=1920&query=luxury fashion elegant background"
      >
        <source
          src="/placeholder.mp4?height=1080&width=1920&query=luxury fashion runway models elegant dresses flowing fabric"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Enhanced Multi-Layer Overlay for Superior Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-bibiere-burgundy/25 via-transparent to-bibiere-burgundy/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content Container with Enhanced Mobile Optimization */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-6xl w-full">
          {/* Brand Tagline with Enhanced Animation */}
          <div className="mb-6 sm:mb-8 animate-fade-in-up">
            <span className="inline-block font-serif text-bibiere-gold text-base sm:text-lg md:text-xl font-medium tracking-[0.2em] uppercase drop-shadow-lg">
              {content?.eyebrow ?? "bibiere"}
            </span>
          </div>

          {/* Main Headline - Enhanced with bibiere brand voice and better mobile scaling */}
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-[1.1] sm:leading-tight animate-fade-in-up animation-delay-200 drop-shadow-2xl">
            {titleLines[0]}
            {titleLines.slice(1).map((line) => (
              <span key={line} className="block text-bibiere-gold">{line}</span>
            ))}
          </h1>

          {/* Subheading - Enhanced bibiere messaging with better mobile readability */}
          <p className="mx-auto mt-6 sm:mt-8 max-w-2xl lg:max-w-4xl font-sans text-base leading-relaxed text-white/95 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light animate-fade-in-up animation-delay-400 drop-shadow-lg">
            {content?.intro ?? "Discover exquisite pieces that embody sophistication, crafted for the discerning individual who values artistry and elegance"}
          </p>

          {/* Call-to-Action Buttons - Enhanced design with better interactions */}
          <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up animation-delay-600">
            <Button
              asChild
              size="lg"
              className="group bg-bibiere-burgundy hover:bg-bibiere-burgundy-dark text-white border-0 px-8 py-4 sm:px-12 sm:py-6 font-sans text-base sm:text-lg font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-xl min-w-[220px] relative overflow-hidden"
            >
              <Link href="/collections">
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-gradient-to-r from-bibiere-burgundy-dark to-bibiere-burgundy opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-2 border-white/90 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-bibiere-burgundy text-white px-8 py-4 sm:px-12 sm:py-6 font-sans text-base sm:text-lg font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-2xl min-w-[220px] relative overflow-hidden"
            >
              <Link href="/lookbook">
                <span className="relative z-10">View Lookbook</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </Button>
          </div>

          {/* Enhanced Brand Values with Better Mobile Layout */}
          <div className="mt-10 sm:mt-12 animate-fade-in-up animation-delay-800">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/85">
              {values.slice(0, 3).map((value, index) => (
                <div key={value} className="contents">
                  {index > 0 && <div className="hidden sm:block w-px h-4 bg-white/30" />}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-bibiere-gold rounded-full" />
                    <span className="font-sans text-sm sm:text-base font-light tracking-wide">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator with Better Mobile Visibility */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-5 rounded-full border-2 border-white/80 flex justify-center bg-white/10 backdrop-blur-sm">
            <div className="mt-2 h-2 w-1 animate-pulse rounded-full bg-white/80" />
          </div>
          <span className="text-white/70 text-xs font-sans tracking-wider uppercase font-medium">Discover</span>
        </div>
      </div>
    </section>
  )
}
