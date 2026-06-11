import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address';
    if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords must match';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await register({ ...form, name: form.name.trim(), email: form.email.trim() });
      toast.success('Account created');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <AuthLayout title="Create account" subtitle="Set up a private workspace for your tasks.">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormInput label="Name" value={form.name} onChange={updateField('name')} error={errors.name} autoComplete="name" />
        <FormInput label="Email" type="email" value={form.email} onChange={updateField('email')} error={errors.email} autoComplete="email" />
        <FormInput label="Password" type="password" value={form.password} onChange={updateField('password')} error={errors.password} autoComplete="new-password" />
        <FormInput label="Confirm password" type="password" value={form.confirmPassword} onChange={updateField('confirmPassword')} error={errors.confirmPassword} autoComplete="new-password" />
        <button className="w-full rounded bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-zinc-400">
        Already registered? <Link className="font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400" to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
