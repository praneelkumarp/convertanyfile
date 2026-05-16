import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/hooks/useConsent";
import { toast } from "sonner";

const RevokeConsentButton = () => {
  const { consent, revokeConsent } = useConsent();
  const handleRevoke = () => {
    revokeConsent();
    toast.success("Advertising consent revoked. Ads will not load until you accept again.");
  };
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRevoke}
      disabled={consent !== "accepted"}
    >
      {consent === "accepted" ? "Revoke Advertising Consent" : "Consent Not Granted"}
    </Button>
  );
};


const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your privacy is our top priority. Here's exactly how we handle your data.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="gradient-success p-3 rounded-lg w-fit">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Client-Side First</h3>
              <p className="text-muted-foreground">
                By default, all file conversions happen entirely in your browser. Your files never touch our servers.
              </p>
            </Card>
            
            <Card className="p-6 space-y-4">
              <div className="gradient-primary p-3 rounded-lg w-fit">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Explicit Consent</h3>
              <p className="text-muted-foreground">
                If server processing is ever needed, we'll ask for your explicit consent before any upload occurs.
              </p>
            </Card>
            
            <Card className="p-6 space-y-4">
              <div className="gradient-primary p-3 rounded-lg w-fit">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">No File Tracking</h3>
              <p className="text-muted-foreground">
                We never track your file contents or conversions. With your consent, we may show ads that use cookies — see Advertising below.
              </p>
            </Card>
            
            <Card className="p-6 space-y-4">
              <div className="gradient-primary p-3 rounded-lg w-fit">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Auto-Deletion</h3>
              <p className="text-muted-foreground">
                Any consented server uploads are automatically deleted within 48 hours. No exceptions.
              </p>
            </Card>
          </div>
          
          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-bold">Detailed Privacy Practices</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">What We Don't Collect Ourselves</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Your file contents or metadata (files never leave your browser)</li>
                  <li>Personal information or account data (we have no accounts)</li>
                  <li>Conversion history or patterns tied to you</li>
                  <li>Tracking cookies set by us — only ad cookies set by Google with your consent (see Advertising below)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">What We Collect (Minimal)</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Anonymous usage statistics (page views, feature usage) via privacy-respecting analytics</li>
                  <li>Error logs for debugging (no file contents, only technical metadata)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Server-Side Conversions (Opt-In Only)</h3>
                <p className="text-muted-foreground mb-2">
                  For complex conversions that cannot be performed client-side, you may choose to use our 
                  server-side processing. If you opt-in:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>A clear consent dialog will appear before any upload</li>
                  <li>Your file will be temporarily stored for processing (max 48 hours)</li>
                  <li>Files are processed in isolated, encrypted environments</li>
                  <li>All data is automatically purged after the retention period</li>
                  <li>We log consent actions for audit purposes (timestamp, IP hash)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Advertising (Google AdSense)</h3>
                <p className="text-muted-foreground mb-2">
                  To keep ConvertAnyFile free, we display ads via Google AdSense. This is the one place where third-party data collection happens, and it only happens after you click "Accept All" on our consent banner.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Ads are not loaded until you give explicit consent</li>
                  <li>Google may use cookies and similar technologies to serve personalized ads</li>
                  <li>Google may collect anonymized data such as your IP address, browser type, and pages visited</li>
                  <li>Your file contents are never accessible to Google or any advertiser — files are processed entirely in your browser</li>
                  <li>You can review or change your ad personalization settings at{" "}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary hover:text-primary/80"
                    >
                      adssettings.google.com
                    </a>
                  </li>
                  <li>For more details, see{" "}
                    <a
                      href="https://policies.google.com/technologies/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary hover:text-primary/80"
                    >
                      Google's advertising privacy policy
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Revoking Your Consent</h3>
                <p className="text-muted-foreground mb-3">
                  You can revoke advertising consent at any time. Once revoked, ads will stop loading and the consent banner will reappear on your next visit.
                </p>
                <RevokeConsentButton />
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Third-Party Services</h3>
                <p className="text-muted-foreground">
                  We may use privacy-respecting third-party services for hosting and analytics. These services 
                  are chosen specifically for their privacy commitments and do not have access to your file contents.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Your Rights</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>You can use this service without providing any personal information</li>
                  <li>You have complete control over whether files are processed client-side or server-side</li>
                  <li>You can request deletion of any consented data at any time</li>
                </ul>
              </div>
            </div>
          </Card>
          
          <Card className="p-8 bg-success/5 border-success/20">
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              Privacy isn't just a feature—it's the foundation of ConvertAnyFile. We believe you should never 
              have to choose between convenience and privacy. If you have any questions or concerns about our 
              privacy practices, please don't hesitate to reach out.
            </p>
          </Card>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
