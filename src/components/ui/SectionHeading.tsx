export type SectionHeadingAlign = 'left' | 'center';
export type SectionHeadingLevel = 'h1' | 'h2' | 'h3';

interface SectionHeadingProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly align?: SectionHeadingAlign;
  readonly as?: SectionHeadingLevel;
  readonly titleId?: string;
  readonly className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  as = 'h2',
  titleId,
  className = '',
}: SectionHeadingProps) {
  const HeadingTag = as;
  const isCentered = align === 'center';

  return (
    <div
      className={`${
        isCentered ? 'mx-auto text-center items-center' : 'text-left items-start'
      } flex flex-col ${className}`.trim()}
    >
      {eyebrow ? (
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-brand-secondary">
          {eyebrow}
        </p>
      ) : null}

      <HeadingTag
        id={titleId}
        className={`${eyebrow ? 'mt-2.5' : ''} ${
          as === 'h1'
            ? 'text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08]'
            : 'text-2xl sm:text-4xl font-semibold tracking-tight leading-[1.15]'
        } text-brand-primary text-balance`.trim()}
      >
        {title}
      </HeadingTag>

      {subtitle ? (
        <p
          className={`mt-3.5 max-w-2xl text-base sm:text-lg leading-relaxed text-brand-ink/80 ${
            isCentered ? 'mx-auto' : ''
          }`.trim()}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
