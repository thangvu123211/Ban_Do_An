import { App } from './app/app';
import { provideServerRendering } from '@angular/platform-server';
import { bootstrapApplication } from '@angular/platform-browser';

export default function bootstrap() {
  return bootstrapApplication(App, {
    providers: [
      provideServerRendering()
    ]
  });
}
