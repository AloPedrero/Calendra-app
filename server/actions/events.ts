'use server'
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eventFormSchema } from "@/schema/events";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

 //marks this file as a server action

//this function creates a new event in the database after validating th input data

export async function createEvent(
    unsafeData: z.infer<typeof eventFormSchema>): Promise<void> {
    try {
        //Authenticate the user using Clerk
        const {userId} = await auth()
        //Validate the incoming data against the event form schema
        const {success, data} = eventFormSchema.safeParse(unsafeData)
        if (!success || !userId) {
            throw new Error ("Invaid event data or user not authenticated.")
        }

        //insert the validated event data into the database, linking it to the autenthicated user
        await db.insert(EventTable).values({...data, clerkUserId: userId})
        
    } catch (error: any) {
        //If any error ocurss during the process, thorw a message with the new wrror
        throw new Error (`Failed to create event: ${error.message || error}`)
    } finally {
        // Revalidate the '/events' path to ensure the page fetches fresh data after the database operation
       revalidatePath('/events')
    }
}

export async function updateEvent(
    id: string, //ID of the updating event
    unsafeData: z.infer<typeof eventFormSchema>): Promise<void> {
        try {
        // Authenticate the user
        const { userId } = await auth()
    
        // Validate the incoming data against the event form schema
        const { success, data } = eventFormSchema.safeParse(unsafeData)
    
        // If validation fails or the user is not authenticated, throw an error
        if (!success || !userId) {
            throw new Error("Invalid event data or user not authenticated.")
        }
    
        // Attempt to update the event in the database
        const { rowCount } = await db
            .update(EventTable)
            .set({ ...data }) // Update with validated data
            .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId))) // Ensure user owns the event
    
        // If no event was updated (either not found or not owned by the user), throw an error
        if (rowCount === 0) {
            throw new Error("Event not found or user not authorized to update this event.")
        }
    
        } catch (error: any) {
            //If any error ocurss during the process, thorw a message with the new wrror
            throw new Error (`Failed to create event: ${error.message || error}`)
        } finally {
            // Revalidate the '/events' path to ensure the page fetches fresh data after the database operation
        revalidatePath('/events')
        // Redirect the user to the events 
        redirect('/events')
        }
    }

export async function deleteEvent(
    id: string, //ID of the updating event
    ): Promise<void> {
        try {
            // Authenticate the user
            const { userId } = await auth()
    
            // Throw an error if no authenticated user
            if (!userId) {
            throw new Error("User not authenticated.")
            }
        
            // Attempt to delete the event only if it belongs to the authenticated user
            const { rowCount } = await db
            .delete(EventTable)
            .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)))
        
            // If no event was deleted (either not found or not owned by user), throw an error
            if (rowCount === 0) {
            throw new Error("Event not found or user not authorized to delete this event.")
        }
        } catch (error: any) {
            //If any error ocurss during the process, thorw a message with the new wrror
            throw new Error (`Failed to create event: ${error.message || error}`)
        } finally {
            // Revalidate the '/events' path to ensure the page fetches fresh data after the database operation
        revalidatePath('/events')
        }
    }
