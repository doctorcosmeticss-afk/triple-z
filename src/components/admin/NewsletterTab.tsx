import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Trash2, Mail, Users, Calendar } from "lucide-react";
import { ADMIN_API_URL, getAuthHeadersOnly } from "@/lib/admin-api";

type Subscriber = {
  _id: string;
  email: string;
  createdAt: string;
};

export default function NewsletterTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const response = await fetch(`${ADMIN_API_URL}/newsletter`, {
        headers: getAuthHeadersOnly()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load subscribers');
      }

      setSubscribers(data.subscribers || []);
    } catch (error: any) {
      console.error("Error loading subscribers:", error);
      toast.error(error.message || "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subscriber: Subscriber) => {
    const result = await Swal.fire({
      title: "Delete Subscriber?",
      text: `Are you sure you want to delete "${subscriber.email}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${ADMIN_API_URL}/newsletter/${subscriber._id}`, {
        method: 'DELETE',
        headers: getAuthHeadersOnly()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete subscriber');
      }

      toast.success("Subscriber deleted successfully");
      loadSubscribers();
    } catch (error: any) {
      console.error("Error deleting subscriber:", error);
      toast.error(error.message || "Failed to delete subscriber");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm sm:text-base">Loading subscribers...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border-gray-200 bg-white">
      <CardHeader className="bg-white border-b p-3 sm:p-6">
        <CardTitle className="text-lg sm:text-2xl font-bold text-black flex items-center gap-2">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
          Newsletter Subscribers ({subscribers.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-3 sm:p-6">
        {subscribers.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium text-base sm:text-lg mb-2">No subscribers yet</p>
            <p className="text-gray-500 text-xs sm:text-sm">Newsletter subscribers will appear here</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {/* Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-black text-lg">Total Subscribers</h3>
                  <p className="text-blue-600 text-2xl font-bold">{subscribers.length}</p>
                </div>
              </div>
            </div>

            {/* Subscribers List */}
            <div className="space-y-3">
              {subscribers.map((subscriber) => (
                <div
                  key={subscriber._id}
                  className="border-2 border-gray-200 bg-white hover:border-blue-300 transition-all rounded-lg p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-black text-sm sm:text-base break-all">
                            {subscriber.email}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>Subscribed: {formatDate(subscriber.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(subscriber)}
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline ml-2">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Export Feature */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-black mb-2">Export Subscribers</h4>
              <p className="text-sm text-gray-600 mb-3">
                Download all subscriber emails for marketing campaigns
              </p>
              <Button
                onClick={() => {
                  const emails = subscribers.map(s => s.email).join('\n');
                  const blob = new Blob([emails], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("Subscriber list exported!");
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                📥 Export Email List
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}