// src/app/terms/page.tsx
'use client'

import Link from 'next/link'
import { FileText, ChevronLeft } from 'lucide-react'

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white text-gray-800">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <Link href="/home" className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors">
                    <ChevronLeft size={20} />
                    Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-black">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Terms of Service</h1>
                        <p className="text-gray-500">Last updated: March 24, 2026</p>
                    </div>
                </div>

                <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, 
                            all applicable laws and regulations, and agree that you are responsible for compliance with any 
                            applicable local laws. If you do not agree with any of these terms, you are prohibited from 
                            using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">2. Use License</h2>
                        <p>
                            Permission is granted to download the materials (information or software) on Unsplash Clone's 
                            website for personal, non-commercial transitory viewing only. This is the grant of a license, 
                            not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>modify or copy the materials;</li>
                            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                            <li>attempt to decompile or reverse engineer any software contained on Unsplash Clone's website;</li>
                            <li>remove any copyright or other proprietary notations from the materials; or</li>
                            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">3. Disclaimer</h2>
                        <p>
                            The materials on Unsplash Clone's website are provided on an 'as is' basis. Unsplash Clone makes 
                            no warranties, expressed or implied, and hereby disclaims and negates all other warranties 
                            including, without limitation, implied warranties or conditions of merchantability, fitness 
                            for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">4. Limitations</h2>
                        <p>
                            In no event shall Unsplash Clone or its suppliers be liable for any damages (including, 
                            without limitation, damages for loss of data or profit, or due to business interruption) 
                            arising out of the use or inability to use the materials on Unsplash Clone's website, even 
                            if Unsplash Clone or an authorized representative has been notified orally or in writing 
                            of the possibility of such damage.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">5. Governing Law</h2>
                        <p>
                            Any claim relating to Unsplash Clone's website shall be governed by the laws of the State of 
                            California without regard to its conflict of law provisions.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
