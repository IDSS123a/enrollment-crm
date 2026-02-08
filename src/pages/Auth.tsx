import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Chrome } from 'lucide-react';
import { lovable } from '@/integrations/lovable/index';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Error',
            description: error.message || t('loginError'),
            variant: 'destructive',
          });
        } else {
          navigate('/dashboard');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: t('signupSuccess'),
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      
      if (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to sign in with Google',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-material-xl p-8 animate-fade-in">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-material-lg">
              <span className="text-2xl font-bold text-white">I</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">IDSS Pro</h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? t('welcomeBack') : t('createAccount')}
            </p>
          </div>

          {/* Google Sign-In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6 py-6 border-2 hover:bg-muted/50 transition-all duration-200"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('loading')}
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {t('continueWithGoogle')}
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{t('orContinueWith')}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">
                  {t('fullName')}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                {t('email')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                {t('password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary hover:opacity-90 text-white font-medium py-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('loading')}
                </>
              ) : isLogin ? (
                t('login')
              ) : (
                t('signup')
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
              <span className="font-semibold">
                {isLogin ? t('signup') : t('login')}
              </span>
            </button>
          </div>

          {/* GDPR Notice */}
          <p className="mt-6 text-xs text-center text-muted-foreground">
            {t('gdprNotice')}
          </p>
        </div>
      </div>
    </div>
  );
}
