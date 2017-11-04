import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializePlayground, PlaygroundModule } from 'angular-playground';
import { CustomPlaygroundModule } from "./app/app.playground.module";

initializePlayground('app-root');
platformBrowserDynamic().bootstrapModule(CustomPlaygroundModule);
