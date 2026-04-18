import EventForm from "@/components/forms/EventForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getEvent } from "@/server/actions/events";
import { auth } from "@clerk/nextjs/server";

//The deafult exported async function for the EditEventPage
export default async function EditEventPage({
  params, //Extracting the evenId from the URL params
}: {
  params: Promise<{ eventId: string }>;
}) {
  //Get the current authenticated user and. handle the redirect if the user is not logged in
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn(); //If there is no userId then redirect to sign in page

  const { eventId } = await params;
  // Fetch the event from the database using the eventId and the logged-in user's ID
  const event = await getEvent(userId, eventId);

  if (!event) return <h1>Event not found</h1>;
  //Render the page with a card layout, displaying the "Edit Event" from
  return (
    <Card className="max-w-md mx-auto border-4 border-blue-100 shadow-2xl shadow-accent-foreground">
      <CardHeader>
        <CardTitle>Edit Event</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Render the EventForm with the event details, passing the event data as props */}
        <EventForm
          event={{ ...event, description: event.description || undefined }} // If description is null, pass undefined
        />
      </CardContent>
    </Card>
  );
}
