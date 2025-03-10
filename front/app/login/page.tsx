"use client";

import { useContext } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authContext } from "@/providers/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "../actions/auth";
import { getUserInfo } from "../actions/user";

export default function Login() {
  const { setUser } = useContext(authContext);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.target);

    const response = await signIn(
      formData.get("email") as string,
      formData.get("password") as string
    );

    if (response.status === 200) {
      localStorage.setItem("token", response.data.access_token);

      const user = await getUserInfo();
      localStorage.setItem("user", JSON.stringify(user.data));
      setUser(user.data);
      router.push("/tickets");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center mx-auto">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" name="password" type="password" />
            </div>
            <Button type="submit">Connexion</Button>
          </form>
        </CardContent>
        <CardFooter>
          Pas de compte?{" "}
          <Link className="ml-1 text-blue-500 font-bold" href="/register">
            Inscrivez-vous!
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
