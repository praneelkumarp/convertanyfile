import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Mail, Twitter, Github, Linkedin, MessageSquare } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Questions, feedback, feature requests, or partnership inquiries — we read every message.
            </p>
          </div>

          {/* Primary contact methods */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="gradient-primary p-3 rounded-lg shrink-0">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold">Email</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Reach us directly at{" "}
                  {/* TODO: Praneel — replace with your real email */}
                  <a
                    href="mailto:hello@convertanyfile.online"
                    className="text-primary hover:underline break-all"
                  >
                    hello@convertanyfile.online
                  </a>
                </p>
                <p className="text-xs text-muted-foreground pt-1">
                  We typically respond within 24-48 hours.
                </p>
              </div>
            </div>
          </Card>

          {/* Social — Coming soon */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-center">Find us on social media</h2>
            <p className="text-sm text-muted-foreground text-center">
              Social channels launching soon — bookmark this page to follow updates.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div
                aria-label="Twitter — Coming soon"
                title="Coming soon"
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-dashed border-border text-muted-foreground/60 cursor-not-allowed min-h-[44px]"
              >
                <Twitter className="h-5 w-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">Twitter</div>
                  <div className="text-xs italic">Coming soon</div>
                </div>
              </div>

              <div
                aria-label="GitHub — Coming soon"
                title="Coming soon"
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-dashed border-border text-muted-foreground/60 cursor-not-allowed min-h-[44px]"
              >
                <Github className="h-5 w-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">GitHub</div>
                  <div className="text-xs italic">Coming soon</div>
                </div>
              </div>

              <div
                aria-label="LinkedIn — Coming soon"
                title="Coming soon"
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-dashed border-border text-muted-foreground/60 cursor-not-allowed min-h-[44px]"
              >
                <Linkedin className="h-5 w-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">LinkedIn</div>
                  <div className="text-xs italic">Coming soon</div>
                </div>
              </div>
            </div>
          </div>

          {/* What to expect */}
          <Card className="p-6 sm:p-8 bg-card/50">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="gradient-primary p-2 sm:p-3 rounded-lg shrink-0">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-semibold">What we'd love to hear about</h3>
                <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>File format you wish we supported</li>
                  <li>Bugs or weird behavior you noticed</li>
                  <li>UI/UX improvements that would help you</li>
                  <li>Partnership and integration opportunities</li>
                  <li>Press, interviews, or media inquiries</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
