import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Trade } from '../trade.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TradeService } from '../../services/trade.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-create-trade',
  templateUrl: './create-trade.component.html',
  styleUrls: ['./create-trade.component.css']
})
export class CreateTradeComponent implements OnInit {

  postdate: Date
  fetchedDate: Date
  form: FormGroup;
  isLoading: boolean = false
  imagePreview: string
  trade: Trade;
  private mode = "create";
  private tradeId: string;
  constructor(
    private ps: TradeService,
    public route: ActivatedRoute,
    public profileService:ProfileService  ,
    private router: Router,) { }

  ngOnInit(): void {
    this.checkProfileCreated()
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("tradeId")) {
        this.mode = "edit";
        this.tradeId = paramMap.get("tradeId");
        this.getPostById(this.tradeId)
      }
      else {
        this.mode = "create";
        this.tradeId = null;

      }
    })
    this.createForm()
  }

  getPostById(id) {
    this.isLoading=true
    this.ps.getPost(id).subscribe(tradeData => {
    
      this.trade = {
        id: tradeData._id,
        stockName: tradeData.stockName,
        price: tradeData.price,
        quantity: tradeData.quantity,
        creator: tradeData.creator
      };
      //this.imagePreview = postData.imagePath
      //console.log("imagepath",postData);
      
      this.form.setValue({
        stockName: this.trade.stockName,
        price: this.trade.price,
        quantity: this.trade.quantity
      });
      this.isLoading = false;
    });

  }

  createForm() {
    this.form = new FormGroup({
      stockName: new FormControl(null, {validators: [Validators.required]}),
      price: new FormControl(null, {validators: [Validators.required]}),
      quantity: new FormControl(null, {validators: [Validators.required]}),
      // image: new FormControl(null, {
      //   validators: [Validators.required],
      //   asyncValidators: [mimeType]
      // })
    });
  }

  // onImagePicked(event: Event) {
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.form.patchValue({ image: file });
  //   this.form.get("image").updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);
  // }

  onSavePost() {
    this.postdate = new Date()
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      //console.log(this.form.value);
      this.ps.addPost(this.form.value);
    }
    else {
      this.ps.updatePost(
        this.tradeId,
        this.form.value.stockName,
        this.form.value.price,
        this.form.value.quantity,
      );
    }
    this.form.reset();
  }

  checkProfileCreated(){
    this.profileService.getProfileByCreatorId().subscribe(profile => {
      if(!profile){
        this.router.navigate(["/profile"])
      }
    },e=>{
      this.router.navigate(["/profile"])
    })
  }

}
