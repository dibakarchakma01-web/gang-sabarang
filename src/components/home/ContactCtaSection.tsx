import {
  ArrowRight,
  ExternalLink,
  Globe,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import type { PageRoute } from '../../types';
import {
  formatPhoneDisplay,
  toSafeExternalUrl,
  toTelHref,
  toWhatsAppHref,
} from '../../utils/contactLinks';
import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';

interface ContactCtaSectionProps {
  readonly onNavigate: (route: PageRoute) => void;
}

export function ContactCtaSection({ onNavigate }: ContactCtaSectionProps) {
  const { contactInfo } = useSiteData();
  const formattedPhone = formatPhoneDisplay(contactInfo.phone);
  const telHref = toTelHref(contactInfo.phone);
  const formattedWhatsApp = formatPhoneDisplay(contactInfo.whatsapp);
  const whatsAppHref = toWhatsAppHref(contactInfo.whatsapp);
  const facebookHref = toSafeExternalUrl(contactInfo.facebookUrl);

  return (
    <section
      aria-labelledby="contact-cta-heading"
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="rounded-xl border border-brand-secondary/40 bg-white/80 p-8 sm:p-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <SectionHeading
              titleId="contact-cta-heading"
              eyebrow="Plan Your Visit"
              title="Welcome to Gang Sabarang"
              subtitle="Reach out for dining inquiries, cottage availability, or directions to our Rangamati property."
            />

            <div className="mt-8">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate('contact')}
              >
                <span>Contact Us</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4 border-t border-brand-primary/10 pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            <div className="flex items-start gap-3">
              <Phone
                className="mt-1 h-4 w-4 text-brand-accent shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/60">
                  Phone
                </p>
                {telHref ? (
                  <a
                    href={telHref}
                    className="mt-0.5 inline-block text-base font-medium tabular-nums text-brand-primary underline underline-offset-4 hover:text-brand-accent"
                  >
                    {formattedPhone}
                  </a>
                ) : (
                  <p className="mt-0.5 text-sm text-brand-ink/80">
                    {contactInfo.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle
                className="mt-1 h-4 w-4 text-brand-accent shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/60">
                  WhatsApp
                </p>
                {whatsAppHref ? (
                  <a
                    href={whatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-flex items-center gap-1.5 text-base font-medium tabular-nums text-brand-primary underline underline-offset-4 hover:text-brand-accent"
                  >
                    <span>{formattedWhatsApp}</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <p className="mt-0.5 text-sm text-brand-ink/80">
                    {contactInfo.whatsapp}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe
                className="mt-1 h-4 w-4 text-brand-accent shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/60">
                  Facebook
                </p>
                {facebookHref ? (
                  <a
                    href={facebookHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-flex items-center gap-1.5 text-base font-medium text-brand-primary underline underline-offset-4 hover:text-brand-accent"
                  >
                    <span>facebook.com/gangsabarang</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <p className="mt-0.5 text-sm text-brand-ink/80">
                    {contactInfo.facebookUrl}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
