import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/create-admin")({
  component: CreateAdmin,
});

function CreateAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createTripleZAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/create-triple-z-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin');
      }

      toast.success("Triple-Z Admin created successfully!");
      navigate({ to: "/admin/login" });
    } catch (error: any) {
      toast.error(error.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Create Triple-Z Admin</h1>
          <p className="text-gray-600 mb-6">
            This will create a new admin account and delete any existing ones.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left text-sm">
            <p><strong>Email:</strong> triple-z@gmail.com</p>
            <p><strong>Password:</strong> triple-z123</p>
          </div>

          <Button
            onClick={createTripleZAdmin}
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            {loading ? "Creating..." : "Create Admin Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}