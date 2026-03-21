'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeOffIcon, Mail, EyeIcon } from "lucide-react";
import Link from 'next/link';

const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            router.push('/home');
        } catch (err: Error | any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-screen flex justify-center mt-32 '>
            <div className='flex flex-col items-center gap-8 w-full'>
                <div className="text-center">
                    <h1 className='font-bold text-[24px]'>Login</h1>
                    <small>Welcome back.</small>
                </div>

                {error && (
                    <div className="w-[90%] max-w-[500] bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-[90%] max-w-[500] space-y-4">
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <InputGroupAddon align="inline-end">
                                <Mail size={18} />
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <InputGroupAddon
                                align="inline-end"
                                onClick={() => setShowPassword(!showPassword)}
                                className="cursor-pointer"
                            >
                                {showPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <div className="border border-gray-300 flex justify-center items-center w-[90%] max-w-[500] h-12 rounded-lg">
                    Don&apos;t have an account?
                    <Link href="/register" className="underline text-gray-400 ml-1">
                        Join
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;