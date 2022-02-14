import { Injectable } from '@angular/core';
import { Trade } from '../trade/trade.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment'
const BACKEND_URL = environment.apiUrl + "/trades"

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  private trades: Trade[] = [];
 
  private tradesUpdated = new Subject<Trade[]>();
  public err = new BehaviorSubject<any>(null);
  constructor(
    private http: HttpClient, private router: Router
  ) { }

  getPostUpdateListener() {
    return this.tradesUpdated.asObservable();
  }

  addPost(stockName: string, price: string, quantity: string, postDate: Date) {
    const postData = new FormData();
    postData.append("stockName", stockName);
    postData.append("price", price);
    postData.append("quantity", quantity);
    //postData.append("image", imgpath, title);
    postData.append("postDate", postDate.toString());
    this.http
      .post<{ message: string; trade: Trade }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        this.err.next(null)
        this.router.navigate(["/"]);


      }),
      err => {
        this.err.next(err)
      }
  }

  getPosts() {
    this.http.get<{ message: string; trades: any }>(BACKEND_URL)
      .pipe(
        map(postData => {
          return postData.trades.map(trade => {
            return {
              stockName: trade.stockName,
              price: trade.price,
              quantity: trade.quantity,
              id: trade._id,
              creator: trade.creator,
              postDate: trade.postDate
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.err.next(null)

        this.trades = transformedPosts;
        this.tradesUpdated.next([...this.trades]);
      },
        err => {
          this.err.next(err)
        });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string, stockName: string, price: string, quantity: string,
      creator: string,postDate:Date;
    }>(
      BACKEND_URL +"/" + id
    );
  }

  getMyPost(id: string) {
    this.http.get<{ message: string; trades: any }>(
      BACKEND_URL + "/mytrade"
    ).pipe(
      map(postData => {
        return postData.trades.map(trade => {
          return {
            stockName: trade.stockName,
            price: trade.price,
            quantity: trade.quantity,
            id: trade._id,
            creator: trade.creator,
            postDate: trade.postDate
          };
        });
      })
    )
      .subscribe(transformedPosts => {
        this.err.next(null)

        this.trades = transformedPosts;
        this.tradesUpdated.next([...this.trades]);
      },
        err => {
          this.err.next(err)
        });
  }


  updatePost(id: string, stockName: string, price: string, quantity: string) {
    let postData: Trade | FormData;
      postData = new FormData();
      postData.append("id", id);
      postData.append("stockName", stockName);
      postData.append("price", price);
      postData.append("quantity", quantity);

    this.http
      .put(BACKEND_URL + "/" +id, postData)
      .subscribe(response => {
        this.err.next(null)
        this.router.navigate(["/mytrades"]);
      },
        err => {
          this.err.next(err)
        });
  }

  deletePost(tradeId: string) {
    this.http
      .delete(BACKEND_URL +"/"+ tradeId)
      .subscribe((data) => {

        this.err.next(null)
        const updatedTrades = this.trades.filter(trade => trade.id !== tradeId);
        this.trades = updatedTrades;
        this.tradesUpdated.next([...this.trades]);
        this.router.navigate(["/"]);


      },
        e => {
          this.err.next(e)

        });

  }
}
