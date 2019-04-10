import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Movie } from '../home/home.page';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage {
  movie: Movie;

  constructor(
    router: Router
  ) {
    this.movie = router.getCurrentNavigation().extras.state as Movie;
  }

  getImageUrl(image: string): string {
    return `https://image.tmdb.org/t/p/w780${image}`;
  }
}
