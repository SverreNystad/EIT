import { cn } from "@/lib/utils";
import { Marquee } from "@/registry/magicui/marquee";

const reviews = [
    {
      name: "Ola Nordmann",
      username: "@ola",
      body: "Dette er helt utrolig! Har aldri sett noe lignende før. Elsker det.",
      img: "https://avatar.vercel.sh/ola",
    },
    {
      name: "Kari Nordmann",
      username: "@kari",
      body: "Jeg vet ikke hva jeg skal si. Dette er helt magisk.",
      img: "https://avatar.vercel.sh/kari",
    },
    {
      name: "Per Hansen",
      username: "@perh",
      body: "Ble helt målløs. Anbefaler på det varmeste!",
      img: "https://avatar.vercel.sh/perh",
    },
    {
      name: "Ingrid Dahl",
      username: "@ingrid",
      body: "Fantastisk løsning – gjør hverdagen mye enklere.",
      img: "https://avatar.vercel.sh/ingrid",
    },
    {
      name: "Thomas Berg",
      username: "@thomasb",
      body: "Veldig brukervennlig og effektivt. Kan ikke få fullrost det nok.",
      img: "https://avatar.vercel.sh/thomasb",
    },
    {
      name: "Maria Olsen",
      username: "@mariao",
      body: "Dette overgikk alle mine forventninger. Utrolig bra!",
      img: "https://avatar.vercel.sh/mariao",
    },
  ];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function Reviews() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:30s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
    
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
