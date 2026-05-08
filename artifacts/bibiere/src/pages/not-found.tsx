import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        <div className="text-8xl font-serif font-bold text-bibiere-burgundy/20">404</div>
        <h1 className="text-3xl font-serif font-bold">Page Not Found</h1>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let's get you back to our curated collections.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-bibiere-burgundy hover:bg-bibiere-burgundy-dark text-white">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/collections">Browse Collections</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
