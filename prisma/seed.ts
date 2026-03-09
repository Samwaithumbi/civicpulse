import {  Role, Status, Severity } from "@prisma/client";
import {prisma} from "@/lib/db";
import bcrypt from "bcryptjs";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function hoursAgo(hours: number) {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d;
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: "Pothole",      icon: "🕳",  color: "#8B5CF6" },
  { name: "Flooding",     icon: "🌊",  color: "#3B82F6" },
  { name: "Power Outage", icon: "⚡",  color: "#F59E0B" },
  { name: "Garbage",      icon: "🗑",  color: "#6B7280" },
  { name: "Crime",        icon: "🚨",  color: "#EF4444" },
  { name: "Water",        icon: "💧",  color: "#06B6D4" },
  { name: "Food",         icon: "🍞",  color: "#10B981" },
  { name: "Road",         icon: "🚧",  color: "#F97316" },
];

// ─── USERS ────────────────────────────────────────────────────────────────────

const USERS = [
  // Admin
  {
    id:    "user-admin-001",
    name:  "Admin User",
    email: "admin@civicpulse.co.ke",
    role:  Role.ADMIN,
  },
  // Responders
  {
    id:    "user-resp-001",
    name:  "Grace Wanjiru",
    email: "grace@civicpulse.co.ke",
    role:  Role.RESPONDER,
  },
  {
    id:    "user-resp-002",
    name:  "David Ochieng",
    email: "david@civicpulse.co.ke",
    role:  Role.RESPONDER,
  },
  // Citizens
  {
    id:    "user-cit-001",
    name:  "Samuel Kamau",
    email: "samuel@civicpulse.co.ke",
    role:  Role.CITIZEN,
  },
  {
    id:    "user-cit-002",
    name:  "Amina Hassan",
    email: "amina@civicpulse.co.ke",
    role:  Role.CITIZEN,
  },
  {
    id:    "user-cit-003",
    name:  "Peter Njoroge",
    email: "peter@civicpulse.co.ke",
    role:  Role.CITIZEN,
  },
  {
    id:    "user-cit-004",
    name:  "Fatuma Ali",
    email: "fatuma@civicpulse.co.ke",
    role:  Role.CITIZEN,
  },
  {
    id:    "user-cit-005",
    name:  "James Mwangi",
    email: "james@civicpulse.co.ke",
    role:  Role.CITIZEN,
  },
  {
    id:    "user-cit-006",
    name:  "Sarah Otieno",
    email: "sarah@civicpulse.co.ke",
    role:  Role.CITIZEN,
  },
  {
    id:    "user-cit-007",
    name:  "Brian Kipchoge",
    email: "brian@civicpulse.co.ke",
    role:  Role.CITIZEN,
  },
];

// ─── PROBLEMS ─────────────────────────────────────────────────────────────────
// Nairobi coordinates roughly: lat -1.28 to -1.35, lng 36.75 to 36.90

const PROBLEMS_DATA = [
  {
    id:          "prob-001",
    title:       "Large pothole on Ngong Road causing accidents",
    description: "A massive pothole approximately 1 meter wide and 40cm deep has developed on Ngong Road near the Shell petrol station. At least 3 boda boda riders have been injured this week alone. The pothole worsened significantly after the heavy rains last Monday. Vehicles are swerving dangerously to avoid it, causing near-misses. This needs urgent attention before someone is killed.",
    address:     "Ngong Road, near Shell Station, Nairobi",
    latitude:    -1.3042,
    longitude:   36.7522,
    status:      Status.IN_PROGRESS,
    severity:    Severity.HIGH,
    categoryKey: "Pothole",
    authorKey:   "user-cit-001",
    claimedKey:  "user-resp-001",
    createdAt:   daysAgo(3),
    images: [
      {
        url:      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        publicId: "civicpulse/prob-001-img-1",
        order:    0,
      },
    ],
  },
  {
    id:          "prob-002",
    title:       "Flash flooding blocks Mathare Valley road completely",
    description: "The main road through Mathare Valley has been completely submerged following yesterday's heavy rains. The water level is approximately knee-high and flowing rapidly. Over 200 families are cut off and cannot access their homes or get their children to school. The drainage system appears to be completely blocked with solid waste. We need emergency drainage clearing immediately.",
    address:     "Mathare Valley Road, Nairobi",
    latitude:    -1.2556,
    longitude:   36.8589,
    status:      Status.ACKNOWLEDGED,
    severity:    Severity.CRITICAL,
    categoryKey: "Flooding",
    authorKey:   "user-cit-002",
    claimedKey:  null,
    createdAt:   daysAgo(1),
    images: [
      {
        url:      "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80",
        publicId: "civicpulse/prob-002-img-1",
        order:    0,
      },
    ],
  },
  {
    id:          "prob-003",
    title:       "Power outage affecting 500+ households in Kibera for 3 days",
    description: "Over 500 households across 4 villages in Kibera have been without electricity for 72 hours. Kenya Power has been called over 30 times with no response. Families with refrigerators have lost all their food. Medical equipment for sick patients at home has stopped working. Small businesses that depend on electricity have been forced to close. Children cannot study at night. This is a crisis.",
    address:     "Kibera, Nairobi",
    latitude:    -1.3133,
    longitude:   36.7836,
    status:      Status.REPORTED,
    severity:    Severity.CRITICAL,
    categoryKey: "Power Outage",
    authorKey:   "user-cit-003",
    claimedKey:  null,
    createdAt:   daysAgo(3),
    images: [
      {
        url:      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
        publicId: "civicpulse/prob-003-img-1",
        order:    0,
      },
    ],
  },
  {
    id:          "prob-004",
    title:       "Uncollected garbage piling up near Gikomba Market for 2 weeks",
    description: "Garbage has not been collected near Gikomba Market for over two weeks. The pile is now over 3 meters high and blocking pedestrian walkways. The smell is unbearable and is affecting nearby food vendors. Rats and stray dogs are feeding on the waste. Health officials have not responded to multiple complaints. The situation is a serious public health hazard.",
    address:     "Gikomba Market, Nairobi",
    latitude:    -1.2833,
    longitude:   36.8456,
    status:      Status.REPORTED,
    severity:    Severity.MEDIUM,
    categoryKey: "Garbage",
    authorKey:   "user-cit-004",
    claimedKey:  null,
    createdAt:   daysAgo(5),
    images: [
      {
        url:      "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&q=80",
        publicId: "civicpulse/prob-004-img-1",
        order:    0,
      },
    ],
  },
  {
    id:          "prob-005",
    title:       "Broken water main leaking on Westlands Road",
    description: "A major water main has burst on Westlands Road near Sarit Centre. Water has been gushing for 5 days flooding the road and causing a large sinkhole to form. Traffic is severely affected and the sinkhole is growing. The water wastage during a period of shortage is unacceptable. Nairobi Water has been notified but has not responded.",
    address:     "Westlands Road, near Sarit Centre, Nairobi",
    latitude:    -1.2634,
    longitude:   36.8042,
    status:      Status.RESOLVED,
    severity:    Severity.HIGH,
    categoryKey: "Water",
    authorKey:   "user-cit-005",
    claimedKey:  "user-resp-002",
    createdAt:   daysAgo(7),
    images: [
      {
        url:      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
        publicId: "civicpulse/prob-005-img-1",
        order:    0,
      },
    ],
  },
  {
    id:          "prob-006",
    title:       "Food shortage affecting 200+ families in Mukuru Kwa Njenga",
    description: "Following the recent flooding, over 200 families in Mukuru Kwa Njenga have been displaced and are without food. Many lost all their household belongings. Children are going to school hungry. Local organizations are overwhelmed. We urgently need food aid distribution, clean water, and basic supplies. Please share this widely so we can get help to these families.",
    address:     "Mukuru Kwa Njenga, Nairobi",
    latitude:    -1.3021,
    longitude:   36.8743,
    status:      Status.IN_PROGRESS,
    severity:    Severity.CRITICAL,
    categoryKey: "Food",
    authorKey:   "user-cit-006",
    claimedKey:  "user-resp-001",
    createdAt:   daysAgo(2),
    images: [
      {
        url:      "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=800&q=80",
        publicId: "civicpulse/prob-006-img-1",
        order:    0,
      },
    ],
  },
  {
    id:          "prob-007",
    title:       "Road collapse on Lang'ata Road near Wilson Airport",
    description: "A section of Lang'ata Road near Wilson Airport has completely collapsed, exposing underground pipes. The collapse is approximately 4 meters wide and 2 meters deep. One vehicle has already partially fallen in. Police have set up makeshift barriers but the area is extremely dangerous, especially at night. Urgent repair or at minimum proper barricading is needed immediately.",
    address:     "Lang'ata Road, near Wilson Airport, Nairobi",
    latitude:    -1.3234,
    longitude:   36.7456,
    status:      Status.ACKNOWLEDGED,
    severity:    Severity.CRITICAL,
    categoryKey: "Road",
    authorKey:   "user-cit-007",
    claimedKey:  "user-resp-002",
    createdAt:   hoursAgo(18),
    images: [
      {
        url:      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
        publicId: "civicpulse/prob-007-img-1",
        order:    0,
      },
    ],
  },
  {
    id:          "prob-008",
    title:       "Street lighting out across entire Industrial Area for a month",
    description: "All street lights along the 3km stretch of Lusaka Road in the Industrial Area have been out for over a month. The area has seen a sharp increase in robberies and muggings after dark. Workers finishing late shifts are afraid to walk to bus stops. Several incidents have already been reported to police. The Kenya Power fault number has been called with no resolution.",
    address:     "Lusaka Road, Industrial Area, Nairobi",
    latitude:    -1.3089,
    longitude:   36.8312,
    status:      Status.REPORTED,
    severity:    Severity.HIGH,
    categoryKey: "Crime",
    authorKey:   "user-cit-001",
    claimedKey:  null,
    createdAt:   daysAgo(10),
    images: [
      {
        url:      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80",
        publicId: "civicpulse/prob-008-img-1",
        order:    0,
      },
    ],
  },
  {
    id:          "prob-009",
    title:       "Sewage overflow onto residential streets in Eastleigh",
    description: "Raw sewage has been overflowing onto residential streets in Eastleigh Section 2 for the past week. The sewage is running into homes and mixing with drinking water sources. Three children have already been taken to hospital with suspected cholera symptoms. The smell is overpowering. This is a serious public health emergency that requires immediate response.",
    address:     "Eastleigh Section 2, Nairobi",
    latitude:    -1.2745,
    longitude:   36.8534,
    status:      Status.IN_PROGRESS,
    severity:    Severity.CRITICAL,
    categoryKey: "Water",
    authorKey:   "user-cit-002",
    claimedKey:  "user-resp-001",
    createdAt:   daysAgo(4),
    images: [
      {
        url:      "https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&q=80",
        publicId: "civicpulse/prob-009-img-1",
        order:    0,
      },
    ],
  },
  {
    id:          "prob-010",
    title:       "Illegal garbage dumping destroying Karura Forest entrance",
    description: "Unknown individuals have been illegally dumping construction waste and household garbage at the Karura Forest main entrance on Limuru Road. The dump is growing daily and blocking part of the road. It is damaging the forest ecosystem and discouraging visitors. NEMA and the Kenya Forest Service have been notified but no action has been taken in 3 weeks.",
    address:     "Karura Forest, Limuru Road, Nairobi",
    latitude:    -1.2234,
    longitude:   36.8123,
    status:      Status.REPORTED,
    severity:    Severity.MEDIUM,
    categoryKey: "Garbage",
    authorKey:   "user-cit-003",
    claimedKey:  null,
    createdAt:   daysAgo(6),
    images: [
      {
        url:      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80",
        publicId: "civicpulse/prob-010-img-1",
        order:    0,
      },
    ],
  },
];

// ─── COMMENTS DATA ────────────────────────────────────────────────────────────

const COMMENTS_DATA: Record<string, Array<{
  content: string;
  authorKey: string;
  isOfficial: boolean;
  createdAt: Date;
}>> = {
  "prob-001": [
    {
      content:    "I've reported this pothole three times to the county. Each time I'm told it will be fixed 'next week.' It's been 6 weeks. A boda boda rider fell yesterday and needed stitches.",
      authorKey:  "user-cit-001",
      isOfficial: false,
      createdAt:  hoursAgo(48),
    },
    {
      content:    "We've received this report and logged it as high priority. An inspection team will be deployed within 24 hours. Thank you for reporting.",
      authorKey:  "user-resp-001",
      isOfficial: true,
      createdAt:  hoursAgo(36),
    },
    {
      content:    "The pothole is approximately 40cm deep and 1m wide. I've placed a traffic cone on it but people keep knocking it over. Please come quickly.",
      authorKey:  "user-cit-005",
      isOfficial: false,
      createdAt:  hoursAgo(24),
    },
    {
      content:    "Update: Our repair crew has assessed the site. Materials have been ordered and repair is scheduled for Thursday 8am. We apologize for the delay.",
      authorKey:  "user-resp-001",
      isOfficial: true,
      createdAt:  hoursAgo(12),
    },
    {
      content:    "Thursday came and went. No crew showed up. What is happening? This is completely unacceptable.",
      authorKey:  "user-cit-001",
      isOfficial: false,
      createdAt:  hoursAgo(6),
    },
  ],
  "prob-002": [
    {
      content:    "The flooding is so bad my children missed school today. We cannot wade through that water. It is not safe.",
      authorKey:  "user-cit-002",
      isOfficial: false,
      createdAt:  hoursAgo(20),
    },
    {
      content:    "Same issue every rainy season for 5 years. The drainage has never been properly maintained. When will this be fixed permanently?",
      authorKey:  "user-cit-004",
      isOfficial: false,
      createdAt:  hoursAgo(15),
    },
    {
      content:    "We have acknowledged this issue and a drainage team has been assigned. We expect to have the main blockage cleared within 48 hours.",
      authorKey:  "user-resp-002",
      isOfficial: true,
      createdAt:  hoursAgo(10),
    },
  ],
  "prob-003": [
    {
      content:    "My mother is diabetic and her insulin needs refrigeration. Three days without power means her medication is now compromised. This is a life-threatening situation.",
      authorKey:  "user-cit-006",
      isOfficial: false,
      createdAt:  hoursAgo(60),
    },
    {
      content:    "I run a small salon and have lost over KES 15,000 in business because of this outage. Kenya Power must compensate us.",
      authorKey:  "user-cit-007",
      isOfficial: false,
      createdAt:  hoursAgo(48),
    },
    {
      content:    "Called Kenya Power fault line again. They said 'engineers are working on it.' No ETA given. This is the 12th time I've called.",
      authorKey:  "user-cit-003",
      isOfficial: false,
      createdAt:  hoursAgo(24),
    },
  ],
  "prob-005": [
    {
      content:    "Finally someone reported this! The sinkhole has been growing for days. A matatu almost fell in yesterday morning.",
      authorKey:  "user-cit-007",
      isOfficial: false,
      createdAt:  daysAgo(6),
    },
    {
      content:    "We have claimed this issue and our team has assessed the damage. Emergency repair works have begun. The road will be barricaded until work is complete.",
      authorKey:  "user-resp-002",
      isOfficial: true,
      createdAt:  daysAgo(5),
    },
    {
      content:    "Repair works completed. The water main has been fixed and the road surface restored. Thank you for your patience.",
      authorKey:  "user-resp-002",
      isOfficial: true,
      createdAt:  daysAgo(1),
    },
  ],
};

// ─── STATUS UPDATES DATA ──────────────────────────────────────────────────────

const UPDATES_DATA: Record<string, Array<{
  message: string;
  status: Status;
  authorKey: string;
  createdAt: Date;
}>> = {
  "prob-001": [
    {
      message:   "Problem reported by citizen. Logged and assigned for inspection.",
      status:    Status.REPORTED,
      authorKey: "user-cit-001",
      createdAt: daysAgo(3),
    },
    {
      message:   "Issue acknowledged. Inspection team assigned. Scheduled for Thursday repair.",
      status:    Status.ACKNOWLEDGED,
      authorKey: "user-resp-001",
      createdAt: daysAgo(2),
    },
    {
      message:   "Repair crew on site. Materials delivered. Work in progress.",
      status:    Status.IN_PROGRESS,
      authorKey: "user-resp-001",
      createdAt: daysAgo(1),
    },
  ],
  "prob-002": [
    {
      message:   "Flooding reported. Emergency drainage team notified.",
      status:    Status.REPORTED,
      authorKey: "user-cit-002",
      createdAt: daysAgo(1),
    },
    {
      message:   "Acknowledged. Drainage team assigned, expected on site within 48 hours.",
      status:    Status.ACKNOWLEDGED,
      authorKey: "user-resp-002",
      createdAt: hoursAgo(10),
    },
  ],
  "prob-005": [
    {
      message:   "Water main burst reported. Emergency response initiated.",
      status:    Status.REPORTED,
      authorKey: "user-cit-005",
      createdAt: daysAgo(7),
    },
    {
      message:   "Issue claimed. Emergency assessment completed. Repair materials ordered.",
      status:    Status.ACKNOWLEDGED,
      authorKey: "user-resp-002",
      createdAt: daysAgo(6),
    },
    {
      message:   "Repair works underway. Road barricaded for safety. Estimated completion: 2 days.",
      status:    Status.IN_PROGRESS,
      authorKey: "user-resp-002",
      createdAt: daysAgo(4),
    },
    {
      message:   "All repair works completed. Water main fixed, road surface restored. Issue resolved.",
      status:    Status.RESOLVED,
      authorKey: "user-resp-002",
      createdAt: daysAgo(1),
    },
  ],
  "prob-006": [
    {
      message:   "Food shortage emergency reported. Flagged as critical.",
      status:    Status.REPORTED,
      authorKey: "user-cit-006",
      createdAt: daysAgo(2),
    },
    {
      message:   "Claimed. Coordinating with Red Cross and county food relief program. Distribution planned for tomorrow.",
      status:    Status.IN_PROGRESS,
      authorKey: "user-resp-001",
      createdAt: daysAgo(1),
    },
  ],
};

// ─── MAIN SEED FUNCTION ───────────────────────────────────────────────────────

async function main() {
  console.log("\n🌱 Starting CivicPulse database seed...\n");

  // ── 1. Categories ──────────────────────────────────────────────────────────
  console.log("📂 Seeding categories...");
  const categoryMap: Record<string, number> = {};

  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where:  { name: cat.name },
      update: { icon: cat.icon, color: cat.color },
      create: cat,
    });
    categoryMap[cat.name] = created.id;
  }
  console.log(`   ✅ ${CATEGORIES.length} categories seeded`);

  // ── 2. Users ───────────────────────────────────────────────────────────────
  console.log("👤 Seeding users...");
  const hashedPassword = await bcrypt.hash("password123", 12);
  const userMap: Record<string, string> = {};

  for (const user of USERS) {
    const created = await prisma.user.upsert({
      where:  { email: user.email },
      update: { name: user.name, role: user.role },
      create: {
        id:       user.id,
        name:     user.name,
        email:    user.email,
        password: hashedPassword,
        role:     user.role,
      },
    });
    userMap[user.id] = created.id;
  }
  console.log(`   ✅ ${USERS.length} users seeded`);

  // ── 3. Problems ────────────────────────────────────────────────────────────
  console.log("🚨 Seeding problems...");

  for (const prob of PROBLEMS_DATA) {
    const { images, categoryKey, authorKey, claimedKey, createdAt, ...rest } = prob;

    await prisma.problem.upsert({
      where:  { id: prob.id },
      update: {},
      create: {
        ...rest,
        categoryId:  categoryMap[categoryKey],
        authorId:    userMap[authorKey],
        claimedById: claimedKey ? userMap[claimedKey] : null,
        createdAt,
        updatedAt:   createdAt,
        images: {
          create: images.map((img) => ({
            url:      img.url,
            publicId: img.publicId,
            order:    img.order,
          })),
        },
      },
    });
  }
  console.log(`   ✅ ${PROBLEMS_DATA.length} problems seeded`);

  // ── 4. Comments ────────────────────────────────────────────────────────────
  console.log("💬 Seeding comments...");
  let totalComments = 0;

  for (const [problemId, comments] of Object.entries(COMMENTS_DATA)) {
    for (const comment of comments) {
      await prisma.comment.create({
        data: {
          content:    comment.content,
          isOfficial: comment.isOfficial,
          problemId,
          userId:     userMap[comment.authorKey],
          createdAt:  comment.createdAt,
          updatedAt:  comment.createdAt,
        },
      });
      totalComments++;
    }
  }
  console.log(`   ✅ ${totalComments} comments seeded`);

  // ── 5. Status Updates ──────────────────────────────────────────────────────
  console.log("📋 Seeding status updates...");
  let totalUpdates = 0;

  for (const [problemId, updates] of Object.entries(UPDATES_DATA)) {
    for (const update of updates) {
      await prisma.update.create({
        data: {
          message:   update.message,
          status:    update.status,
          problemId,
          authorId:  userMap[update.authorKey],
          createdAt: update.createdAt,
        },
      });
      totalUpdates++;
    }
  }
  console.log(`   ✅ ${totalUpdates} status updates seeded`);

  // ── 6. Votes ───────────────────────────────────────────────────────────────
  console.log("▲  Seeding votes...");

  // Voting patterns — realistic distribution
  const votingPatterns: Record<string, string[]> = {
    "prob-001": ["user-cit-002", "user-cit-003", "user-cit-004", "user-cit-005", "user-cit-006", "user-cit-007", "user-resp-001"],
    "prob-002": ["user-cit-001", "user-cit-003", "user-cit-004", "user-cit-005", "user-resp-002"],
    "prob-003": ["user-cit-001", "user-cit-002", "user-cit-004", "user-cit-005", "user-cit-006", "user-cit-007", "user-resp-001", "user-resp-002", "user-admin-001"],
    "prob-004": ["user-cit-001", "user-cit-002", "user-cit-003"],
    "prob-005": ["user-cit-002", "user-cit-003", "user-cit-006", "user-resp-001"],
    "prob-006": ["user-cit-001", "user-cit-002", "user-cit-003", "user-cit-004", "user-cit-005", "user-cit-007", "user-resp-001", "user-resp-002", "user-admin-001"],
    "prob-007": ["user-cit-001", "user-cit-002", "user-cit-003", "user-cit-004", "user-cit-005", "user-resp-001"],
    "prob-008": ["user-cit-002", "user-cit-004", "user-cit-006"],
    "prob-009": ["user-cit-001", "user-cit-003", "user-cit-004", "user-cit-005", "user-cit-007", "user-resp-001", "user-resp-002"],
    "prob-010": ["user-cit-001", "user-cit-006"],
  };

  let totalVotes = 0;

  for (const [problemId, voterKeys] of Object.entries(votingPatterns)) {
    for (const voterKey of voterKeys) {
      await prisma.vote.createMany({
        skipDuplicates: true,
        data: [{
          userId:    userMap[voterKey],
          problemId,
          createdAt: daysAgo(randomBetween(0, 3)),
        }],
      });
      totalVotes++;
    }
  }
  console.log(`   ✅ ${totalVotes} votes seeded`);

  // ── 7. Summary ─────────────────────────────────────────────────────────────
  console.log("\n✨ Seed complete!\n");
  console.log("─────────────────────────────────────────");
  console.log("  Categories  :", CATEGORIES.length);
  console.log("  Users       :", USERS.length);
  console.log("  Problems    :", PROBLEMS_DATA.length);
  console.log("  Comments    :", totalComments);
  console.log("  Updates     :", totalUpdates);
  console.log("  Votes       :", totalVotes);
  console.log("─────────────────────────────────────────");
  console.log("\n📧 Test accounts (all use password: password123)\n");
  console.log("  ADMIN      admin@civicpulse.co.ke");
  console.log("  RESPONDER  grace@civicpulse.co.ke");
  console.log("  RESPONDER  david@civicpulse.co.ke");
  console.log("  CITIZEN    samuel@civicpulse.co.ke");
  console.log("  CITIZEN    amina@civicpulse.co.ke");
  console.log("─────────────────────────────────────────\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });