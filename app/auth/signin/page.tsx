'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success(t('toast.signInSuccess'));
      router.push('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific error cases
      if (error.message.includes('UserNotConfirmedException')) {
        toast.error(t('toast.verifyEmail'));
        router.push(`/auth/confirm?email=${encodeURIComponent(email)}`);
      } else if (error.message.includes('NotAuthorizedException')) {
        toast.error(t('toast.invalidCredentials'));
      } else if (error.message.includes('UserNotFoundException')) {
        toast.error(t('toast.userNotFound'));
      } else {
        toast.error(error.message || t('toast.signInFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border border-gray-600/30 backdrop-blur-sm bg-black/40 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              {t('auth.signin.title')}
            </CardTitle>
            <p className="text-gray-300 text-sm">{t('auth.signin.subtitle')}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                  {t('auth.signin.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('auth.signin.emailPlaceholder')}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                  {t('auth.signin.password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t('auth.signin.passwordPlaceholder')}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{t('auth.signin.signingIn')}</span>
                  </div>
                ) : (
                  t('auth.signin.button')
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-300">
                {t('auth.signin.noAccount')}{' '}
                <Link 
                  href="/auth/signup" 
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200 hover:underline decoration-2 underline-offset-2"
                >
                  {t('nav.signup')}
                </Link>
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}