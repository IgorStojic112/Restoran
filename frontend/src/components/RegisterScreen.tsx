import React, { use, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000/accounts/register/"

interface RegisterResponse {
    token? : string;
    message? : string;
    error? : string;
}

export default function RegisterScreen(): React.ReactElement{
    
    const [username,setUsername] = useState<string>("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState<string>("")
    const [comfirmPassword,setComfirmPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const navigate = useNavigate()
    
    const handleRegister = async (): Promise<void> => {
        setError("");
        
        if(!username || !password || !email || !comfirmPassword){
            setError("Molimo Vas popunite sva polja ");
            return;
        }
        if(password !== comfirmPassword){
            setError("Lozinke se ne podudaraju");
            return;
        }
        if(!email.includes("@")){
            setError("Email mora sadrzavati @");
            return;
        }

        try {
            const res = await fetch(API_URL,{
                method: "POST",
                headers : {"Constent-Type" : "application/json"},
                body : JSON.stringify({username,password,email})
            });
            const data: RegisterResponse = await res.json();

            if(!res.ok) {
                setError("Nesto nije uspijelo")
            }else if (data.token) {
                localStorage.setItem("token",data.token);
                alert(`Dobrodosli! Token je spasen. Poruka: ${data.message}`)
                navigate('/login')
            }

        }catch(err : unknown){
            setError("Ne moze se pristupiti serveru")
        }finally {
            setLoading(false);
        }



    }
    
    return (
    <div style={styles.pages}>
        <div style={styles.card}>
            <div style={styles.header}>
                <h1 style={styles.title}> Registrirajte se</h1>
            </div>
            
            <form onSubmit={(e) => {e.preventDefault; handleRegister(); }} style={styles.form}>
                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Email adresa</label>
                    <div style={styles.inputWrapper}>
                        <span style={styles.inputIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2"/>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                        </span>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            style={styles.input}
                            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                            onBlur={(e) => Object.assign(e.target.style, styles.input)}
                        />
                    </div>
                </div>

                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Korisnicko ime</label>
                    <div style={styles.inputWrapper}>
                        <span style={styles.inputIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="4"/>
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                            </svg>
                        </span>
                        <input 
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Korisnicko ime"
                            required
                            style={styles.input}
                            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                            onBlur={(e) => Object.assign(e.target.style, styles.input)}
                        />
                    </div>
                </div>
                

                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Lozinka</label>
                    <div style={styles.inputWrapper}>
                        <span style={styles.inputIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                        </span>
                        <input 
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Unesite svoju lozinku"
                            required
                            style={{ ...styles.input, paddingRight: "44px" }}
                            onFocus={(e) => Object.assign(e.target.style, { ...styles.inputFocus, paddingRight: "44px" })}
                            onBlur={(e) => Object.assign(e.target.style, { ...styles.input, paddingRight: "44px" })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={styles.eyeButton}
                        >
                            {showPassword ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Potvrdite lozinku</label>
                    <div style={styles.inputWrapper}>
                        <span style={styles.inputIcon}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                        </span>
                        <input 
                            type={showPassword ? "text" : "password"}
                            value={comfirmPassword}
                            onChange={(e) => setComfirmPassword(e.target.value)}
                            placeholder="Potvrdite svoju lozinku"
                            required
                            style={{ ...styles.input, paddingRight: "44px" }}
                            onFocus={(e) => Object.assign(e.target.style, { ...styles.inputFocus, paddingRight: "44px" })}
                            onBlur={(e) => Object.assign(e.target.style, { ...styles.input, paddingRight: "44px" })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={styles.eyeButton}
                        >
                            {showPassword ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </form>

        </div>
        
    </div>
    );

    
}

const styles : Record<string, CSSProperties > = {

    pages : {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "24px",
        boxSizing: "border-box",
    },
    card : {
        width: "100%",
        maxWidth: "400px",
        background: "#faf9f6",
        borderRadius: "20px",
        padding: "40px 36px 32px",
        boxSizing: "border-box",
    },
    header : {
        marginBottom: "32px",
    },
    title : {
        fontSize: "26px",
        fontWeight: "400",
        color: "#1a1a2e",
        margin: "0 0 6px",
        letterSpacing: "-0.3px",
    },
    form : {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    fieldGroup : {
        display: "flex",
        flexDirection: "column",
        gap: "7px",
    },
    labelRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#3d3d4e",
        letterSpacing: "0.01em",
    },
    forgotLink: {
        fontSize: "12px",
        color: "#8a8a99",
        textDecoration: "none",
    },
    inputWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    inputIcon: {
        position: "absolute",
        left: "14px",
        color: "#b0b0be",
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
    },
    input: {
        width: "100%",
        height: "44px",
        paddingLeft: "42px",
        paddingRight: "16px",
        fontSize: "14px",
        color: "#1a1a2e",
        background: "#ffffff",
        border: "1.5px solid #e4e3ec",
        borderRadius: "10px",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.15s",
        fontFamily: "'DM Sans', sans-serif",
    },
    eyeButton: {
        position: "absolute",
        right: "12px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#b0b0be",
        display: "flex",
        alignItems: "center",
        padding: "4px",
    },
}