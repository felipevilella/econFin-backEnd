import {
  Controller,
  Get,
  Inject,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { AuthGuard } from "../auth/auth.guard";
import { RequestDTO } from "../auth/dto/auth.dto";

import { UseCaseProxy } from "src/infra/usecase-proxy/usecase-proxy";
import { UseCaseProxyModule } from "src/infra/usecase-proxy/usecase-proxy.module";
import { IResponsePanel, PanelService } from "./services/panel.service";

@Controller("panel")
export class PanelController {
  constructor(
    @Inject(UseCaseProxyModule.PANEL_SERVICE)
    private readonly PanelService: UseCaseProxy<PanelService>,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async panel(@Request() request: RequestDTO): Promise<IResponsePanel> {
    const { user } = request;

    return await this.PanelService.getInstance().execute(user);
  }
}
