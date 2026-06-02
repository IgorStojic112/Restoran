import { useState } from "react";
import type { CSSProperties , KeyboardEvent } from "react";
import React from "react";

const API_URL = "http://localhost:8000/accounts/login/"

interface LoginResponse {
    token?: string;
    message?: string;
    error?: string
}

export default function LoginScreen(): React.ReactElement{
    
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const handleLogin = async (): Promise<void> => {
        setError("");
        if(!email || !password){
            setError("Molim Vas ispunite sva polja.");
            return;
        }

    
        setLoading(true);
        try{
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email,password}),
            });
            const data: LoginResponse = await res.json();
            if(!res.ok) {
                setError(data.error || "Nesto nije uspijelo.")
            }else if (data.token){
                localStorage.setItem("token",data.token);
                alert(`Dobrodosli! Token je spasen. Poruka: ${data.message}`)
                // To do redirect to dashboard 
            }
        } catch (err: unknown){
            setError("Ne moze se pristupiti serveru. Django je li upaljen.")
        }finally{
            setLoading(false);
            }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") handleLogin();
    }


    return (
    <div style={styles.page}>
        <div style={styles.card}>
            
            <div style={styles.header}>
                <div style={styles.logoMark}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect width="28" height="28" rx="8" fill="#1a1a2e" />
                        <path d="M8 20 L14 8 L20 20" stroke="#e8c97e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                
                <h1 style={styles.title}>Welcome back</h1>
                <p style={styles.subtitle}>Sign in to continue</p>

            </div>
            
            <form onSubmit={(e) => {e.preventDefault(); handleLogin(); }} style={styles.form}>
                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Email adresa</label>
                    <div style={styles.inputWrapper}>
                        <span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2"/>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                            </svg>
                        </span>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            style={styles.input}
                            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                            onBlur={(e) => Object.assign(e.target.style, styles.input)}
                        />
                    </div>
                </div>

                <div style={styles.fieldGroup}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Password</label>
                        <a href="#" style={styles.forgotLink}>Forgot password?</a>
                    </div>
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
                            placeholder="Enter your password"
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

                <button 
                type="submit" 
                style={loading ? { ...styles.submitBtn, ...styles.submitBtnLoading } : styles.submitBtn}
                onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, styles.submitBtnHover)}
                onMouseLeave={(e) => !loading && Object.assign(e.currentTarget.style, styles.submitBtn)}
                disabled={loading}
                >
                    {loading ? (
                        <span style={styles.loadingContent}>
                            <span style={styles.spinner}/>
                            Signing in…
                        </span>
                    ) : (
                        "Sign in"
                    )}
                </button>

            </form>

            <p style={styles.signupPrompt}>
                Don't have an account?{" "}
                <a href="#" style={styles.signupLink}>Create one</a>
            </p>
            
        </div>
              <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
        
                @keyframes spin {
                to { transform: rotate(360deg); }
                }
      `}</style>
    
    </div>
    );
}



const styles : Record<string, CSSProperties > = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c1a 0%, #1a1a2e 50%, #16213e 100%)",
    fontFamily: "'DM Sans', sans-serif",
    padding: "24px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#faf9f6",
    borderRadius: "20px",
    padding: "40px 36px 32px",
    boxSizing: "border-box",
  },
  header: {
    marginBottom: "32px",
  },
  logoMark: {
    marginBottom: "20px",
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "26px",
    fontWeight: "400",
    color: "#1a1a2e",
    margin: "0 0 6px",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#8a8a99",
    margin: 0,
    fontWeight: "400",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
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
  inputFocus: {
    width: "100%",
    height: "44px",
    paddingLeft: "42px",
    paddingRight: "16px",
    fontSize: "14px",
    color: "#1a1a2e",
    background: "#ffffff",
    border: "1.5px solid #1a1a2e",
    borderRadius: "10px",
    outline: "none",
    boxSizing: "border-box",
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
  submitBtn: {
    width: "100%",
    height: "46px",
    marginTop: "4px",
    background: "#1a1a2e",
    color: "#faf9f6",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    letterSpacing: "0.02em",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.15s",
  },
  submitBtnHover: {
    width: "100%",
    height: "46px",
    marginTop: "4px",
    background: "#2d2d4a",
    color: "#faf9f6",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    letterSpacing: "0.02em",
    fontFamily: "'DM Sans', sans-serif",
  },
  submitBtnLoading: {
    opacity: "0.7",
    cursor: "not-allowed",
  },
  loadingContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(250,249,246,0.3)",
    borderTopColor: "#faf9f6",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  signupPrompt: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "13px",
    color: "#8a8a99",
  },
  signupLink: {
    color: "#1a1a2e",
    fontWeight: "500",
    textDecoration: "none",
  },
  
}



