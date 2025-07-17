declare global {
  interface Window {
    Kakao: KakaoNamespace;
  }

  interface KakaoUser {
    id: number;
    connected_at: string;
    kakao_account?: {
      profile?: {
        nickname?: string;
        profile_image_url?: string;
        thumbnail_image_url?: string;
      };
      email?: string;
      age_range?: string;
      birthday?: string;
      gender?: string;
    };
    properties?: {
      nickname?: string;
      profile_image?: string;
      thumbnail_image?: string;
    };
  }

  interface KakaoNamespace {
    isInitialized(): boolean;
    init(apiKey: string): void;
    Auth: {
      login(options: { scope?: string; success(authObj: AuthResponse): void; fail?(err: KakaoError): void }): void;
      logout(callback?: () => void): void;
    };
    API: {
      request(options: { url: string; data?: object; success(res: KakaoUser): void; fail?(err: KakaoError): void }): void;
    };
  }

  interface AuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }

  interface KakaoError {
    error: string;
    error_description?: string;
  }
}

export {};
