
import ProtectedRoute from "@/components/ProtectedRoute";
import { GroupsList } from "./_components/rides-list";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {

  return (
    <>
      <ProtectedRoute>
        <div className='mt-10  mx-10'>
          <GroupsList />
        </div>
      </ProtectedRoute>
    </>
  );
}
