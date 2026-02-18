'use client'
import Image from "next/image"
import { SignIn } from '@clerk/nextjs'
import { neobrutalism } from '@clerk/themes'

 // Marks this file as a client component

export default function LandingPage() {
    return(
        <main className="flex flex-col items-center justify-center min-h-screen p-10 gap-24 animate-fade-in max-md:flex-col">
            <section className="flex flex-col items-center">
                {/* App Logo */}
                <Image
                src='/assets/logo.svg'
                width={190}
                height={190}
                alt="Logo"
                />

                {/*Main Heading */}
                 <h1 className="text-2xl font-black lg:text-23l">
                    Your time, perfectly planned
                </h1>

                {/*Subheading */}
                <p className="font-extralight">
                    Join millions of professionals who easily book meetings with the #1 scheduling tool
                </p>

                {/* Illustration below text */}
                <Image
                src='/assets/planning.svg'
                width={170}
                height={170}
                alt="Logo"
                />

            </section>
            {/* Clerk sign in component with custom theme */}
                <div className="mt-3">
                    <SignIn
                    routing="hash" //keeps sign in UI on the same page using hash-based routing
                    appearance={{
                        baseTheme: neobrutalism //applies the neobrutalism theme style to the sign in ui
                    }}
                    />
                </div>

        </main>
    )
}