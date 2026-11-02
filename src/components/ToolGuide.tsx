import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { getPageSeo } from "@/seo/pages";

interface ToolGuideProps {
  path: string;
}

/**
 * How-to steps, feature list and FAQ shown below a tool. Content lives in
 * src/seo/pages.ts so the prerendered HTML matches what users see.
 */
export const ToolGuide = ({ path }: ToolGuideProps) => {
  const guide = getPageSeo(path)?.guide;
  if (!guide) return null;

  return (
    <section className="space-y-6 sm:space-y-8 pt-4">
      <Card className="p-5 sm:p-6 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">{guide.howToTitle}</h2>
        <ol className="space-y-3">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm sm:text-base text-muted-foreground">
              <span className="gradient-primary text-white text-xs font-semibold rounded-full h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="p-5 sm:p-6 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">{guide.featuresTitle}</h2>
        <ul className="space-y-2.5">
          {guide.features.map((feature, i) => (
            <li key={i} className="flex gap-2.5 text-sm sm:text-base text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">Frequently asked questions</h2>
        <div className="space-y-3">
          {guide.faqs.map((faq, i) => (
            <Card key={i} className="p-4 sm:p-5 space-y-1.5">
              <h3 className="font-semibold text-sm sm:text-base">{faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
