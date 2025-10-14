
import { parse, set } from "date-fns";
import type { SavedToken } from "@/components/booking-form";

export function isTokenExpired(token: SavedToken): boolean {
  // Time slots are like "08:00 - 09:00"
  const endTimeString = token.timeSlot.split(" - ")[1]; // "09:00"
  if (!endTimeString) return false;

  const now = new Date();

  // Parse the end time
  const [hours, minutes] = endTimeString.split(":").map(Number);
  
  // Create a Date object for the token's date with the slot's end time
  const tokenDate = new Date(token.date);
  const expiryDateTime = set(tokenDate, { hours, minutes, seconds: 0, milliseconds: 0 });

  return now > expiryDateTime;
}
