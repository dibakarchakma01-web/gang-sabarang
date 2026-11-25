import { Clock, Trees, Utensils } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

const EXPERIENCE_PILLARS = [
  {
    index: '01.',
    title: 'Calm Dining Atmosphere',
    description:
      'Timber textures, natural ventilation, and warm lantern lighting create an inviting table setting without hurry.',
    icon: Utensils,
  },
  {
    index: '02.',
    title: 'Unhurried Pace',
    description:
      'Designed for guests who value uncrowded meals, thoughtful service, and quiet time together.',
    icon: Clock,
  },
  {
    index: '03.',
    title: 'Scenic Nature Connection',
    description:
      'Surrounded by hillside trees in Rangamati, every visit keeps the outdoors close at hand.',
    icon: Trees,
  },
] as const;

export function ExperienceSection() {
  return (
    <section
      aria-labelledby="experience-heading"
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <SectionHeading
        titleId="experience-heading"
        eyebrow="The Experience"
        title="Dine at the Rhythm of Rangamati"
        subtitle="Thoughtful spaces crafted for unhurried meals and quiet moments amid greenery."
        align="center"
      />

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {EXPERIENCE_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.index}
              className="rounded-xl border border-brand-primary/12 bg-white/75 p-7"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tabular-nums text-brand-secondary">
                  {pillar.index}
                </span>
                <Icon
                  className="h-5 w-5 text-brand-accent"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-brand-primary">
                {pillar.title}
              </h3>

              <p className="mt-2.5 text-base leading-relaxed text-brand-ink/75">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
