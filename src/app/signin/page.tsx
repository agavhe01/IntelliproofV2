import SigninForm from '../components/SigninForm';
import Image from 'next/image';

export default function SigninPage() {
    return (
        <div className="min-h-screen flex bg-black">
            {/* Left: Logo and Company Name */}
            <div className="flex-1 flex flex-col justify-center items-center">
                <Image src="/logo.png" alt="Intelliproof Logo" width={160} height={160} />
                <h1 className="text-white text-4xl font-bold mt-8">Welcome Back to Intelliproof</h1>
            </div>
            {/* Right: Signin Form */}
            <div className="flex-1 flex flex-col justify-center items-center bg-[#18181b]">
                <SigninForm />
            </div>
        </div>
    );
} 