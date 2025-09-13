import prisma from '@/lib/db';

export const getSiteWorkspace = async (slug, customDomain) =>
  await prisma.workspace.findFirst({
    select: {
      id: true,
      name: true,
      slug: true,
      domains: { select: { name: true } },
    },
    where: {
      OR: [
        { slug },
        customDomain
          ? {
            domains: {
              some: {
                name: slug,
                deletedAt: null,
              },
            },
          }
          : undefined,
      ],
      AND: { deletedAt: null },
    },
  });
