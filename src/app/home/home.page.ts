import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController } from '@ionic/angular';

import { apiKey } from '../../tmdb';

export interface Movie {
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
}

interface TMDBReponse {
  results: Movie[];
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  movies: Promise<Movie[]>;

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly alert: AlertController,
    private readonly loader: LoadingController
  ) {
    this.getMovies('');
  }

  showDetails(movie: Movie): void {
    this.router.navigate(['/details'], { state: movie });
  }

  getMovies(search: string): void {
    const tooShort: boolean = search.length < 3;
    this.movies = tooShort ? Promise.resolve([]) : this.searchMovies(search);
  }

  async getRandomMovie(): Promise<void> {
    const movies: Movie[] = await this.discoverMovies();
    const movie: Movie = movies[Math.floor(Math.random() * movies.length)];

    const alert: HTMLIonAlertElement = await this.alert.create({
      header: movie.title,
      message: movie.overview,
      buttons: [
        { text: 'Cancel' },
        { text: 'Show details', handler: () => this.showDetails(movie) }
      ]
    });

    return alert.present();
  }

  private searchMovies(search: string): Promise<Movie[]> {
    return this.askTMDB('search', { query: search });
  }

  private discoverMovies(): Promise<Movie[]> {
    return this.askTMDB('discover', { primary_release_year: 2019 });
  }

  private async askTMDB(api: string, params: object): Promise<Movie[]> {
    const loader: HTMLIonLoadingElement = await this.loader.create();
    await loader.present();

    const { results } = await this.http.get<TMDBReponse>(
      `https://api.themoviedb.org/3/${api}/movie`,
      { params: { api_key: apiKey, ...params } }
    ).toPromise();

    await loader.dismiss();
    return results;
  }
}
