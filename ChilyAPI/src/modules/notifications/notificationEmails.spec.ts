import { Test, TestingModule } from "@nestjs/testing";
import { NotificationRegisterEmailsService } from "./notificationEmails.service";

describe("NotificationRegisterEmailsService", () => {
  let service: NotificationRegisterEmailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationRegisterEmailsService],
    }).compile();

    service = module.get<NotificationRegisterEmailsService>(
      NotificationRegisterEmailsService,
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
