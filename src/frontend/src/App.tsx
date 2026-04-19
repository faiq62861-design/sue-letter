import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  useLocation,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { UpgradeModal } from "./components/UpgradeModal";

const HomePage = lazy(() => import("./pages/HomePage"));
const GeneratePage = lazy(() => import("./pages/GeneratePage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const DebtLandingPage = lazy(() => import("./pages/DebtLandingPage"));
const LandlordLandingPage = lazy(() => import("./pages/LandlordLandingPage"));
const PartnershipPage = lazy(() => import("./pages/PartnershipPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogArticlePage = lazy(() => import("./pages/BlogArticlePage"));

function PageLoader() {
  return (
    <div
      className="flex-1 flex items-center justify-center min-h-[60vh]"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

function AuthGuardPage({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useInternetIdentity();
  if (isInitializing) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/" />;
  return <>{children}</>;
}

// Animated page wrapper for route transitions
function AnimatedOutlet() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{
          duration: 0.25,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

// Root layout route
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <AnimatedOutlet />
      <UpgradeModal />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  ),
});

const generateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/generate",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <GeneratePage />
    </Suspense>
  ),
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PricingPage />
    </Suspense>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <AuthGuardPage>
      <Suspense fallback={<PageLoader />}>
        <DashboardPage />
      </Suspense>
    </AuthGuardPage>
  ),
});

const debtRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/debt-demand-letter-generator",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DebtLandingPage />
    </Suspense>
  ),
});

const landlordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/landlord-demand-letter-generator",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LandlordLandingPage />
    </Suspense>
  ),
});

const partnershipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/partnership",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PartnershipPage />
    </Suspense>
  ),
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <BlogPage />
    </Suspense>
  ),
});

const blogArticleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$slug",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <BlogArticlePage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  generateRoute,
  pricingRoute,
  dashboardRoute,
  debtRoute,
  landlordRoute,
  partnershipRoute,
  blogRoute,
  blogArticleRoute,
]);

const hashHistory = createHashHistory();

const router = createRouter({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
