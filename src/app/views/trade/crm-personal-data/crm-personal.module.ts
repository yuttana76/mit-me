import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

// import { ChartJSComponent } from './chartjs.component';
// import { ChartJSRoutingModule } from './chartjs-routing.module';

import { BrowserModule } from '@angular/platform-browser';
// import { FullCalendarModule } from '@fullcalendar/angular';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';

// FullCalendarModule.registerPlugins([
//   dayGridPlugin,
//   interactionPlugin
// ])

// import { MzdTimelineModule } from 'ngx-rend-timeline';

@NgModule({
  imports: [
    BrowserModule,
    // MzdTimelineModule
  ],
})
export class CrmPersonalModule { }
