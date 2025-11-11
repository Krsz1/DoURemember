interface ImportMetaEnv {
  readonly VITE_AUTH_API_URL: string;
  readonly VITE_MEDIA_API_URL: string;
  readonly VITE_NOTIFICATION_API_URL: string;
  readonly VITE_REPORT_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
