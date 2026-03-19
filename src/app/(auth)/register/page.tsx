'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from 'next/link';

const Register = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
    });
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
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            router.push('/home');
        } catch (err: Error | any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-screen min-h-screen">
            {/* left div */}
            <div className="w-[50%] hidden lg:block">
                <Image 
                    src='https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1170&auto=format&fit=crop' 
                    alt="Office" 
                    height={1000} 
                    width={1000}
                    style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
                />
            </div>
            
            {/* Right div */}
            <div className="lg:w-[50%] w-full flex flex-col items-center mt-10 lg:mt-20 px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Join Unsplash</h1>
                    <p className="text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-gray-400 underline">
                            Login
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="w-full max-w-[500px] bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full max-w-[500px]">
                    <FieldGroup className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="firstName">First name</FieldLabel>
                                <Input 
                                    id="firstName" 
                                    type="text" 
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                                <Input 
                                    id="lastName" 
                                    type="text" 
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="username">
                                Username <span className="text-gray-500">(only letters, numbers and underscores)</span>
                            </FieldLabel>
                            <Input 
                                id="username" 
                                type="text"
                                pattern="[a-zA-Z0-9_]+"
                                title="Only letters, numbers and underscores allowed"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">
                                Password <span className="text-gray-500">(min. 8 char)</span>
                            </FieldLabel>
                            <Input 
                                id="password" 
                                type="password"
                                minLength={8}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Field>

                        <Field orientation="vertical" className="flex flex-col items-center justify-center mt-6">
                            <Button 
                                type="submit" 
                                className="w-full h-10"
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Join'}
                            </Button>

                            <small className="text-gray-500 mt-4 text-center">
                                By joining, you agree to the <span className="underline cursor-pointer">Terms</span> and{' '}
                                <span className="underline cursor-pointer">Privacy Policy</span>.
                            </small>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </div>
    );
};

export default Register;