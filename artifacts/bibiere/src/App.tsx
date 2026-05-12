import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, useClerk, useAuth } from "@clerk/react";
import { shadcn } from "@clerk/themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "sonner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ErrorBoundary from "@/components/error-boundary";
import { CommerceProvider } from "@/components/commerce-provider";
import CookieConsentBanner from "@/components/cookie-consent-banner";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import {
  clerkProxyUrl,
  clerkPublishableKey,
  convexUrl,
  hasClerkConfig,
  hasConvexConfig,
} from "@/lib/runtime-config";

const convex = hasConvexConfig ? new ConvexReactClient(convexUrl) : null;

import HomePage from "@/pages/home";
import CollectionsPage from "@/pages/collections";
import CollectionDetailPage from "@/pages/collection-detail";
import ProductPage from "@/pages/product";
import AboutPage from "@/pages/about";
import LookbookPage from "@/pages/lookbook";
import CartPage from "@/pages/cart";
import WishlistPage from "@/pages/wishlist";
import CheckoutPage from "@/pages/checkout";
import AccountPage from "@/pages/account";
import SearchPage from "@/pages/search";
import FAQPage from "@/pages/faq";
import ContactPage from "@/pages/contact";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

function MissingConfigurationPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 shadow-sm">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-bibiere-burgundy">
          Deployment configuration
        </p>
        <h1 className="mb-4 font-serif text-3xl font-semibold">
          bibiere needs one Vercel environment variable
        </h1>
        <p className="mb-6 text-muted-foreground">
          Add <code className="rounded bg-muted px-1.5 py-0.5">VITE_CLERK_PUBLISHABLE_KEY</code> to the Vercel project and redeploy. The app now falls back to a static catalog when Convex is not configured, but Clerk still needs its public browser key before auth-aware pages can render.
        </p>
        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          Optional backend variable:{" "}
          <code className="text-foreground">VITE_CONVEX_URL</code>
        </div>
      </div>
    </main>
  );
}

const clerkAppearance = {
  theme: shadcn,
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#8B1538",
    colorForeground: "#1f2937",
    colorMutedForeground: "#6b7280",
    colorDanger: "#be123c",
    colorBackground: "#ffffff",
    colorInput: "#f8f9fa",
    colorInputForeground: "#1f2937",
    colorNeutral: "#e5e7eb",
    fontFamily: "Playfair Display, Georgia, serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-lg border border-gray-100",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "font-serif text-gray-900",
    headerSubtitle: "text-gray-500",
    socialButtonsBlockButtonText: "text-gray-700",
    formFieldLabel: "text-gray-700 font-medium",
    footerActionLink: "text-bibiere-burgundy hover:text-bibiere-burgundy/80",
    footerActionText: "text-gray-500",
    dividerText: "text-gray-400",
    identityPreviewEditButton: "text-bibiere-burgundy",
    formFieldSuccessText: "text-green-600",
    alertText: "text-red-600",
    logoBox: "flex justify-center",
    logoImage: "h-10 w-auto",
    socialButtonsBlockButton: "border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50",
    formButtonPrimary: "bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white font-medium",
    formFieldInput: "border-gray-200 bg-white text-gray-900 focus:border-bibiere-burgundy",
    footerAction: "border-t border-gray-100",
    dividerLine: "bg-gray-200",
    alert: "border border-red-100 bg-red-50",
    otpCodeFieldInput: "border-gray-200 bg-white text-gray-900",
    formFieldRow: "gap-3",
    main: "gap-5",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function AppRoutes() {
  return (
    <ErrorBoundary>
      <CommerceProvider>
        <Header />
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="/collections" component={CollectionsPage} />
          <Route path="/collections/:slug" component={CollectionDetailPage} />
          <Route path="/product/:id" component={ProductPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/lookbook" component={LookbookPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/wishlist" component={WishlistPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/account" component={AccountPage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/contact" component={ContactPage} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
        <CookieConsentBanner />
      </CommerceProvider>
    </ErrorBoundary>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      proxyUrl={clerkProxyUrl || undefined}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      afterSignOutUrl={basePath || "/"}
      localization={{
        signIn: { start: { title: "Welcome back to bibiere", subtitle: "Sign in to access your account" } },
        signUp: { start: { title: "Join bibiere", subtitle: "Create your account to start shopping" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        {convex ? (
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <ClerkQueryClientCacheInvalidator />
            <TooltipProvider>
              <AppRoutes />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </ConvexProviderWithClerk>
        ) : (
          <TooltipProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        )}
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  if (!hasClerkConfig) {
    return <MissingConfigurationPage />;
  }

  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
