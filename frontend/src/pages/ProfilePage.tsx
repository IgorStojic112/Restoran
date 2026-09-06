import { use, useState } from "react";
import { useAuth } from "../context/AuthContex";


function ProfilePage(){

    const { token } = useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordCheck, setNewPasswordCheck] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [passwordEmail, setPasswordEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if(newPassword !== newPasswordCheck ){
            setError("Nova loznika i provjera se ne podudarju");
            return;
        }

        try{
            const response = await fetch("http://127.0.0.1:8000/accounts/changepassword/",{
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body : JSON.stringify({
                    old_password : oldPassword,
                    new_password : newPassword,
                }),

            });

            const data = await response.json();
            
            if(!response.ok){
                setError(Array.isArray(data.error) ? data.error.join(" ") : data.error);
                return;
            }
            
            setMessage(data.message);
            setOldPassword("");
            setNewPassword("");
            setNewPasswordCheck("");
        }catch (err) {
            setError("Doso je do greske. Pokusajte ponovo");
        }


    };
    const handleChangeEmail = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try{
            const response = await fetch("http://127.0.0.1:8000/accounts/changeemail/",{
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body : JSON.stringify({
                    password : passwordEmail,
                    new_email : newEmail,
                }),
            });
            
            const data = await response.json();
            
            if(!response.ok){
                setError(Array.isArray(data.error) ? data.error.join(" ") : data.error);
                return;
            }
            
            setMessage(data.message);
            setPasswordEmail("");
            setNewEmail("");

        }catch (err) {
            setError("Doslo je do greske pri promjeni E-mail addrese. Pokusajte ponovo");
        }
    }
    
    
    return (
        
        
        
        <div className="bg-white">
            
            <h1>Hello from Profile page</h1>
            
            
            
            
            <form 
                onSubmit={handleChangePassword}
                className=""
            >
                
                <label > Unesite staru lozinku</label>
                <input 
                    type="password"
                    name="oldPassword"
                    placeholder="stara lozinka"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <label > Unesite novu lozinku</label>
                <input 
                    type="password" 
                    name="newPassword"
                    placeholder="nova lozinka"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                
                <label >Unesite ponovo novu lozinku</label>
                <input 
                    type="password" 
                    name="newPasswordCheck"
                    placeholder="nova lozinka"
                    value={newPasswordCheck}
                    onChange={(e) => setNewPasswordCheck(e.target.value)}
                />

                {error && <p style={{color: "red"}}> {error} </p>}
                {message && <p style={{color : "green"}}> {message} </p>}

                <button type="submit">Promjeni lozinku</button>

            </form>

            <form onSubmit={handleChangeEmail}>

                <label >Unestie Lozinku </label>
                <input 
                    type="password"
                    name="passwordEmail"
                    placeholder="lozinka"
                    value={passwordEmail}
                    onChange={(e) => setPasswordEmail(e.target.value)}
                />

                <label > Unesite novi email</label>
                <input 
                    type="email" 
                    name="email"
                    placeholder="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />

                <button type="submit">Promjenu Email</button>
            </form>

        </div>
    )

}


export default ProfilePage;