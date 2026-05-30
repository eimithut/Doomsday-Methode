import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/Button";
import { useI18n } from "../../lib/i18n";

export function Lesson1({ onComplete }: { onComplete: () => void }) {
  const { locale } = useI18n();
  const isDe = locale === 'de';

  return (
    <div className="space-y-6">
      <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
        {isDe ? (
          <>
            <p>
              Willkommen beim <strong className="text-white">Doomsday-Algorithmus</strong>! 
              Dieser mathematische Trick wurde von dem berühmten Mathematiker John Conway erfunden.
            </p>
            <p>
              Das Konzept basiert darauf, dass jedes Jahr einen bestimmten Wochentag hat – den sogenannten <strong>"Doomsday"</strong>. 
              Ausgewählte, leicht zu merkende Daten (die "Anker") fallen in jedem Monat exakt auf diesen Wochentag.
            </p>
            <p>
              Wenn du also weißt, dass der Doomsday eines Jahres ein Dienstag ist, weißt du auch sofort, 
              an welchen Tagen diese Ankerdaten liegen (nämlich auch an einem Dienstag). 
              Von dort aus ist es nur noch einfache Addition oder Subtraktion, um jedes beliebige Datum zu finden.
            </p>
          </>
        ) : (
          <>
            <p>
              Welcome to the <strong className="text-white">Doomsday Algorithm</strong>! 
              This mathematical trick was invented by the famous mathematician John Conway.
            </p>
            <p>
              The concept is based on the fact that every year has a specific day of the week — the so-called <strong>"Doomsday"</strong>. 
              Certain easy-to-remember dates (the "Anchors") fall exactly on this day of the week in every month.
            </p>
            <p>
              So if you know that the Doomsday of a given year is a Tuesday, you immediately know 
              that all these anchor dates also fall on a Tuesday. 
              From there, it's just simple addition or subtraction to find any given date.
            </p>
          </>
        )}
      </div>

      <div className="pt-6 border-t border-white/10 flex justify-end">
        <Button variant="success" onClick={onComplete}>
          {isDe ? 'Konzept verstanden!' : 'Got it!'}
        </Button>
      </div>
    </div>
  );
}
