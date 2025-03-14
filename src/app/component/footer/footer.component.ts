import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {

  rootImg: string = "assets/images/logo/";
  hoverImg: string = "-gold";
  extensionImg: string = ".svg";

  partnersData:any;
  url: string = "../../../assets/data/official-partners-list.json";

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get(this.url).subscribe(data => {
      this.partnersData = data;
    });
  }

  fctMouseOver(event: any, name:string) : void {
    event.srcElement.src = event.srcElement.src.replace(name, name + "-gold");
  }
 
  fctMouseOut(event: any, name:string) : void {
    event.srcElement.src = event.srcElement.src.replace(name, "");
  }

}
