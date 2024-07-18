import { useSession,signIn,signOut } from "next-auth/react"

export default function Component(){
    const {data:session} = useSession()
    if(session){
        return(
            <>
            Signed is as {session.user.email}<br />
            <button className='bg-orange-500 px-3 py-1 mt-4 rounded'
             onClick={() => signOut()}>signOut</button>
            </>
        )
    }

    return (
        <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}