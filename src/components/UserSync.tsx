"use client"

import { syncuser } from "@/lib/actions/user";
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react";

function UserSync() {
  const {isSignedIn, isLoaded} = useUser();

  useEffect(() => {
   
    const handleUserSync = async () => {
        if ( isLoaded && isSignedIn) {
            try {
               await syncuser();
            } catch (error) {
                console.error("Error syncing user:", error);
            }
    }
}


    handleUserSync();
    }, [isLoaded, isSignedIn]);

    return null;

}

export default UserSync
