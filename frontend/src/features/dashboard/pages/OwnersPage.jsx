import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Owners from "../components/Owners";


export default function OwnersPage() {
    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[#F7F8FA] flex flex-col">
             <Navbar />
       
             <div className="flex flex-1 min-w-0 overflow-x-hidden">
               <Sidebar />
       
               <div className="flex-1 min-w-0 overflow-x-hidden">
                 <Owners />
               </div>
             </div>
           </div>
     );
}