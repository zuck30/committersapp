export const SEO_KEYWORDS = [
  "most active github users",
  "top github contributors",
  "best software engineers",
  "top ranked developers",
  "tech talent",
  "open source contributors",
  "software development leaders",
  "coding activity leaderboard",
  "top committers",
  "github ranking statistics",
  "top github profiles by country",
  "github user directory",
  "developer rankings worldwide",
  "git profile analytics",
  "top 100 open source contributors",
  "github contribution leaderboard",
  "hire remote developers",
  "top-rated software talent",
  "best programmers for hire",
  "local developer community ranking",
  "software engineering experts directory",
  "verified github developers list",
];

export const getDynamicDescription = (
  country: string,
  count: number,
  year: number,
) => {
  return `View the official ${year} rankings of the ${count} most active GitHub users in ${country}. 
  Explore top-ranked software engineers, tech talent, and open-source leaders. 
  Check verified contribution stats and find the best developers in ${country} today!`;
};
