import { App } from './app/app';
import { provideServerRendering } from '@angular/platform-server';
import { bootstrapApplication } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';
export default function bootstrap() {
  return bootstrapApplication(App, {
    providers: [
      provideServerRendering()
    ]
  });
}
