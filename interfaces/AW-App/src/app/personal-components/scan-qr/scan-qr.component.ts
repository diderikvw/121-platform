import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonalComponent } from '../personal-components.interface';
import { ConversationService } from 'src/app/services/conversation.service';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.component.html',
  styleUrls: ['./scan-qr.component.scss'],
})
export class ScanQrComponent implements PersonalComponent {

  public did: string;
  public programId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public storage: Storage,
    public conversationService: ConversationService,
  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.did && params.programId) {
        this.did = JSON.parse(params.did);
        this.programId = JSON.parse(params.programId);
        this.storage.set('scannedDid', this.did);
        this.storage.set('scannedProgramId', this.programId);
        this.complete();
      }
    });
  }
  // {"did": "did:sov:AdzMb8sH6QTcLUv7hfVJAZ", "programId": 1}
  // {did: "did:sov:AdzMb8sH6QTcLUv7hfVJAZ", programId: 1}

  ngOnInit() { }

  public scanQrCode() {
    this.router.navigate(['/scan-qr']);
  }

  getNextSection() {
    return 'validate-identity';
  }

  complete() {
    this.conversationService.onSectionCompleted({
      name: 'main-menu',
      data: {
      },
      next: this.getNextSection(),
    });
  }

}