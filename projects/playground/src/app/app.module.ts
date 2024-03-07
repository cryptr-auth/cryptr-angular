import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './pages/home/home.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthModule } from 'projects/cryptr/cryptr-angular/src/lib/auth.module';
import { AuthHttpInterceptor } from 'projects/cryptr/cryptr-angular/src/lib/auth.interceptor';
import { SidebarNavComponent } from './components/sidebar-nav/sidebar-nav.component';
import { NewsitemComponent } from './components/newsitem/newsitem.component';
import { NewsComponent } from './components/news/news.component';
import { FriendSuggestionComponent } from './components/friend-suggestion/friend-suggestion.component';
import { FriendSuggestionsComponent } from './components/friend-suggestions/friend-suggestions.component';
import { ArticleComponent } from './components/article/article.component';
import { ArticlesComponent } from './components/articles/articles.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    MyCoursesComponent,
    SidebarNavComponent,
    NewsitemComponent,
    NewsComponent,
    FriendSuggestionComponent,
    FriendSuggestionsComponent,
    ArticleComponent,
    ArticlesComponent,
  ],
  imports: [
    // CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot(environment.cryptrConfig),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
