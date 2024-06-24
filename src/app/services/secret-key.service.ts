import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SecretKeyService {
  private secretKey: string;

  constructor() {
    this.secretKey = environment.secretKey || this.generateSecretKey();
  }

  getSecretKey(): string {
    return this.secretKey;
  }

  private generateSecretKey(): string {
    const key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64);
    console.warn('Generated Secret Key: ', key);
    return key;
  }
}
