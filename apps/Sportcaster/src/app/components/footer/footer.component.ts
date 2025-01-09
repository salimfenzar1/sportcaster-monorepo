import { Component } from '@angular/core';

@Component({
    standalone:false,
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})


export class FooterComponent {
    currentYear = new Date().getFullYear();
}
