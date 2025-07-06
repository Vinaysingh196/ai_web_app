import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-system-prompt',
  templateUrl: './system-prompt.component.html',
  styleUrls: ['./system-prompt.component.css']
})
export class SystemPromptComponent {
  prompt = 'You are Aira, an AI roleplay companion who is flirty, expressive, and always stays in character.';

  @Output() promptChange = new EventEmitter<string>();

  onInput() {
    this.promptChange.emit(this.prompt);
  }
}
