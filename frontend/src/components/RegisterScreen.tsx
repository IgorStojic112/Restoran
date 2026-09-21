import React, { use, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContex"

const API_URL = "http://localhost:8000/accounts/register/"


export default function RegisterScreen(): React.ReactElement{
    
    const [username,setUsername] = useState<string>("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState<string>("")
    const [comfirmPassword,setComfirmPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const navigate = useNavigate();
    const { register } = useAuth();
    
    const handleRegister = async (): Promise<void> => {
        setError("");
        setSuccess("");
        
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

        setLoading(true);

        try {/*
            const res = await fetch(API_URL,{
                method: "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({username,password,email}) */

                const res = await register(username, email,password);
                setSuccess(res.message || "Racun je uspjesno napravljen! ");
                setTimeout(() => navigate("/home"), 2000);
            } catch (err){
                if (err instanceof TypeError) {
                    setError("Ne moze se pristupiti serveru")
                } else {
                    setError(
                        err instanceof Error && err.message
                        ? err.message
                        : "Nesto nije uspijelo."
                    );
                }
            } finally {
                setLoading(false);
            }
            
    }
    
    return (
    <div style={styles.pages}>
        <div style={styles.card}>
            <div style={styles.header}>
                <h1 style={styles.title}> Registrirajte se</h1>
            </div>
            
            <form onSubmit={(e) => {e.preventDefault(); handleRegister(); }} style={styles.form}>
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

                    {error && (
                        <div role="alert" style={styles.errorBox}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                    <div role="status" style={styles.successBox}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span>{success} Preusmjeravanje…</span>
                    </div>
                    )}
                    
                    
                </div>
                

                <button type="submit" style={styles.submitBtn} disabled={loading || !!success}> {loading ? "Registracija.." : "Registriraj se"}</button>

                <div style={styles.signupPrompt}>
                    <a href="/login" style={styles.signupLink} >Nazad na login</a>
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
    signupLink: {
    fontWeight: "500",
    textDecoration: "none",
    },
    signupPrompt: {
    marginTop: "24px",
    textAlign: "left",
    fontSize: "13px",
    color: "#8a8a99",
    },
    inputFocus: {
        borderColor: "#1a1a2e",
    },
    errorBox: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        borderRadius: "8px",
        background: "#fdecea",
        color: "#b3261e",
        border: "1px solid #f5c2c0",
        fontSize: "14px",
        fontFamily: "'DM Sans', sans-serif",
    },
    successBox: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        borderRadius: "8px",
        background: "#e8f5e9",
        color: "#1b5e20",
        border: "1px solid #b7dfb9",
        fontSize: "14px",
        fontFamily: "'DM Sans', sans-serif",
    },
    submitBtn: {
        height: "44px",
        border: "none",
        borderRadius: "10px",
        background: "#1a1a2e",
        color: "#e8c97e",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
    },

}