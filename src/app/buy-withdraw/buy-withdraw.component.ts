import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ContractService } from '../contract.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-buy-withdraw',
  templateUrl: './buy-withdraw.component.html',
  styleUrls: ['./buy-withdraw.component.css']
})
export class BuyWithdrawComponent implements OnInit {

  @Input() tabIndex: number;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();

  amount: string = "";
  usdcBalance: string = "";
  predepositBalance: string = "";

  loading: boolean = false;

  constructor(private contractService: ContractService, private apiService: ApiService) { }

  ngOnInit() {
    this.loading = true;
    this.load();
    this.loading = false;
  }

  async load() {
    if (this.contractService.address && this.contractService.usdcBalance) {
      this.usdcBalance = this.contractService.usdcBalance;

      const userInfo = await this.contractService.getUserInfo(this.contractService.address);
      if (this.tabIndex == 0) {
        this.predepositBalance = userInfo[0];
      } else {
        this.predepositBalance = userInfo[1];
      }
    }
  }

  max() {
    this.amount = this.predepositBalance;
  }

  getNumber(x) {
    return parseFloat(x);
  }

  async withdraw() {
    this.loading = true;
    try {
      await this.contractService.withdraw(+this.amount, this.tabIndex==0);
      await this.load();
    } catch(e) {
    }
    this.loading = false;
    this.onRefresh.emit();
  }

  willDisableButton() {
    const buttonDisabled = (this.loading || !this.amount || !this.getNumber(this.amount) ||
      this.getNumber(this.amount) > this.getNumber(this.predepositBalance));
    return buttonDisabled;
  }

  close() {
    this.onClose.emit();
  }
}
