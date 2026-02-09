export type StayCategory = "hostels" | "flats" | "homestays";

export type StayIntent = "short-stay" | "long-stay";

export interface StayType {
  category: StayCategory;
  intent: StayIntent;
}
