const content = `
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getHello(): string {
    return 'Hello World!';
  }
}
`;

export const appServiceTemplate = {
	name: "app.service.ts",
	path: "src",
	content: content
};
