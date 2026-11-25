import {
  ExternalLink,
  Globe,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { ResilientImage } from '../components/ui/ResilientImage';
import { useSiteData } from '../context/SiteDataContext';
import { BRAND_IMAGES } from '../data/initialData';
import {
  VERIFIED_GOOGLE_MAPS_SEARCH_URL,
  formatPhoneDisplay,
  toSafeExternalUrl,
  toTelHref,
  toWhatsAppHref,
} from '../utils/contactLinks';

export function ContactPage() {
  const { contactInfo } = useSiteData();
  const formattedPhone = formatPhoneDisplay(contactInfo.phone);
  const telHref = toTelHref(contactInfo.phone);
  const formattedWhatsApp = formatPhoneDisplay(contactInfo.whatsapp);
  const whatsAppHref = toWhatsAppHref(contactInfo.whatsapp);
  const facebookHref = toSafeExternalUrl(contactInfo.facebookUrl);
  const mapEmbedHref = toSafeExternalUrl(contactInfo.mapEmbedUrl);

  return (
    <PageShell
      routeId="contact"
      sectionLabel="Location & Inquiries · Rangamati"
      title="Contact"
      description="Reach out to Gang Sabarang directly by phone, WhatsApp, or Facebook, or open our verified Rangamati address on Google Maps."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-brand-secondary/35 bg-white/80 p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <MapPin
              className="mt-1 h-4 w-4 text-brand-accent shrink-0"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-sm font-semibold text-brand-primary">
                Address
              </h2>
              <p className="mt-1 text-base leading-relaxed text-brand-ink/90">
                {contactInfo.address}
              </p>
              <a
                href={VERIFIED_GOOGLE_MAPS_SEARCH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary underline underline-offset-4 hover:text-brand-accent"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="border-t border-brand-primary/10 pt-4 flex items-start gap-3">
            <Phone
              className="mt-1 h-4 w-4 text-brand-accent shrink-0"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-sm font-semibold text-brand-primary">Phone</h2>
              {telHref ? (
                <a
                  href={telHref}
                  className="mt-1 inline-block text-base font-medium tabular-nums text-brand-primary underline underline-offset-4 hover:text-brand-accent"
                >
                  {formattedPhone}
                </a>
              ) : (
                <p className="mt-1 text-sm text-brand-ink/70">
                  {contactInfo.phone}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-brand-primary/10 pt-4 flex items-start gap-3">
            <MessageCircle
              className="mt-1 h-4 w-4 text-brand-accent shrink-0"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-sm font-semibold text-brand-primary">
                WhatsApp
              </h2>
              {whatsAppHref ? (
                <a
                  href={whatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-base font-medium tabular-nums text-brand-primary underline underline-offset-4 hover:text-brand-accent"
                >
                  <span>{formattedWhatsApp}</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : (
                <p className="mt-1 text-sm text-brand-ink/70">
                  {contactInfo.whatsapp}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-brand-primary/10 pt-4 flex items-start gap-3">
            <Globe
              className="mt-1 h-4 w-4 text-brand-accent shrink-0"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-sm font-semibold text-brand-primary">
                Facebook Page
              </h2>
              {facebookHref ? (
                <a
                  href={facebookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-base font-medium text-brand-primary underline underline-offset-4 hover:text-brand-accent break-all"
                >
                  <span>facebook.com/gangsabarang</span>
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <p className="mt-1 text-sm text-brand-ink/70">
                  {contactInfo.facebookUrl}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-brand-secondary/35 bg-white/80 flex flex-col">
          {mapEmbedHref ? (
            <iframe
              title="Gang Sabarang Location Map"
              src={mapEmbedHref}
              className="min-h-[300px] w-full flex-1 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="relative min-h-[240px] flex-1 bg-brand-primary/8">
              <ResilientImage
                src={BRAND_IMAGES.nature}
                alt="Rangamati hillside scenery near Gang Sabarang"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="border-t border-brand-primary/10 bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-brand-primary">
                Google Maps Direction
              </p>
              <p className="text-xs text-brand-ink/65">
                {contactInfo.address}
              </p>
            </div>
            <a
              href={VERIFIED_GOOGLE_MAPS_SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-brand-primary px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary hover:text-brand-ivory transition-colors whitespace-nowrap shrink-0"
            >
              <span>Search on Maps</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
