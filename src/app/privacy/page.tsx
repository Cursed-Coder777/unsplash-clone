// src/app/privacy/page.tsx
'use client'

import Link from 'next/link'
import { Shield, ChevronLeft } from 'lucide-react'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <Link href="/home" className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors">
                    <ChevronLeft size={20} />
                    Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-black">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Privacy Policy</h1>
                        <p className="text-gray-500">Last updated: March 24, 2026</p>
                    </div>
                </div>

                <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">1. Introduction</h2>
                        <p>
                            Welcome to the Unsplash Clone. We respect your privacy and are committed to protecting your personal data. 
                            This privacy policy will inform you as to how we look after your personal data when you visit our website 
                            and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">2. Data We Collect</h2>
                        <p>
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Identity Data:</strong> includes username or similar identifier.</li>
                            <li><strong>Contact Data:</strong> includes email address.</li>
                            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                            <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">3. Google AdSense</h2>
                        <p>
                            We use Google AdSense to serve ads on our website. Google, as a third-party vendor, uses cookies to serve ads on your site. 
                            Google's use of the DART cookie enables it to serve ads to your users based on their visit to your sites and other sites on the Internet. 
                            Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">4. Cookies</h2>
                        <p>
                            We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits, 
                            keep track of advertisements and compile aggregate data about site traffic and site interaction so that we can offer better site experiences 
                            and tools in the future.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">5. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy or our privacy practices, please contact us at:
                            <br />
                            <strong>Email:</strong> privacy@unsplash-clone.com
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
