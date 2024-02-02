import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'modules/auth/auth.guard';
import { Session as SessionDecorator } from 'modules/auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';

import TeamsService from './teams.service';
import {
  UpdateTeamInput,
  TeamRequestIdBody,
  WorkspaceRequestIdBody,
} from './teams.interface';
import { Team } from '@prisma/client';

@Controller({
  version: '1',
  path: 'teams',
})
@ApiTags('Teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  @UseGuards(new AuthGuard())
  async getAllTeams(
    @SessionDecorator() session: SessionContainer,
    @Query() workspaceId: WorkspaceRequestIdBody
  ): Promise<Team[]> {
    const userId = session.getUserId();
    return await this.teamsService.getAllTeams(workspaceId, userId);
  }

  @Get(':teamId')
  @UseGuards(new AuthGuard())
  async getTeam(
    @Param()
    teamId: TeamRequestIdBody,
  ): Promise<Team> {
    return await this.teamsService.getTeam(teamId);
  }

  @Post(':teamId')
  @UseGuards(new AuthGuard())
  async updateTeam(
    @Param()
    teamId: TeamRequestIdBody,
    @Body() teamData: UpdateTeamInput,
  ): Promise<Team> {
    return await this.teamsService.updateTeam(
      teamId,
      teamData,
    );
  }

  @Delete(':teamId')
  @UseGuards(new AuthGuard())
  async deleteTeam(
    @Param()
    teamId: TeamRequestIdBody,
  ): Promise<Team> {
    return await this.teamsService.deleteTeam(
      teamId
    );
  }
}