export const gridItems: GridItem[] = [
  {
    id: "1",
    type: "image",
    content: "/images/collage/1.webp",
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: "2",
    type: "quote",
    content: `A new home for worship, discipleship, and transformation. The Equip-ACLA Building Project is more than a structure—it’s a beacon of faith. A place where generations will be equipped with spiritual nourishment, grounded in Scripture, and prepared to impact their communities and the world. This is the next step in God’s mission "From Here to the Nations."`,
    author: "The Vision – A Christ-Centered Future",
    colSpan: 2,
    rowSpan: 2,
    dark: true,
  },
  {
    id: "4",
    type: "image",
    content: "/images/collage/4.webp",
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: "5",
    type: "quote",
    content: `A Worship Center where believers mature in Christ, rooted in the Word.
A Discipleship Hub training a spiritually equipped army of Christ-followers.
A space dedicated to redeeming a generation—addressing their hunger for authentic spiritual food and building a Scripture-grounded, Christ-centered community.`,
    author:
      "Worship & Discipleship – Maturing in Christ, Impacting Generations",
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: "6",
    type: "image",
    content: "/images/collage/6.webp",
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: "7",
    type: "quote",
    content: `A welcoming space where children and youth can learn, grow, and thrive in their faith.

Recreational areas that foster joyful learning.

A library and classrooms designed for age-appropriate spiritual and personal development.

A discipleship-centered environment, ensuring the next generation is rooted in the Word of God and feels at home in the church community.
`,
    author: "Equipping the Next Generation – Youth & Children’s Facility",
    colSpan: 2,
    rowSpan: 2,
    dark: true,
  },

  {
    id: "3",
    type: "image",
    content: "/images/collage/3.webp",
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: "9",
    type: "quote",
    content: `A digital platform amplifying the message of Christ beyond borders.

Broadcasting the Gospel "From Here to the Nations."

Creating resources to disciple and equip believers worldwide.

Empowering a generation through multimedia, online outreach, and faith-driven storytelling.
Equip Media is the voice of this movement, bringing Christ-centered teachings to a global audience.`,
    author: "Equip Media – Spreading the Gospel Globally",
    colSpan: 2,
    rowSpan: 2,
  },
  {
    id: "8",
    type: "image",
    content: "/images/collage/8.webp",
    colSpan: 2,
    rowSpan: 2,
  },
];

export type GridItem = {
  id: string;
  type: string;
  content: string;
  colSpan: number;
  rowSpan: number;
  author?: string;
  dark?: boolean;
};
