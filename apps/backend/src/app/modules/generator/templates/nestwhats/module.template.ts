export const NestWhatsModuleTemplate = {
	path: "src/modules/nestwhats",
	name: "nestwhats.module.ts",
	content: `
    import { NestWhatsModule as NestWhatsModuleCore } from 'nestwhats';
    import { Module } from '@nestjs/common';
    import { NestWhatsService } from './nestwhats.service';

    @Module({
      imports: [
        NestWhatsModuleCore.forRoot({
          prefix: "!"
        })
      ],
      providers: [NestWhatsService]
    })
    export class AppModule {}
  `
};
