import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddBookComponent } from './book/add-book/add-book.component';
import { EditBookComponent } from './book/edit-book/edit-book.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { LibraryComponent } from './book/library/library.component';
import { MyBookshelfComponent } from './book/my-bookshelf/my-bookshelf.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'library',
    component: LibraryComponent,
  },
  {
    path: 'my-bookshelf',
    component: MyBookshelfComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-book',
    component: AddBookComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:version',
    component: EditBookComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/login',
    component: LoginComponent,
  },
  {
    path: 'user/register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
