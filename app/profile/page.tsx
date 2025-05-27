"use client";

import ChangePasswordForm from "@/components/forms/changePasswordform";
import ProfileForm from "@/components/forms/profileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminProfilePage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>
      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="password">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
