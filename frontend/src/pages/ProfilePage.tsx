import React, { use, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContex";
import defaultImage from "../assets/Pasta.jpg"
import { useRef } from "react";
import NavBar from "../components/NavBar";


function ProfilePage(){

    const { token, user, uploadProfileImage } = useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordCheck, setNewPasswordCheck] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [passwordEmail, setPasswordEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageError, setImageError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [ingredients, setIngredients] = useState<{id: number; Name: string; is_allergen: boolean}[]>([]);
    const [preferencesText, setPreferencesText] = useState("");
    const [selectedAllergyIds, setSelectedAllergyIds] = useState<number[]>([]);
    const [prefError, setPrefError] = useState("");
    const [prefMessage, setPrefMessage] = useState("");
    const [prefLoading, setPrefLoading] = useState(false);
    const [prefSaving, setPrefSaving] = useState(false);

    
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
    
    const handleImageChange = async(e : React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if(!file) return;

        if(file.size > 5 * 1024 * 1024){
            setImageError("Slika mora biti manja od 5 Mb");
            return;
        }

        setImageError("");
        setUploading(true);
        try{
            await uploadProfileImage(file);
        } catch (err) {
            setImageError(err instanceof Error ? err.message : "Greska pri slanju slike");
        } finally {
            setUploading(false);
        }
    }

    useEffect(() => {
    setPrefLoading(true);
    Promise.all([
        fetch("http://127.0.0.1:8000/accounts/profile/", {
            headers: { "Authorization": `Token ${token}` },
            }).then(res => res.json()),
            fetch("http://127.0.0.1:8000/api/ingredient/").then(res => res.json()),
    ])
        .then(([profileData, ingredientData]) => {
            setPreferencesText(profileData.dietary_preferences || "");
            setSelectedAllergyIds(profileData.allergies.map((a: {id: number}) => a.id));
            setIngredients(ingredientData);
        })
            .catch(() => setPrefError("Greška pri učitavanju preferencija"))
            .finally(() => setPrefLoading(false));
    }, [token]);

    const toggleAllergy = (id: number) => {
        setSelectedAllergyIds(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handleSavePreferences = async (e: React.FormEvent) => {
        e.preventDefault();
        setPrefError("");
        setPrefMessage("");
        setPrefSaving(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/accounts/profile/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`,
            },
            body: JSON.stringify({
                dietary_preferences: preferencesText,
                allergy_ids: selectedAllergyIds,
            }),
            });

            if (!response.ok) {
            setPrefError("Greška pri spremanju preferencija");
            return;
            }

            setPrefMessage("Preferencije su spremljene");
        } catch (err) {
            setPrefError("Došlo je do greške. Pokušajte ponovo");
        } finally {
            setPrefSaving(false);
        }
    };

    const allergenOptions = ingredients.filter(i => i.is_allergen);
    
    return (
        
        
        
        <div className="bg-white min-h-screen">
            
            <NavBar onSearch={null} user={user}></NavBar>
            
            <div className="mx-auto max-w-4xl mt-10">
                
                
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="mb-5 text-2xl font-semibold text-slate-900">{user.username}</h1>

                        <div className="relative mb-5">
                            <img 
                            src={user.profileImage || defaultImage} 
                            className="w-32 h-32 rounded-full object-cover" 
                            alt="Profilna slika"
                            />
                        </div>
                        <input 
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        />

                        <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {uploading ? "Slanje..." : "Promijeni profilnu sliku"}
                        </button>

                        {imageError && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{imageError}</p>}
                    </div>
                </div>
                <h1>Hello from Profile page</h1>
                
                
                
                <div className="grid gap-6 md:grid-cols-2">
                        <form 
                            onSubmit={handleChangePassword}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            
                            <h2 className="text-lg font-medium text-slate-900">Promjenite lozinku</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Unesite staru lozinku, a zatim novu dva puta.
                            </p>

                            <div className="mt-6 space-y-4">
                                <div >
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700"> Unesite staru lozinku</label>
                                    <input 
                                        type="password"
                                        name="oldPassword"
                                        placeholder="stara lozinka"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                    />
                                    
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700"> Unesite novu lozinku</label>
                                    <input 
                                        type="password" 
                                        name="newPassword"
                                        placeholder="nova lozinka"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Unesite ponovo novu lozinku</label>
                                    <input 
                                        type="password" 
                                        name="newPasswordCheck"
                                        placeholder="nova lozinka"
                                        value={newPasswordCheck}
                                        onChange={(e) => setNewPasswordCheck(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                    />
                                </div>
                            </div>
                            
                            {error && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"> {error} </p>}
                            {message && <p role="status" className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700" > {message} </p>}

                            <button 
                                type="submit"
                                className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                            >Promjeni lozinku</button>

                        </form>
                    

                    <form 
                    onSubmit={handleChangeEmail}
                    className="self-start rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <h2 className="text-lg font-medium text-slate-900">Promjena email-a</h2>
                        <p className="mt-1 text-sm text-slate-500">Za portvrdu unesene lozinke i novu email adresu.</p>

                        <div className="mt-6 space-y-4">

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Unestie Lozinku </label>
                                <input 
                                    type="password"
                                    name="passwordEmail"
                                    placeholder="lozinka"
                                    value={passwordEmail}
                                    onChange={(e) => setPasswordEmail(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700"> Unesite novi email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                />
                            </div>
                        </div>
                        
                        <button type="submit" className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2">Promjenu Email</button>
                        
                    </form>
                </div>
                <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
  <h2 className="text-lg font-medium text-slate-900">Prehrambene preferencije i alergije</h2>
  <p className="mt-1 text-sm text-slate-500">
    Ove informacije koristi AI asistent kako bi vam preporučio jela koja vam odgovaraju.
  </p>

  {prefLoading ? (
    <p className="mt-4 text-sm text-slate-400">Učitavanje...</p>
  ) : (
    <form onSubmit={handleSavePreferences} className="mt-6 space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Opišite svoje prehrambene navike i želje
        </label>
        <textarea
          value={preferencesText}
          onChange={(e) => setPreferencesText(e.target.value)}
          placeholder="npr. vegetarijanac sam, volim začinjenu hranu, izbjegavam mliječne proizvode"
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Alergeni koje trebate izbjegavati
        </label>
        {allergenOptions.length === 0 ? (
          <p className="text-sm text-slate-400">Trenutno nema označenih alergena u bazi.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {allergenOptions.map(ing => (
              <label
                key={ing.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 has-[:checked]:border-red-500 has-[:checked]:bg-red-50 has-[:checked]:text-red-800"
              >
                <input
                  type="checkbox"
                  checked={selectedAllergyIds.includes(ing.id)}
                  onChange={() => toggleAllergy(ing.id)}
                  className="h-4 w-4 rounded border-gray-300 accent-red-600"
                />
                {ing.Name}
              </label>
            ))}
          </div>
        )}
      </div>

      {prefError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{prefError}</p>}
      {prefMessage && <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{prefMessage}</p>}

      <button
        type="submit"
        disabled={prefSaving}
        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
      >
        {prefSaving ? "Spremanje..." : "Spremi preferencije"}
      </button>
    </form>
  )}
</div>
            </div>
        </div>
    )

}


export default ProfilePage;