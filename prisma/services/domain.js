import prisma from '@/lib/db';
import subscriptionRules from '@/config/subscription-rules';
import { SubscriptionType } from '@prisma/client';

export const checkDomainLimit = async (userId, email, workspaceSlug) => {
  // Get user's subscription type (default to FREE for now)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      customerPayment: {
        select: { subscriptionType: true }
      }
    }
  });

  const subscriptionType = user?.customerPayment?.subscriptionType || SubscriptionType.FREE;
  const maxDomains = subscriptionRules[subscriptionType].customDomains;

  // Count current domains in workspace
  const workspace = await prisma.workspace.findFirst({
    select: { id: true },
    where: {
      OR: [
        { id: userId },
        {
          members: {
            some: {
              email,
              deletedAt: null,
            },
          },
        },
      ],
      AND: {
        deletedAt: null,
        slug: workspaceSlug,
      },
    },
  });

  if (!workspace) {
    throw new Error('Workspace not found');
  }

  const domainCount = await prisma.domain.count({
    where: {
      deletedAt: null,
      workspaceId: workspace.id,
    },
  });

  if (domainCount >= maxDomains) {
    throw new Error(`Domain limit reached. You can add up to ${maxDomains} domains with your current plan.`);
  }

  return { domainCount, maxDomains };
};

export const createDomain = async (
  id,
  email,
  slug,
  name,
  apexName,
  verified,
  verificationData
) => {
  // Check domain limit before creating
  await checkDomainLimit(id, email, slug);

  let subdomain = null;
  let verificationValue = null;

  if (!verified) {
    const { domain, value } = verificationData[0];
    subdomain = domain.replace(`.${apexName}`, '');
    verificationValue = value;
  }

  const workspace = await prisma.workspace.findFirst({
    select: { id: true },
    where: {
      OR: [
        { id },
        {
          members: {
            some: {
              email,
              deletedAt: null,
            },
          },
        },
      ],
      AND: {
        deletedAt: null,
        slug,
      },
    },
  });
  await prisma.domain.create({
    data: {
      addedById: id,
      name,
      subdomain,
      value: verificationValue,
      verified,
      workspaceId: workspace.id,
    },
  });
};

export const deleteDomain = async (id, email, slug, name) => {
  const workspace = await prisma.workspace.findFirst({
    select: { id: true },
    where: {
      OR: [
        { id },
        {
          members: {
            some: {
              email,
              deletedAt: null,
            },
          },
        },
      ],
      AND: {
        deletedAt: null,
        slug,
      },
    },
  });
  const domain = await prisma.domain.findFirst({
    select: { id: true },
    where: {
      deletedAt: null,
      name,
      workspaceId: workspace.id,
    },
  });
  await prisma.domain.update({
    data: { deletedAt: new Date() },
    where: { id: domain.id },
  });
};

export const getDomains = async (slug) =>
  await prisma.domain.findMany({
    select: {
      name: true,
      subdomain: true,
      verified: true,
      value: true,
    },
    where: {
      deletedAt: null,
      workspace: {
        deletedAt: null,
        slug,
      },
    },
  });

export { checkDomainLimit };

export const verifyDomain = async (id, email, slug, name, verified) => {
  const workspace = await prisma.workspace.findFirst({
    select: { id: true },
    where: {
      OR: [
        { id },
        {
          members: {
            some: {
              email,
              deletedAt: null,
            },
          },
        },
      ],
      AND: {
        deletedAt: null,
        slug,
      },
    },
  });
  const domain = await prisma.domain.findFirst({
    select: { id: true },
    where: {
      deletedAt: null,
      name,
      workspaceId: workspace.id,
    },
  });
  await prisma.domain.update({
    data: { verified },
    where: { id: domain.id },
  });
};
