import { Component } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBook, faHouse, faInfo, faList } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-rodape',
  standalone: false,
  templateUrl: './rodape.component.html',
  styleUrl: './rodape.component.css'
})
export class RodapeComponent {

  faHouse = faHouse; 
  faList= faList; 
  faBook = faBook; 
  faInfo = faInfo; 
  faGithub = faGithub; 
}
