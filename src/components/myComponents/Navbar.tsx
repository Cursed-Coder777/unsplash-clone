import Link from "next/link"


import { Focus, Search } from "lucide-react"
const Navbar = () => {
    return (
        <nav className="w-full ">
            <div className="p-4">
                <div className="flex items-center gap-4">
                    {/* Seach bar */}
                    <div className="w-full flex bg-[#76767620] hover:bg-[#76767640] h-10 justify-center items-center p-4 rounded-full  ">
                        <div><Search size={18} /></div>
                        <div className="w-full h-10">
                            <input type="search" placeholder="Search photos and illustrations" className=" w-full h-full pl-1 outline-none border-none " />
                        </div>
                        <div className=""><Focus size={18} /></div>
                    </div>
                    <p className="w-[7%] cursor-pointer text-[14px] text-black">Get Unsplash+</p>
                    <Link href='/' className=" text-[#767676] hover:text-black text-[14px] ">Login</Link>
                    <button className="w-[10%] border border-[#767676] rounded-md p-1 cursor-pointer text-[#767676] hover:border-black hover:text-black text-[15px]">Submit an image</button>
                </div>
                <div className="mt-5 mb-2">
                    <ul className="flex gap-5 text-[15px] text-[#767676] ">
                        <li className="hover:text-black">Featured</li>
                        <li className="hover:text-black">Spring</li>
                        <li className="hover:text-black">Wallpapers</li>
                        <li className="hover:text-black">3D Renders</li>
                        <li className="hover:text-black">Nature</li>
                        <li className="hover:text-black">Textures</li>
                        <li className="hover:text-black">Film </li>
                        <li className="hover:text-black">Architecture</li>
                        <li className="hover:text-black">Street Photography</li>
                        <li className="hover:text-black">Experimental</li>
                        <li className="hover:text-black">Travel</li>
                        <li className="hover:text-black">Peopel</li>
                    </ul>
                </div>
            </div>
            <hr />
        </nav >
    )
}

export default Navbar
