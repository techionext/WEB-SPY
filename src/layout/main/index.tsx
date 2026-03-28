import { Aside } from "./components/aside";
import { LayoutWithProfileModal } from "./layout-with-profile-modal";

export const LayoutAuthenticated = ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutWithProfileModal>
      <main className="flex  grow h-full w-full  mx-auto  min-h-screen relative bg-content2  ">
        <Aside />
        <div className="flex-1 p-4 flex flex-col grow">
          <div className="bg-content1 p-6 rounded-2xl grow">{children}</div>
        </div>
      </main>
    </LayoutWithProfileModal>
  );
};
