import { Button } from "@/components/ui/button";
import { SignOutButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <SignOutButton>
        <SignUpButton mode="modal">Sign Up</SignUpButton>
      </SignOutButton>
    </div>
  );
}
