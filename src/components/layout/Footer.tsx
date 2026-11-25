import {
  ExternalLink,
  Globe,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import type { PageRoute } from '../../types';
import {
  VERIFIED_GOOGLE_MAPS_SEARCH_URL,
  formatPhoneDisplay,
  toSafeExternalUrl,
  toTelHref,
  toWhatsAppHref,
} from '../../utils/contactLinks';
import { PUBLIC_ROUTE_DEFINITIONS } from '../../utils/router';

export interface FooterProps {
  readonly onNavigate: (route: PageRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { contactInfo } = useSiteData();
  const currentYear = new Date().getFullYear();

  // Gang Sabarang Restaurant contact info
  const restaurantPhone = contactInfo.phone || '+8801550050641';
  const formattedPhone = formatPhoneDisplay(restaurantPhone);
  const telHref = toTelHref(restaurantPhone);

  const restaurantWhatsApp = contactInfo.whatsapp || '+8801550050641';
  const formattedWhatsApp = formatPhoneDisplay(restaurantWhatsApp);
  const restaurantWhatsAppHref =
    toWhatsAppHref(restaurantWhatsApp) || 'https://wa.me/8801550050641';

  const facebookUrl =
    contactInfo.facebookUrl || 'https://www.facebook.com/gangsabarang';
  const facebookHref = toSafeExternalUrl(facebookUrl);

  // Developer (Dibakar Chakma) contact link
  const developerWhatsAppHref = 'https://wa.me/8801714410596';

  return (
    <footer className="bg-brand-primary text-brand-ivory border-t border-brand-secondary/30">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Column 1: Brand Overview */}
          <div className="md:col-span-5">
            <p className="text-xl font-bold tracking-[0.08em] text-brand-ivory">
              GANG SABARANG
            </p>
            <p className="mt-1 text-xs font-medium tracking-[0.2em] text-brand-secondary">
              RESTAURANT &amp; COTTAGE
            </p>
            <div
              className="my-5 h-px w-14 bg-brand-secondary/60"
              aria-hidden="true"
            />
            <p className="max-w-sm text-base leading-relaxed text-brand-ivory/85">
              Gang Sabarang — Restaurant &amp; Cottage surrounded by the natural
              beauty of Rangamati.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-2.5">
              {PUBLIC_ROUTE_DEFINITIONS.map((item) => (
                <li key={item.route}>
                  <a
                    href={item.hash}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(item.route);
                    }}
                    className="inline-flex min-h-[32px] items-center text-base text-brand-ivory/85 hover:text-brand-secondary transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Location & Contact */}
          <div className="md:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-secondary">
              Location &amp; Contact
            </h2>
            <ul className="mt-4 space-y-3.5 text-sm leading-relaxed text-brand-ivory/85">
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-4 w-4 text-brand-secondary shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={VERIFIED_GOOGLE_MAPS_SEARCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-secondary transition-colors underline decoration-brand-ivory/25 underline-offset-4"
                >
                  {contactInfo.address}
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <Phone
                  className="mt-0.5 h-4 w-4 text-brand-secondary shrink-0"
                  aria-hidden="true"
                />
                <span>
                  Phone:{' '}
                  {telHref ? (
                    <a
                      href={telHref}
                      className="tabular-nums hover:text-brand-secondary transition-colors underline decoration-brand-ivory/25 underline-offset-4"
                    >
                      {formattedPhone}
                    </a>
                  ) : (
                    restaurantPhone
                  )}
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <MessageCircle
                  className="mt-0.5 h-4 w-4 text-brand-secondary shrink-0"
                  aria-hidden="true"
                />
                <span>
                  WhatsApp:{' '}
                  {restaurantWhatsAppHref ? (
                    <a
                      href={restaurantWhatsAppHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 tabular-nums hover:text-brand-secondary transition-colors underline decoration-brand-ivory/25 underline-offset-4"
                    >
                      <span>{formattedWhatsApp}</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ) : (
                    restaurantWhatsApp
                  )}
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <Globe
                  className="mt-0.5 h-4 w-4 text-brand-secondary shrink-0"
                  aria-hidden="true"
                />
                <span>
                  Facebook:{' '}
                  {facebookHref ? (
                    <a
                      href={facebookHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-brand-secondary transition-colors underline decoration-brand-ivory/25 underline-offset-4"
                    >
                      <span>facebook.com/gangsabarang</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ) : (
                    facebookUrl
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-brand-ivory/15 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-brand-ivory/75">
          <p>&copy; {currentYear} Gang Sabarang. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>
              Designed &amp; developed by{' '}
              <a
                href="https://www.facebook.com/dibakorchofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-secondary hover:text-brand-accent transition-colors underline decoration-brand-secondary/40 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
              >
                Dibakar Chakma
              </a>
            </span>
            <a
              href={developerWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="Chat with Dibakar Chakma on WhatsApp"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-brand-secondary/40 bg-brand-primary/60 text-brand-secondary hover:border-brand-secondary hover:bg-brand-secondary hover:text-brand-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
