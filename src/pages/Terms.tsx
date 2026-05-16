import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

/**
 * Terms of Service template.
 * Praneel: search for [BRACKETED_TEXT] and replace with your specifics
 * before publishing.
 *
 * This is a STARTER template — for binding legal use, especially as you
 * grow, consider having an Indian lawyer review (₹3000-5000 typically).
 */
const Terms = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="inline-flex p-3 sm:p-4 rounded-full bg-primary/10 mb-2">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Last updated: 15/05/2026
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-6 text-sm sm:text-base">
              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using ConvertAnyFile ("Service", "we", "us", "our"), located at <strong>convertanyfile.online</strong>, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ConvertAnyFile is a free, browser-based file conversion tool. All file processing occurs locally within your web browser. We do not upload, store, or process your files on any remote server.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">3. Use of the Service</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You agree to use the Service only for lawful purposes. You are solely responsible for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 leading-relaxed">
                  <li>The files you choose to convert and their content</li>
                  <li>Compliance with all applicable laws regarding the files you process</li>
                  <li>Respecting copyright, intellectual property, and privacy rights of third parties</li>
                  <li>Not using the Service to convert files containing illegal, harmful, or infringing content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">4. Privacy & Data Handling</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your files are processed entirely within your browser and are never transmitted to our servers. For full details on what data we do collect (limited to cookie consent state and advertising preferences if you opt in), please refer to our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">5. Advertising</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service may display advertisements via Google AdSense to support free access. Advertisements are only loaded after explicit user consent and are subject to Google's privacy and ad policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">6. Limitations & Disclaimers</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, express or implied. We do not guarantee:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 leading-relaxed">
                  <li>Perfect conversion fidelity in every case (some formats have known limitations, clearly disclosed in the UI)</li>
                  <li>Uninterrupted or error-free service</li>
                  <li>Compatibility with all browsers, devices, or file types</li>
                  <li>Recovery of files if your conversion fails (since we never have them — your originals stay on your device)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, ConvertAnyFile and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to loss of data, business interruption, or any errors in converted output.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">8. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service, including its design, code, and branding, is owned by ConvertAnyFile and its operators. You retain all rights to files you convert. We claim no rights over your content.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">9. Changes to These Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update these Terms from time to time. Material changes will be announced on this page. Continued use of the Service after changes constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">10. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms are governed by the laws of <strong>[INDIA- "India, with disputes subject to the jurisdiction of courts in Andhra Pradesh"]</strong>. Any disputes arising from your use of the Service shall be resolved under these laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3">11. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Questions about these Terms? Reach us via our <a href="/contact" className="text-primary hover:underline">Contact page</a> or email us at <strong>info@convertanyfile.online</strong>
                </p>
              </section>
            </div>
          </Card>

          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>
              This is a starter template. For binding legal use, consider review by a qualified lawyer in your jurisdiction.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
