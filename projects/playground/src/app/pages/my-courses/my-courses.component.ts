import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '@cryptr/cryptr-angular';
import { environment } from 'projects/playground/src/environments/environment';
import { Course } from '../../interfaces';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit, OnChanges {
  courses: Course[];
  coursesError: string;
  tabIndex = 1;

  constructor(public auth: AuthService, public http: HttpClient) {
    console.log('my courses component');
  }

  setTabIndex(newIndex: number): void {
    this.tabIndex = newIndex;
  }

  tabClass(index: number): string {
    const activeClass = 'whitespace-no-wrap md:w-1/3 lg:w-auto ml-8 py-4 px-1 border-b-2 border-yellow-500 font-medium text-sm leading-5 text-gray-700 focus:outline-none focus:text-gray-900 focus:border-yellow-600';
    const notActiveClass = 'whitespace-no-wrap md:w-1/3 lg:w-auto ml-8 py-4 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300';
    return 'cursor-pointer ' + (this.tabIndex === index ? activeClass : notActiveClass);
  }

  ngOnChanges(changes: SimpleChanges): void { }

  securedRoute(): string {
    const { resource_server_url } = environment;
    return `${resource_server_url}/api/v1/courses`;
  }

  ngOnInit(): void {
    if (this.auth.currentAuthenticationState()) {
      this.fetchSecuredData();
    } else {
      this.coursesError = 'Vous n\'êtes pas authentifié';
    }
  }

  fetchSecuredData(): void {
    this.http
      .get(this.securedRoute())
      .subscribe((courses: [Course]) => {
        this.courses = courses;
      }, (error: HttpErrorResponse) => {
        console.error(error);
        this.coursesError = error.message;
      });
  }


  showFutureCourses(): boolean {
    return this.tabIndex === 1;
  }


  courseLabelStyle(course: Course): string {
    const courseDate = new Date(course.timestamp);
    const now = new Date();
    return courseDate < now ? 'line-through' : '';
  }

  tabCourses(): Course[] {
    if (this.courses === undefined || this.tabIndex === 0) {
      return this.courses;
    }
    const now = new Date();
    return this.courses.filter(course => {
      const courseDate = new Date(course.timestamp);
      return this.showFutureCourses() ? now < courseDate : now > courseDate;
    });
  }
}
