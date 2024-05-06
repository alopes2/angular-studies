import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/auth.interceptor';

@NgModule({
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
})
export class CoreModule {}
