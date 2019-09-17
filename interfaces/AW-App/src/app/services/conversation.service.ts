import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private history: ConversationHistorySection[] = [];

  private conversation: ConversationSection[] = [];

  private sectionCompletedSource = new Subject<ConversationSection>();
  public sectionCompleted$ = this.sectionCompletedSource.asObservable();

  constructor() {
    console.log('ConversationService()');

    // get History from Storage:
    this.history = this.getHistory();

    if (this.hasHistory()) {
      // TODO: Replay/build conversation from history
    } else {
      this.startNewConversation();
    }
  }

  private getHistory() {
    // Define a hard-coded history (for now):
    const history = [
    ];


    return history;
  }

  private hasHistory() {
    return (this.history.length > 0);
  }

  startNewConversation() {
    this.addSection('login');
  }

  private addSection(sectionName) {
    console.log('ConverstaionService addSection(): ', sectionName);

    this.conversation.push({
      name: sectionName
    });
  }

  public onSectionCompleted(section: ConversationSection) {
    console.log('ConverstaionService  onSectionCompleted(): ', section);

    // Instruct PersonalPage to insert the next section
    this.sectionCompletedSource.next(section);
  }

  public getConversationUpToNow(): ConversationSection[] {
    return this.conversation;
  }
}

class ConversationHistorySection {
  readonly name: string;
  readonly data: any;
  readonly timestamp: number;
}

export class ConversationSection {
  name: string;
  data?: any;
  next?: string;
}