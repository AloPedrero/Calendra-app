// Formats a duration in minutes into a readable string like "1hr 30 mins"
export function formatEventDescription(durationInMinutes: number) : string {
    const hours = Math.floor(durationInMinutes / 60) //Get number of full hours
    const minutes = durationInMinutes % 60 // get remaining minutes after removing full hours

    //format minutes string (e.g., "1min" or "10 mins")
    const minutesString = `${minutes} ${minutes > 1 ? "mins" : "min"}`
    //format minutes string (e.g., "1min" or "10 mins")
    const hoursString = `${hours} ${hours > 1 ? "hrs" : "hr"}`

    //Return only minutes if there are no full hours
    if (hours === 0) return minutesString
    // Return only hours if there are no extra minutes
    if (minutes === 0) return hoursString
    //return both hours and minutes if both are present
    return `${hoursString} ${minutesString}`
}

// Gets the short offset string for a given timezone, like "+02:00"
export function formatTimezoneOffset(timezone: string) {
    return new Intl.DateTimeFormat(undefined,
        {timeZone: timezone, timeZoneName: "shortOffset"} //Request the short offset string
    )
    .formatToParts(new Date()) // Format the current date into parts
    .find(part => part.type == "timeZoneName")?.value //Extract the timezone offset part
}