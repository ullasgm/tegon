/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { ActionType, SyncAction } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

export function convertToActionType(action: string): ActionType {
  switch (action.toLowerCase()) {
    case 'insert':
      return ActionType.I;
    case 'update':
      return ActionType.U;
    case 'delete':
      return ActionType.D;
  }

  return null;
}

export function convertLsnToInt(lsn: string) {
  const [logFileNumber, byteOffset] = lsn.split('/');
  const hexString = logFileNumber + byteOffset;
  return parseInt(hexString, 16);
}

export async function getWorkspaceId(
  prisma: PrismaService,
  modelName: string,
  modelId: string,
): Promise<string> {
  switch (modelName.toLocaleLowerCase()) {
    case 'workspace':
      return modelId;
    case 'team':
      const team = await prisma.team.findUnique({
        where: {
          id: modelId,
        },
      });
      return team.workspaceId;

    case 'teampreference':
      const teamPreference = await prisma.teamPreference.findUnique({
        where: {
          id: modelId,
        },
        include: {
          team: {
            include: {
              workspace: true,
            },
          },
        },
      });

      return teamPreference.team.workspaceId;

    default:
      return '';
  }
}

export async function getModelData(
  prisma: PrismaService,
  modelName: string,
  modelId: string,
) {
  switch (modelName.toLocaleLowerCase()) {
    case 'workspace':
      return await prisma.workspace.findUnique({
        where: {
          id: modelId,
        },
      });

    case 'team':
      return await prisma.team.findUnique({
        where: {
          id: modelId,
        },
      });
      
    case 'teampreference':
      return await prisma.teamPreference.findUnique({
        where: {
          id: modelId,
        },
      });
    default:
      return {};
  }
}

export async function getSyncActionsData(
  prisma: PrismaService,
  syncActionsData: SyncAction[],
) {
  return Promise.all(
    syncActionsData.map(async (actionData) => {
      const data = await getModelData(
        prisma,
        actionData.modelName,
        actionData.modelId,
      );
      return {
        data,
        ...actionData,
      };
    }),
  );
}

export async function getLastSequenceId(
  prisma: PrismaService,
  workspaceId: string,
): Promise<number> {
  const lastSyncAction = await prisma.syncAction.findFirst({
    where: {
      workspaceId,
    },
    orderBy: {
      sequenceId: 'desc',
    },
    distinct: ['modelName', 'workspaceId', 'modelId'],
  });

  return lastSyncAction.sequenceId;
}