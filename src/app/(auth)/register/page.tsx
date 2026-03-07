'use client'
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
// export const metadata = {
//     title: 'Sign Up - Unsplash Clone',
//     description: 'Sign Up to Unsplash clone project',
//     keywords: 'sign up, unsplash, clone, photos',

// }
const Register = () => {
    console.log(usePathname())

    return (
        <div className="flex w-screen h-full">
            {/* left div */}
            <div className="w-[50%] hidden lg:block">
                <Image src='https://plus.unsplash.com/premium_photo-1726105464462-627faa14da0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDF8NnNNVmpUTFNrZVF8fGVufDB8fHx8fA%3D%3D' alt="nature image" height={100} width={100}
                    style={{ width: '100%', height: '100vh' }}
                    sizes="50vw" />
            </div>
            {/* Right div */}
            <div className="lg:w-[50%] w-screen flex flex-col items-center mt-32 gap-20" >
                <div>
                    <h1 className="text-3xl font-bold">Join Unsplash</h1>
                    <Link href='/login'><small>Already have an account? <span className="text-gray-400 underline">Login</span></small>

                    </Link></div>
                <form className="sm:w-[90%] max-w-[500] w-[90%]">
                    <FieldGroup>

                        <div className="sm:grid sm:grid-cols-2 sm:gap-4 flex flex-col gap-2 ">
                            <Field>
                                <FieldLabel htmlFor="form-firstname">First name</FieldLabel>
                                <Input id="form-firstname" type="text" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="form-lastname">Last name</FieldLabel>
                                <Input id="form-lastname" type="text" />
                            </Field>

                        </div>
                        <Field>
                            <FieldLabel htmlFor="form-email">Email</FieldLabel>
                            <Input id="form-email" type="email" placeholder="john@example.com" />

                        </Field>
                        <Field>
                            <FieldLabel htmlFor="form-username">Username<span className="text-gray-500">(only letters, numbers and underscores)</span></FieldLabel>
                            <Input id="form-username" type="text" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="form-username">Password<span className="text-gray-500"> (min. 8 char)</span></FieldLabel>
                            <Input id="form-username" type="text" />
                        </Field>
                        <Field orientation="vertical" className="flex flex-col items-center justify-center">

                            <Button type="submit" className="sm:w-full max-w-[500] w-full h-10">Join</Button>

                            <small className="text-gray-500  ">By joining, you agree to the <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.</small>
                        </Field>

                    </FieldGroup>

                </form></div>
        </div>

    )
}
export default Register