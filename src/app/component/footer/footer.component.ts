import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['../../../scss/components/footer.scss'],
  imports: [CommonModule]
})
export class FooterComponent implements OnInit {

  rootImg: string = "assets/images/logo/";
  hoverImg: string = "-gold";
  extensionImg: string = ".svg";
  partnersData:any;
  url: string = "../../../assets/data/official-partners-list.json";

  constructor(private readonly http: HttpClient) {}

  ngOnInit() {
    this.http.get(this.url).subscribe(data => {
      this.partnersData = data;
    });
  }

  fctMouseOver(event: any, name:string) : void {
    event.target.src = event.target.src.replace(name, name + "-gold");
  }
 
  fctMouseOut(event: any, name:string) : void {
    event.target.src = event.target.src.replace(name, "");
  }

}
