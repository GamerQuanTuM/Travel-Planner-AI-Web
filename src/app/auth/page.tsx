import Header from "@/components/Header"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Login from "./login"
import Register from "./register"

export function Auth() {
    return (
        <div className="w-screen h-screen">
            <Header show={false} />
            <div className="flex flex-col items-center justify-center my-12">
                <Tabs defaultValue="signin" className="w-[25rem] ">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Signin</TabsTrigger>
                        <TabsTrigger value="signup">Signup</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <Login />
                    </TabsContent>
                    <TabsContent value="signup">
                        <Register />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}


export default Auth