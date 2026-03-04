/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const { PrismaClient, UserRole } = require('@prisma/client');

const prisma = new PrismaClient();

// idempotent seed: tekrar çalıştırınca patlamasın diye upsert + findFirst kullanıyoruz.
async function main() {
  const ADMIN_EMAIL = 'admin@yoldapp.local';
  const ADMIN_PASS = 'adminpass';

  const DRIVER_EMAIL = 'driver99@yoldapp.local';
  const DRIVER_PASS = 'driverpass';

  const PARENT1_EMAIL = 'anne.esra@yoldapp.local';
  const PARENT2_EMAIL = 'baba.yusuf@yoldapp.local';
  const PARENT_PASS = 'parentpass';

  const INSTITUTION_NAME = 'Yoldapp Test School';

  // hashes
  const adminHash = await bcrypt.hash(ADMIN_PASS, 10);
  const driverHash = await bcrypt.hash(DRIVER_PASS, 10);
  const parentHash = await bcrypt.hash(PARENT_PASS, 10);

  // 1) ADMIN user
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: UserRole.ADMIN, passwordHash: adminHash },
    create: { email: ADMIN_EMAIL, role: UserRole.ADMIN, passwordHash: adminHash },
    select: { id: true, email: true, role: true },
  });

  // 2) Institution (name unique değilse findFirst)
  let institution = await prisma.institution.findFirst({
    where: { name: INSTITUTION_NAME },
    select: { id: true, name: true },
  });
  if (!institution) {
    institution = await prisma.institution.create({
      data: { name: INSTITUTION_NAME },
      select: { id: true, name: true },
    });
  }

  // helper: create PARENT user + parentProfile idempotent
  async function upsertParent(email, fullName, phone) {
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: UserRole.PARENT, passwordHash: parentHash },
      create: { email, role: UserRole.PARENT, passwordHash: parentHash },
      select: { id: true, email: true },
    });

    const profile = await prisma.parentProfile.upsert({
      where: { userId: user.id },
      update: { institutionId: institution.id, fullName, phone },
      create: {
        userId: user.id,
        institutionId: institution.id,
        fullName,
        phone,
      },
      select: { id: true, userId: true, fullName: true },
    });

    return { user, profile };
  }

  const parent1 = await upsertParent(PARENT1_EMAIL, 'Esra Yılmaz', '5551111111');
  const parent2 = await upsertParent(PARENT2_EMAIL, 'Yusuf Yılmaz', '5552222222');

  // 4) Student (idempotent: aynı ad+soyad+institution varsa reuse)
  let student = await prisma.student.findFirst({
    where: {
      institutionId: institution.id,
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
    },
    select: { id: true, firstName: true, lastName: true },
  });

  if (!student) {
    student = await prisma.student.create({
      data: {
        institutionId: institution.id,
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
      },
      select: { id: true, firstName: true, lastName: true },
    });
  }

  // 5) Student <-> Parents link (createMany skipDuplicates yok çünkü PK var; tek tek upsert)
  await prisma.studentParent.upsert({
    where: { studentId_parentId: { studentId: student.id, parentId: parent1.profile.id } },
    update: {},
    create: { studentId: student.id, parentId: parent1.profile.id },
  });
  await prisma.studentParent.upsert({
    where: { studentId_parentId: { studentId: student.id, parentId: parent2.profile.id } },
    update: {},
    create: { studentId: student.id, parentId: parent2.profile.id },
  });

  // 6) DRIVER user + profile
  const driverUser = await prisma.user.upsert({
    where: { email: DRIVER_EMAIL },
    update: { role: UserRole.DRIVER, passwordHash: driverHash },
    create: { email: DRIVER_EMAIL, role: UserRole.DRIVER, passwordHash: driverHash },
    select: { id: true, email: true },
  });

  const driverProfile = await prisma.driverProfile.upsert({
    where: { userId: driverUser.id },
    update: { institutionId: institution.id, fullName: 'Test Driver', phone: '5554444444' },
    create: {
      userId: driverUser.id,
      institutionId: institution.id,
      fullName: 'Test Driver',
      phone: '5554444444',
    },
    select: { id: true, fullName: true, institutionId: true },
  });

  console.log('✅ SEED DONE');
  console.log({
    admin,
    institution,
    parent1: { parentProfileId: parent1.profile.id, email: parent1.user.email },
    parent2: { parentProfileId: parent2.profile.id, email: parent2.user.email },
    student,
    driver: { driverProfileId: driverProfile.id, email: driverUser.email },
    creds: {
      admin: { email: ADMIN_EMAIL, password: ADMIN_PASS },
      driver: { email: DRIVER_EMAIL, password: DRIVER_PASS },
      parent: { password: PARENT_PASS },
    },
  });
}

main()
  .catch((e) => {
    console.error('❌ SEED FAILED', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
