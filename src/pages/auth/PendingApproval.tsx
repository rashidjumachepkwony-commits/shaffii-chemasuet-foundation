import { useNavigate } from "react-router-dom";
import { Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function PendingApproval() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Clock className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-bold text-neutral-900">
          Awaiting Approval
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          Thanks for signing in
          {user?.email ? (
            <>
              {" "}
              as <span className="font-medium text-neutral-900">{user.email}</span>
            </>
          ) : null}
          . Your account has been created and is waiting for an administrator to
          approve it. You'll be able to use the member dashboard as soon as
          that's done.
        </p>

        <div className="mt-8 space-y-3">
          <Button
            className="w-full"
            rounded="full"
            onClick={async () => {
              await logout();
              navigate("/login", { replace: true });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
          <a
            href="/"
            className="inline-block text-sm text-neutral-500 hover:text-neutral-700"
          >
            Return to homepage
          </a>
        </div>
      </div>
    </div>
  );
}
