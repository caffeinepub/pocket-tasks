import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './hooks/useQueries';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MobileScaffold from './components/layout/MobileScaffold';
import TasksPage from './pages/TasksPage';
import { Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [profileName, setProfileName] = useState('');

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSaveProfile = async () => {
    if (profileName.trim()) {
      await saveProfile.mutateAsync({ name: profileName.trim() });
      setProfileName('');
    }
  };

  // Show loading screen while checking authentication
  if (loginStatus === 'initializing' || (isAuthenticated && profileLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <img 
              src="/assets/generated/app-icon.dim_512x512.png" 
              alt="Pocket Tasks" 
              className="mx-auto h-24 w-24 rounded-3xl shadow-lg"
            />
            <h1 className="text-4xl font-bold tracking-tight">Pocket Tasks</h1>
            <p className="text-lg text-muted-foreground">
              Your personal task manager, always in your pocket
            </p>
          </div>
          <Button 
            onClick={login} 
            disabled={loginStatus === 'logging-in'}
            size="lg"
            className="w-full"
          >
            {loginStatus === 'logging-in' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MobileScaffold>
        <TasksPage />
      </MobileScaffold>

      {/* Profile Setup Dialog */}
      <Dialog open={showProfileSetup}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Welcome to Pocket Tasks!</DialogTitle>
            <DialogDescription>
              Let's get you set up. What should we call you?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && profileName.trim()) {
                    handleSaveProfile();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSaveProfile} 
              disabled={!profileName.trim() || saveProfile.isPending}
              className="w-full"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  );
}

export default App;
