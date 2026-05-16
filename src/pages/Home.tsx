import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Zap,
  Lock,
  FileCode,
  Sparkles,
  CloudOff,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative gradient orbs for neon depth */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="container mx-auto px-4 py-12 sm:py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-medium">
                Privacy-First File Conversion
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Convert any file.{" "}
              <span className="text-gradient">Anywhere. Anytime.</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Universal file conversion that respects your privacy. Process files directly in your browser — no uploads, no servers, no tracking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
              <Link to="/convert" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gradient-primary text-white hover:opacity-90 shadow-glow text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 min-h-[48px]"
                >
                  Start Converting
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 min-h-[48px]"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground pt-4">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-success" />
                No account required
              </span>
              <span className="flex items-center gap-1.5">
                <CloudOff className="h-4 w-4 text-success" />
                No file uploads
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-success" />
                100% private
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Built for Privacy & Performance
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                Features that put your privacy first, every time
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="p-5 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="gradient-success p-3 rounded-lg w-fit">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Client-Side Processing</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Files are processed directly in your browser. They never touch our servers.
                </p>
              </Card>

              <Card className="p-5 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="gradient-primary p-3 rounded-lg w-fit">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">No Upload Wait</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Conversions start the moment you select a file. No upload, no queue, no delay.
                </p>
              </Card>

              <Card className="p-5 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="gradient-primary p-3 rounded-lg w-fit">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Zero File Tracking</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  We don't see, store, or track your files. Your data stays yours, always.
                </p>
              </Card>

              <Card className="p-5 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="gradient-primary p-3 rounded-lg w-fit">
                  <FileCode className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Multiple Formats</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  PDF, DOCX, XLSX, PNG, JPG, WEBP, ZIP and more. New formats added regularly.
                </p>
              </Card>

              <Card className="p-5 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="gradient-primary p-3 rounded-lg w-fit">
                  <CloudOff className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Works Without Cloud</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Every conversion runs locally. No third-party servers ever see your file.
                </p>
              </Card>

              <Card className="p-5 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="gradient-success p-3 rounded-lg w-fit">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Always Free</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  No subscriptions, no premium tier walls, no hidden costs. Just convert.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Ready to convert your files?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            Start converting files instantly with complete privacy protection.
          </p>
          <Link to="/convert">
            <Button
              size="lg"
              className="gradient-primary text-white hover:opacity-90 shadow-glow text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 min-h-[48px]"
            >
              Try It Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
