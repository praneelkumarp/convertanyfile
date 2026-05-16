import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Code, Heart, Mail, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              About <span className="text-gradient">ConvertAnyFile</span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              A privacy-first universal file conversion platform built with modern web technologies.
            </p>
          </div>

          {/* The "Why" section */}
          <section className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Why ConvertAnyFile Exists</h2>
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>
                Most file converters online have a problem: they ask you to upload your file to their servers. Your contract documents, your scanned ID, your private spreadsheet — all of it gets sent across the internet to be processed on someone else's machine.
              </p>
              <p>
                ConvertAnyFile takes a different approach. Every conversion happens inside your browser. Your files are never uploaded. They never touch a server. They don't get logged, scanned, or stored anywhere outside your device. When you close the tab, nothing remains.
              </p>
              <p>
                This is possible because modern browsers are powerful enough to handle file processing locally. We just use that capability honestly — instead of pretending we need your files on our servers.
              </p>
            </div>
          </section>

          
          {/* Values cards */}
          <section className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center">What We Stand For</h2>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              <Card className="p-5 sm:p-6 space-y-3 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="gradient-success p-3 rounded-lg w-fit">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Privacy by Default</h3>
                <p className="text-sm text-muted-foreground">
                  Your files stay on your device. Always. That's not a setting — it's how the tool works.
                </p>
              </Card>

              <Card className="p-5 sm:p-6 space-y-3 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="gradient-primary p-3 rounded-lg w-fit">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Honest Engineering</h3>
                <p className="text-sm text-muted-foreground">
                  We tell you what works perfectly, what has limitations, and what we don't support yet.
                </p>
              </Card>

              <Card className="p-5 sm:p-6 space-y-3 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="gradient-primary p-3 rounded-lg w-fit">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">Always Free</h3>
                <p className="text-sm text-muted-foreground">
                  Core conversions stay free, supported by minimal, consent-based advertising.
                </p>
              </Card>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center space-y-4 sm:space-y-6 pt-6 sm:pt-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Have questions?</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[48px]">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
              </Link>
              <Link to="/convert" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gradient-primary text-white hover:opacity-90 shadow-glow min-h-[48px]"
                >
                  Try Converting
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
