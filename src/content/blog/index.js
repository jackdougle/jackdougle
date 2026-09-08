/**
 * Blog post registry. Bodies are the markdown files in this directory,
 * ported from jackdouglass.substack.com.
 */
import biohardeningSupermarkets from "./biohardening-supermarkets.md?raw";
import makeAccomplishmentsLegible from "./make-your-accomplishments-publicly.md?raw";
import passionIsMalleable from "./passion-is-malleable-purpose-is-forever.md?raw";
import writingMoreAndBetter from "./writing-more-and-better.md?raw";

export const posts = [
  {
    slug: "writing-more-and-better",
    title: "Writing More and Better",
    subtitle: "An implicit promise to improve my blogging schedule",
    date: "2026-09-08",
    section: "Writing",
    cover: "/blog/writing-more-and-better-pixelated.png",
    substack: "https://jackdouglass.substack.com/p/writing-more-and-better",
    content: writingMoreAndBetter,
  },
  {
    slug: "biohardening-supermarkets",
    title: "Biohardening Supermarkets",
    subtitle: "A hypothesis for protecting a critical node of society",
    date: "2026-07-14",
    section: "Biosecurity",
    cover: "/blog/biohardening-supermarkets-pixelated.png",
    substack: "https://jackdouglass.substack.com/p/biohardening-supermarkets",
    content: biohardeningSupermarkets,
  },
  {
    slug: "make-your-accomplishments-publicly",
    title: "Make Your Accomplishments Publicly Legible",
    subtitle: "LinkedInmaxx",
    date: "2026-04-15",
    section: "Impact & Careers",
    cover: "/blog/make-your-accomplishments-publicly-pixelated.png",
    substack: "https://jackdouglass.substack.com/p/make-your-accomplishments-publicly",
    content: makeAccomplishmentsLegible,
  },
  {
    slug: "passion-is-malleable-purpose-is-forever",
    title: "Passion is Malleable, Purpose is Forever",
    subtitle: "Transmute impact into enjoyment",
    date: "2026-03-22",
    section: "Impact & Careers",
    cover: "/blog/passion-is-malleable-purpose-is-forever-pixelated.png",
    substack: "https://jackdouglass.substack.com/p/passion-is-malleable-purpose-is-forever",
    content: passionIsMalleable,
  },
].sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug) {
  return posts.find((p) => p.slug === slug);
}

/** "2026-07-14" -> "07.2026" */
export function formatDate(date) {
  const [y, m] = date.split("-");
  return `${m}.${y}`;
}
