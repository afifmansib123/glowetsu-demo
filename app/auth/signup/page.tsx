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

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const role = 'user'; // Always set to user
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error(t('toast.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      toast.error(t('toast.passwordTooShort'));
      return;
    }

    // Basic password strength validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      toast.error(t('toast.passwordWeak'));
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(email, password, name, role);
      
      if (result.needsConfirmation) {
        toast.success(t('toast.accountCreated'));
        // Pass both email and username to confirmation page
        router.push(`/auth/confirm?email=${encodeURIComponent(email)}&username=${encodeURIComponent(result.username)}`);
      } else {
        toast.success(t('toast.accountSuccess'));
        router.push('/');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || t('toast.createAccountFailed'));
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
              {t('auth.signup.title')}
            </CardTitle>
            <p className="text-gray-300 text-sm">{t('auth.signup.subtitle')}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-200">
                  {t('auth.signup.name')}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={t('auth.signup.fullNamePlaceholder')}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300"
                />
              </div>

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
                  placeholder={t('auth.signup.emailPlaceholder')}
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
                  placeholder={t('auth.signup.passwordPlaceholder')}
                  minLength={8}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300"
                />
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-600/30">
                  <p className="text-xs text-orange-300 font-medium">
                    {t('auth.signup.passwordRequirements')}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
                  {t('auth.signup.confirmPassword')}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl mt-6" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{t('auth.signup.creating')}</span>
                  </div>
                ) : (
                  t('auth.signup.button')
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-300">
                {t('auth.signup.hasAccount')}{' '}
                <Link 
                  href="/auth/signin" 
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200 hover:underline decoration-2 underline-offset-2"
                >
                  {t('nav.signin')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}