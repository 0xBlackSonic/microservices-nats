import axiosIntance from "@/api/axiosInstance";
import { useSession } from "@/components/providers/session-provider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [protectedData, setProtectedData] = useState<string>("");

  const { authUser } = useSession();

  useEffect(() => {
    if (!authUser) {
      return navigate("/signin");
    }

    const getData = async () => {
      try {
        const { data } = await axiosIntance.get("/api/protected");
        setProtectedData(data);
      } catch {
        /* empty */
      }
    };

    getData();
  }, [authUser]);

  return (
    <>
      <div>DashboardPage</div>
      <p>Data from server: {protectedData}</p>
    </>
  );
}
