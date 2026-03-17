import { ScreenUsers } from "@/screens/users/screen-users";
import { Suspense } from "react";

export default function Users() {
  return (
    <Suspense>
      <ScreenUsers />
    </Suspense>
  );
}
