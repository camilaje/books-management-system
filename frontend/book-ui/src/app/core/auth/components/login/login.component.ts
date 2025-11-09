import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type LoginFormGroup = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loading: boolean;
  public error: string | null;
  public form: LoginFormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loading = false;
    this.error = null;

    this.form = this.fb.nonNullable.group({
      email: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.nonNullable.control('', {
        validators: [Validators.required],
      }),
    });
  }

  public submit(): void {
    if (this.form.invalid || this.loading) return;

    this.error = null;
    this.loading = true;

    const { email, password } = this.form.getRawValue();

    this.authService.login({ email, password }).subscribe({
      next: (res: { token: string }) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/books']);
      },
      error: (e: unknown) => {
        const errMsg = (e as any)?.error?.error ?? (e as any)?.message ?? 'Credenciales inválidas';
        this.error = String(errMsg);
        this.loading = false;
      },
    });
  }
}
