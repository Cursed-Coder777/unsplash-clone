'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Auto-submit when all digits filled
    useEffect(() => {
        if (otp.every(digit => digit !== '')) {
            handleVerify();
        }
    }, [otp]);

    // Countdown timer for resend
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // ✅ Handle paste event - distribute code across all boxes
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const digits = pastedText.replace(/\D/g, '').slice(0, 6);

        if (digits.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < digits.length; i++) {
                newOtp[i] = digits[i];
            }
            setOtp(newOtp);

            const focusIndex = Math.min(digits.length, 5);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            setSuccess('Email verified successfully! Redirecting...');
            setTimeout(() => {
                router.push('/home');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Verification failed');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            setSuccess('New OTP sent to your email!');
            setTimer(60);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Invalid Request</h2>
                    <p className="text-gray-600 mb-4">No email address provided.</p>
                    <Link href="/register" className="text-blue-500 hover:underline">
                        Go back to registration
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                    <p className="text-gray-600">
                        We've sent a 6-digit verification code to<br />
                        <span className="font-medium text-gray-900">{email}</span>
                    </p>
                </div>

                {error && (
                    <div className="mt-4 bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-4 bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center">
                        {success}
                    </div>
                )}

                <div className="mt-8">
                    <div className="flex justify-center gap-2" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onFocus={() => setFocusedIndex(index)}
                                onBlur={() => setFocusedIndex(null)}
                                className="w-12 h-12 text-center text-xl font-bold rounded-lg outline-none transition-all shadow-sm"
                                style={{
                                    border: `1.5px solid ${focusedIndex === index ? 'black' : '#e5e7eb'}`,
                                }}
                                disabled={loading}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-2">
                        You can paste the entire code
                    </p>
                </div>

                <div className="mt-6 text-center">
                    {timer > 0 ? (
                        <p className="text-sm text-gray-500">
                            Resend code in {timer}s
                        </p>
                    ) : (
                        <button
                            onClick={handleResend}
                            disabled={loading}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Resend OTP
                        </button>
                    )}
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleVerify}
                        disabled={loading || otp.some(d => d === '')}
                        className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-500">
                    Didn't receive the code? Check your spam folder.
                </div>
            </div>
        </div>
    );
}