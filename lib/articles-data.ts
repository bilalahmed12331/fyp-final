export type Article = {
  slug: string;
  tag: string;
  title: string;
  read: number;
  excerpt: string;
  author: string;
  date: string;
  content: string[];
};

export const articles: Article[] = [
  {
    slug: "why-every-blood-donation-saves-up-to-3-lives",
    tag: "Donation",
    title: "Why Every Blood Donation Saves Up to 3 Lives",
    read: 4,
    excerpt:
      "One pint of blood is separated into red cells, plasma and platelets — each helping a different patient in need.",
    author: "Dr. Ayesha Khan",
    date: "June 12, 2026",
    content: [
      "A single unit of donated whole blood is rarely used as-is. At the blood bank, technicians spin and separate it into three life-saving components: red blood cells, plasma, and platelets. Each component is then matched to a different patient with very different needs.",
      "Red blood cells go to trauma victims, surgery patients, and people living with chronic anemia such as thalassemia. Plasma is used for burn victims and people with clotting disorders. Platelets are critical for cancer patients undergoing chemotherapy.",
      "That is why the World Health Organization estimates that one donation can save up to three lives. By giving 45 minutes of your time, you become part of three different recovery stories happening in three different hospital rooms.",
      "If you are healthy, between 17 and 65, and weigh at least 50 kg, you are very likely eligible. Schedule your donation through LifeLink and we will match you with the nearest verified blood bank.",
    ],
  },
  {
    slug: "iron-rich-foods-to-eat-before-donating-blood",
    tag: "Health",
    title: "Iron-Rich Foods to Eat Before Donating Blood",
    read: 5,
    excerpt:
      "Boost your hemoglobin naturally with spinach, lentils, red meat and citrus fruits before your next donation.",
    author: "Nutritionist Sara Malik",
    date: "May 28, 2026",
    content: [
      "Hemoglobin is the iron-rich protein that lets your blood carry oxygen — and it is the single biggest reason donors get deferred at the screening desk. Most blood banks require at least 12.5 g/dL for women and 13 g/dL for men.",
      "Heme iron from animal sources (red meat, liver, chicken, fish) is absorbed best. Non-heme iron from plants (spinach, lentils, chickpeas, tofu, pumpkin seeds, fortified cereals) is absorbed dramatically better when paired with vitamin C — think lemon on your daal, or oranges after lunch.",
      "Avoid tea, coffee and calcium-heavy dairy for an hour before and after iron-rich meals; they block absorption. Start preparing 1–2 weeks before your donation date for the best results.",
      "On the day itself: eat a full meal, drink 500 ml of water, and skip fatty foods which can interfere with blood testing.",
    ],
  },
  {
    slug: "understanding-blood-groups-and-compatibility",
    tag: "Awareness",
    title: "Understanding Blood Groups & Compatibility",
    read: 6,
    excerpt:
      "Learn why O-negative is the universal donor and AB-positive the universal recipient — and what it means for you.",
    author: "Dr. Hamza Sheikh",
    date: "May 14, 2026",
    content: [
      "There are eight common blood groups, formed by two systems: ABO (A, B, AB, O) and Rh (positive or negative). Your group is determined by tiny markers (antigens) on the surface of your red cells.",
      "O-negative blood has no A, B, or Rh antigens, so it can be transfused into almost anyone in an emergency — that is why it is called the universal donor and why hospitals always want more of it on the shelf.",
      "AB-positive recipients can accept red cells from any group, making them the universal recipient. But AB plasma is the universal plasma donor — the opposite direction.",
      "Knowing your group lets you respond fast in emergencies, both for yourself and your family. LifeLink stores your verified group on your donor card so matching takes seconds, not hours.",
    ],
  },
  {
    slug: "what-to-do-in-a-thalassemia-emergency",
    tag: "Emergency",
    title: "What To Do in a Thalassemia Emergency",
    read: 7,
    excerpt:
      "Quick-action steps for caregivers when a thalassemia patient needs an urgent transfusion.",
    author: "LifeLink Clinical Team",
    date: "April 30, 2026",
    content: [
      "Thalassemia patients depend on regular transfusions, usually every 2–4 weeks. A missed cycle, infection or sudden drop in hemoglobin can quickly escalate into a medical emergency.",
      "Warning signs to act on immediately: extreme fatigue, shortness of breath at rest, rapid heartbeat, paleness, fainting, or a hemoglobin reading under 7 g/dL.",
      "Step 1: call the patient's treating hematologist. Step 2: open LifeLink and post an Emergency Request with the patient's blood group and city — verified donors in a 10 km radius are notified instantly. Step 3: head to the nearest partner hospital while donors are being matched.",
      "Always keep a small kit ready at home: the patient's transfusion record, blood group card, recent CBC report, hospital MR number, and the LifeLink emergency contact list.",
    ],
  },
  {
    slug: "myths-vs-facts-about-donating-blood",
    tag: "Donation",
    title: "Myths vs Facts About Donating Blood",
    read: 3,
    excerpt:
      "Donating doesn't weaken you — your body replaces the lost volume within 24 hours. Here are 7 more myths debunked.",
    author: "LifeLink Editorial",
    date: "April 18, 2026",
    content: [
      "Myth 1: Donating blood makes you weak. Fact: your body replaces the plasma volume within 24 hours and the red cells within 4–6 weeks.",
      "Myth 2: You can catch a disease from donating. Fact: every needle and collection bag is sterile, single-use, and discarded immediately after.",
      "Myth 3: Vegetarians cannot donate. Fact: as long as your hemoglobin is in range, your diet does not matter.",
      "Myth 4: It is painful. Fact: most donors describe it as a brief pinch. The whole appointment takes about 45 minutes; the actual draw is 8–10 minutes.",
      "Myth 5: People with tattoos cannot donate. Fact: in most countries you only need to wait 3–6 months after a new tattoo from a licensed studio.",
      "Myth 6: Donating raises blood pressure. Fact: studies suggest regular donation is associated with slightly lower blood pressure over time.",
      "Myth 7: My blood group is common, so I am not needed. Fact: common groups are needed in the largest volumes — your donation is always used.",
    ],
  },
  {
    slug: "recovery-tips-after-donating-blood",
    tag: "Health",
    title: "Recovery Tips After Donating Blood",
    read: 4,
    excerpt:
      "Hydrate well, avoid heavy lifting for 24 hours and have a balanced meal. Full recovery happens within a day.",
    author: "Nurse Bilal Ahmed",
    date: "April 5, 2026",
    content: [
      "Right after the draw: stay seated for 10–15 minutes, accept the juice and biscuit, and keep the pressure bandage on for at least 4 hours.",
      "First 24 hours: drink an extra 500 ml of water beyond your normal intake, avoid alcohol and smoking, skip the gym and any heavy lifting on your donation arm.",
      "Eat a balanced meal with iron and protein — eggs, chicken, spinach, lentils, and a source of vitamin C to help absorption.",
      "If you feel dizzy, lie down with your feet elevated. If a bruise forms, apply a cold pack on day one and a warm compress from day two. Most donors feel completely normal within 24 hours.",
    ],
  },
];

export const getArticleBySlug = (slug: string) =>
  articles.find((a) => a.slug === slug);
