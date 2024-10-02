import React from 'react'
import { Button } from "@/components/ui/button"
import RegisterForm from "@/components/team/RegisterModal"

const Teamregister = () => {
    const [teamSize, setTeamSize] = React.useState(3);
    // const [allMembers, setAllMembers] = React.useState([]);
    const [teamName, setTeamName] = React.useState('');


    // const handleMembersUpdate = (newMembers) => {
    //     setAllMembers(newMembers);
    // };
    return (
        <>
            <div className="grid lg:max-w-none lg:mr-14   lg:grid-cols-7 p-0 " style={{ height: 'calc(100vh - 60px)' }}>

                <div className="relative hidden h-full flex-col p-10 lg:flex col-span-2">
                    <div className="absolute inset-0 bg-zinc-900"></div>
                </div>

                <div className="p-6 md:p-8   lg:pl-20   col-span-5">
                    <h1 className=" font-extrabold font-raleway  tracking-tight text-3xl  md:text-4xl">
                        TEAM SIZE
                    </h1>

                    <div className='py-4  md:py-7   font-extrabold text-white dark:text-black'>
                        <Button onClick={() => setTeamSize(3)} className={`transition-all rounded-full text-xl h-14 w-14 md:h-14 md:w-14 mr-3 md:mr-4 ${teamSize === 3 ? "" : "dark:bg-white bg-black  dark:text-black"}`}><span style={{ transform: "scaleX(1.9) scaleY(1)" }} className=" md:text-2xl font-bold font-akira"> 3 </span> </Button>
                        <Button onClick={() => setTeamSize(4)} className={`transition-all rounded-full text-xl h-14 w-14 md:h-14 md:w-14 mr-3 md:mr-4 ${teamSize === 4 ? "" : "dark:bg-white bg-black dark:text-black"}`}><span style={{ transform: "scaleX(1.9) scaleY(1)" }} className=" md:text-2xl font-bold font-akira"> 4 </span></Button>
                        <Button onClick={() => setTeamSize(5)} className={`transition-all rounded-full text-xl h-14 w-14 md:h-14 md:w-14 mr-3 md:mr-4 ${teamSize === 5 ? "" : "dark:bg-white bg-black dark:text-black"}`}><span style={{ transform: "scaleX(1.9) scaleY(1)" }} className=" md:text-2xl font-bold  font-akira"> 5 </span></Button>
                    </div>
                    <input required placeholder='TEAM NAME' value={teamName}  onChange={e => setTeamName(e.target.value.toUpperCase())} className='bg-transparent overflow-hidden cursor-text w-full text-5xl my-2 md:mb-4 outline-none md:text-7xl font-extrabold' />
                    <RegisterForm numberOfMembers={teamSize} teamName={teamName}  /> 





                </div>
            </div>

        </>
    )
}

export default Teamregister