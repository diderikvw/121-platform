import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CustomTranslateService } from 'src/app/services/custom-translate.service';

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss'],
})
export class SelectLanguageComponent implements OnInit {
  public languages: any;
  public languageChoice: number;
  public languageChoiceName: string;

  constructor(
    public storage: Storage,
    public customTranslateService: CustomTranslateService
  ) { }

  ngOnInit() {
    this.languages = [
      { id: 'en', language: this.customTranslateService.translate('personal.select-language.option1') },
      { id: 'la2', language: this.customTranslateService.translate('personal.select-language.option2') },
      { id: 'la3', language: this.customTranslateService.translate('personal.select-language.option3') },
    ];
  }

  public getLanguageName(languageId: string): string {
    const language = this.languages.find(item => {
      return item.id === languageId;
    });

    return language ? language.language : '';
  }

  private setLanguageChoiceName(languageChoice: string) {
    const languageId = languageChoice;

    this.languageChoiceName = this.getLanguageName(languageId);
  }

  private storeLanguage(languageChoice: any) {
    this.storage.set('languageChoice', languageChoice);
  }

  public changeLanguage($event) {
    const languageChoice = $event.detail.value;
    this.languageChoice = languageChoice;
    this.storeLanguage(languageChoice);
    this.setLanguageChoiceName(languageChoice);
  }



}