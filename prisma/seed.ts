import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const recruiter = await db.user.upsert({
    where: { email: "recruiter@devhire.dev" },
    update: {},
    create: {
      name: "Acme Recruiting",
      email: "recruiter@devhire.dev",
      password: await bcrypt.hash("password123", 12),
      role: "RECRUITER",
    },
  });

  const seeker = await db.user.upsert({
    where: { email: "dev@devhire.dev" },
    update: {},
    create: {
      name: "Jane Developer",
      email: "dev@devhire.dev",
      password: await bcrypt.hash("password123", 12),
      role: "SEEKER",
      skills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    },
  });

  const jobs = [
    { title: "Senior Full Stack Engineer", company: "Acme Corp", location: "San Francisco", type: "FULL_TIME" as const, salaryMin: 140000, salaryMax: 180000, stack: ["React","Node.js","PostgreSQL","TypeScript"], remote: true, featured: true, description: "Join our product team building the next generation of developer tools.", requirements: ["5+ years full stack experience","Strong TypeScript skills","PostgreSQL experience"], benefits: ["Unlimited PTO","Health insurance","$500/mo home office stipend"] },
    { title: "Frontend Engineer", company: "StartupXYZ", location: "Remote", type: "REMOTE" as const, salaryMin: 110000, salaryMax: 140000, stack: ["React","Next.js","Tailwind CSS","TypeScript"], remote: true, featured: false, description: "Build beautiful, performant UIs for our SaaS platform.", requirements: ["3+ years React experience","Next.js App Router knowledge","Eye for design"], benefits: ["Remote-first","Flexible hours","Equity package"] },
    { title: "Backend Engineer", company: "FinTech Inc", location: "New York", type: "FULL_TIME" as const, salaryMin: 130000, salaryMax: 160000, stack: ["Node.js","Express","MongoDB","Redis","Docker"], remote: false, featured: true, description: "Design and build APIs that process millions of transactions daily.", requirements: ["4+ years backend experience","Experience with high-throughput systems","Security-first mindset"], benefits: ["401k matching","Medical/dental/vision","Annual bonus"] },
  ];

  for (const job of jobs) {
    await db.job.create({ data: { ...job, recruiterId: recruiter.id } });
  }

  console.log(`Seeded ${jobs.length} jobs, 1 recruiter, 1 seeker`);
}

main().catch(console.error).finally(() => db.$disconnect());
