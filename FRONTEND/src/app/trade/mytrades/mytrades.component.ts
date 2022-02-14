import { Component, OnInit } from '@angular/core';
import { TradeService } from '../../services/trade.service';
import { Subscription } from 'rxjs';
import { Trade } from '../trade.model';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../profile/profile.model';

@Component({
  selector: 'app-mytrades',
  templateUrl: './mytrades.component.html',
  styleUrls: ['./mytrades.component.css']
})
export class MytradesComponent implements OnInit {

  trades: Trade[] = [];
  postbyUser: Profile[] = []
  isloading = false;
  error: any
  userId: string
  private postsSub: Subscription;
  constructor(private ps: TradeService, private authService: AuthService,
    private profileService: ProfileService) { }

  ngOnInit(): void {
    this.getErrors()
    this.isloading = true
    this.getMyPost()
    //console.log(this.getMyPost());
    
    this.postsSub = this.ps.getPostUpdateListener()
      .subscribe((trades: Trade[]) => {

        this.getPostUserbyCreatorId(trades)
        this.isloading = false;
        this.trades = trades;
      }, e => {
        this.isloading = false;
        this.error = e
      });
  }

  getPostUserbyCreatorId(trade: Trade[]) {
    let creatorId = []
    for (let i in trade) {
      creatorId.push(trade[i].creator)

    }

    let unique = [...new Set(creatorId)];
    for (let i in unique) {
      this.profileService.getPostUserByCreatorId(unique[i])
        .subscribe(user => {
          this.postbyUser.push(user.profile)
        })
    }

  }



  getErrors() {
    this.error = null
    this.ps.err.subscribe(err => {
      this.error = err
      this.isloading = false
    })
  }

  getMyPost() {
    this.ps.getMyPost(this.userId)
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
