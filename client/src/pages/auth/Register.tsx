import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = z.object({
  orgName: z.string().min(2, 'Organization name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'At least 6 characters'),
  role: z.enum(['DONOR', 'NGO']),
  city: z.string().optional(),
  phone: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'DONOR' },
  });

  const role = watch('role');

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError('');
      await registerUser(data);
      navigate(data.role === 'DONOR' ? '/donor' : '/ngo');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } }).response?.data?.error;
      setError(msg || 'Registration failed.');
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
          <p className="text-gray-500 text-sm">Create your account</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {/* Role selector */}
          <div className="flex gap-2 mb-4">
            {(['DONOR', 'NGO'] as const).map((r) => (
              <label
                key={r}
                className={`flex-1 flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition
                  ${role === r ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <input type="radio" value={r} {...register('role')} className="sr-only" />
                <span className="text-lg">{r === 'DONOR' ? '🍽️' : '🐾'}</span>
                <span className="text-sm font-medium mt-1">
                  {r === 'DONOR' ? 'Restaurant' : 'NGO'}
                </span>
              </label>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input label="Organization Name" error={errors.orgName?.message} required
              placeholder={role === 'NGO' ? 'e.g. Hope Foundation' : 'e.g. Sunrise Café'} {...register('orgName')} />
            <Input label="Email" type="email" error={errors.email?.message} required
              placeholder="you@example.com" {...register('email')} />
            <Input label="Password" type="password" error={errors.password?.message} required
              placeholder="Min. 6 characters" {...register('password')} />
            <Input label="City" placeholder="Mumbai" {...register('city')} />
            <Input label="Phone" placeholder="+91 98765 43210" {...register('phone')} />

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <Button type="submit" loading={loading} className="w-full justify-center">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
