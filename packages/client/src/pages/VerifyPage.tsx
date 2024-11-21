import { useSession } from "@/components/providers/session-provider";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyPage() {
  const [status, setStatus] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const { signin, authUser } = useSession();
  const navigate = useNavigate();

  const SleepRedirect = () => {
    setTimeout(() => {
      navigate("/signin", { replace: true });
    }, 3000);
  };

  useEffect(() => {
    if (authUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, authUser]);

  useEffect(() => {
    const email = searchParams.get("email");
    const accessToken = searchParams.get("accessToken");

    if (!email || !accessToken) {
      setStatus(false);
      SleepRedirect();
    } else {
      const verifyAccess = async () => {
        try {
          await signin("email", { email, password: accessToken });
          navigate("/dashboard", { replace: true });
        } catch {
          setStatus(false);
          SleepRedirect();
        }
      };

      verifyAccess();
    }
  });

  return (
    <>
      {status ? (
        <div className="relative flex flex-col w-full h-full justify-center items-center pt-20 pb-48">
          <div className="text-center">
            <span className="text-3xl">Verifying Access Link...</span>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col w-full h-full justify-center items-center pt-20 pb-48">
          <div className="text-center">
            <span className="text-6xl">Upss...</span>
            <div className="text-2xl font-extralight pt-8">
              <p>Access Link is not valid.</p>
              <span className="text-sm font-extralight pt-8">
                Redirecting to Sign In page
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
