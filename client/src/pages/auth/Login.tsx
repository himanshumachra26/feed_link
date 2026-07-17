import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError('');
      await login(data.email, data.password);
      // Redirect based on role — auth context sets user, navigate to their dashboard
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'DONOR') navigate('/donor');
        else if (payload.role === 'NGO') navigate('/ngo');
        else navigate('/admin');
      }
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } }).response?.data?.error;
      setError(msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-bold text-emerald-600 mb-1 hover:opacity-85 transition-opacity cursor-pointer justify-center w-full">
            <span>🌿</span>
            <span>FeedLink</span>
          </Link>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              required
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
              {...register('password')}
            />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <Button type="submit" loading={loading} className="w-full justify-center">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
