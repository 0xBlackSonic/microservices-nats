import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInCredentialsForm } from "@/components/forms/SignInCredentialsForm";
import { SignInEmailForm } from "@/components/forms/SignInEmailForm";
import { SignUpCredentialsForm } from "@/components/forms/SignUpCredentialsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/components/providers/session-provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();
  const { authUser } = useSession();

  useEffect(() => {
    if (authUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, authUser]);

  return (
    <section className="h-full">
      <div className="container mx-auto px-6 py-12 h-full flex flex-col items-center">
        <div className="w-[100%] sm:w-[500px] px-4 py-10">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2 h-full">
              <TabsTrigger className="text-xl" value="signin">
                Sign In
              </TabsTrigger>
              <TabsTrigger className="text-xl" value="signup">
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Card className="flex flex-col items-center">
                <CardHeader>
                  <CardTitle>Credentials</CardTitle>
                </CardHeader>
                <CardContent className="w-full px-12">
                  <SignInCredentialsForm />
                </CardContent>

                <div className="w-[85%] border-b h-1"></div>

                <CardHeader>
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent className="w-full px-12">
                  <SignInEmailForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card className="flex flex-col items-center">
                <CardHeader>
                  <CardTitle>Credentials</CardTitle>
                </CardHeader>
                <CardContent className="w-full px-12">
                  <SignUpCredentialsForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
