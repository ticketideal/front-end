import { api } from "@/lib/axios";

export interface LoginDto {
  email: string;
  password: string;
}

export interface ResetPasswordRequestDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export class AuthService {
  private static getUrl(path = "") {
    return `${path}`;
  }

  static async login(data: LoginDto) {
    console.log(data);
    const response = await api.post(this.getUrl('/login'), data);
    return response.data;
  }

  static async requestResetPassword(data: ResetPasswordRequestDto) {
    const response = await api.post(this.getUrl('/request-reset-password'), data);
    return response.data;
  }

  static async resetPassword(data: ResetPasswordDto) {
    const response = await api.post(this.getUrl('/reset-password'), data);
    return response.data;
  }
}
