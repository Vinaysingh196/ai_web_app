import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatComponent } from './chat/chat.component';

import { CharacterSettingsComponent } from './character-settings/character-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    CharacterSettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}