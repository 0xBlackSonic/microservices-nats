import axiosIntance from "@/api/axiosInstance";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [protectedData, setProtectedData] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosIntance.get("/api/protected");
        setProtectedData(data);
      } catch {
        /* empty */
      }
    };

    getData();
  }, []);

  return (
    <>
      <div>DashboardPage</div>
      <p>Data from server: {protectedData}</p>
    </>
  );
}
