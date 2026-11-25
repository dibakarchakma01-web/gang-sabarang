import type { ReactNode } from 'react';
import type { PageRoute } from '../types';
import { SectionHeading } from './ui/SectionHeading';

interface PageShellProps {
  readonly routeId: PageRoute;
  readonly sectionLabel: string;
  readonly title: string;
  readonly description: string;
  readonly children?: ReactNode;
}

export function PageShell({
  routeId,
  sectionLabel,
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <section
      aria-labelledby={`page-heading-${routeId}`}
      data-route={routeId}
      className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16"
    >
      <div className="border-b border-brand-primary/12 pb-8">
        <SectionHeading
          as="h1"
          titleId={`page-heading-${routeId}`}
          eyebrow={sectionLabel}
          title={title}
          subtitle={description}
        />
      </div>

      {children ? <div className="mt-10">{children}</div> : null}
    </section>
  );
}
