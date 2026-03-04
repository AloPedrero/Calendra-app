import { getEvent } from "@/server/actions/events";
import {
  addYears,
  eachMinuteOfInterval,
  endOfDay,
  roundToNearestMinutes,
} from "date-fns"
import { AlertTriangle } from "lucide-react";


export default async function BookingPage(
    {params}: {
        params: Promise<{ clerkUserId: string; eventId: string}>
    }) {
    const { clerkUserId, eventId} = await params

    //Fetch the event details from the database using the provided user and event ids
    const event = await getEvent(clerkUserId, eventId)
    if (!event) return(
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-center gap-2 text-sm max-w-md mx-auto mt-6">
        <AlertTriangle className="w-5 h-5" />
        <span>This event doesn't exist anymore.</span>
      </div>
    )

    // Define a date range from now (rounded up to the nearest 15 minutes) to 1 year later
    const startDate = roundToNearestMinutes(new Date(), {
      nearestTo: 15,
      roundingMethod: "ceil",
    })
    
    const endDate = endOfDay(addYears(startDate, 1)) // Set range to 1 year ahead

     // Generate valid available time slots for the event using the custom scheduler logic
    const validTimes = await getValidTimesFromSchedule(
        eachMinuteOfInterval({ start: startDate, end: endDate }, { step: 15 }), event)
    
}