import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContex";


function Menu() {

    const { user } = useAuth();


    return (
        
        
        
        <div>
            <NavBar onSearch={null} user={user}></NavBar>
                


        </div>
    );

}

export default Menu;