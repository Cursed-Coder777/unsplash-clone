import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { EyeOffIcon, Mail } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: 'Login - Unsplash Clone',
    description: 'Login to Unsplash clone project',
    keywords: 'login,sign in, unsplash, clone, photos',

}

const Login = () => {
    return (
        <div className='w-full flex justify-center mt-32'>
            <div className='flex flex-col items-center gap-8 w-full'>
                <div className="text-center">
                    <h1 className='font-bold text-[24px]'>Login</h1>
                    <small>Welcome back.</small>
                </div>
                <div className="w-[90%] max-w-[500]">
                    <Field >
                        <FieldLabel htmlFor="inline-end-input">Email</FieldLabel>
                        <InputGroup >
                            <InputGroupInput
                                id="inline-end-input"
                                type="password"

                            />
                            <InputGroupAddon align="inline-end">
                                <Mail />
                            </InputGroupAddon>
                        </InputGroup>

                    </Field>
                </div>
                <div className="w-[90%] max-w-[500]" >
                    <Field >
                        <FieldLabel htmlFor="inline-end-input">Password</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="inline-end-input"
                                type="password"

                            />
                            <InputGroupAddon align="inline-end">
                                <EyeOffIcon />
                            </InputGroupAddon>
                        </InputGroup>

                    </Field>
                </div>
                <Button size="lg" className="w-[90%] max-w-[500]" >
                    Login
                </Button>
                <div className="border border-gray-300 flex justify-center items-center w-[90%] max-w-[500] h-25">
                    Don&apos;t have an account?
                    <Link href='/register'>
                        <span className="underline text-gray-400">&nbsp;Join</span></Link>
                </div>

            </div>
        </div>

    )
}

export default Login


