import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { SecretKeyService } from './secret-key.service';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private secretKey: string;

  constructor(private secretKeyService: SecretKeyService) {
    this.secretKey = this.secretKeyService.getSecretKey();
  }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, this.secretKey.trim());
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
