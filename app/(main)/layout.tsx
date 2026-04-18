import PrivateNavBar from "@/components/PrivateNavBar";
import PublicNavBar from "@/components/PublicNavBar";
import { currentUser } from "@clerk/nextjs/server";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <main className="relative">
      {/*Render PrivateBar if user exists, otherwise publicnavvar */}
      {user ? <PrivateNavBar /> : <PublicNavBar />}

      {/*Render the children */}
      <section className="pt-36">{children}</section>
    </main>
  );
}
