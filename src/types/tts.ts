/**
 * Google Text-to-Speech関連の型定義
 */

export interface GoogleTTSVoice {
  name: string;
  languageCodes: string[];
  ssmlGender: 'MALE' | 'FEMALE' | 'NEUTRAL';
  naturalSampleRateHertz: number;
}

export interface GoogleTTSVoicesResponse {
  voices: GoogleTTSVoice[];
}