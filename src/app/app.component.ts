import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  messages: { sender: string, text: string }[] = [];
  userInput = '';
  isLoading = false;

  async sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ sender: 'You', text: this.userInput });
    const prompt = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    const aiResponse = await this.fakeAIResponse(prompt);
    this.messages.push({ sender: 'Aira', text: aiResponse });
    this.isLoading = false;
  }

  async fakeAIResponse(prompt: string): Promise<string> {
    return new Promise((res) =>
      setTimeout(() => res(`You said: "${prompt}". I'm Aira! 😊`), 1500)
    );
  }
}
