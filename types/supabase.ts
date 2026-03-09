export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      entities: { Row: Record<string, Json>; Insert: Record<string, Json>; Update: Record<string, Json> };
      reviews: { Row: Record<string, Json>; Insert: Record<string, Json>; Update: Record<string, Json> };
    };
  };
}
