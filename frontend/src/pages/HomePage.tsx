import NavBar from "../components/NavBar";
import image from "../assets/FoodBackgroundHome.jpg"
import TableCloth from "../assets/RedWhiteTableClothWood.png"
import Footer from "../components/Footer";
import SpecialityCard from "../components/SpecialityCard";
import Chef from "../assets/Chef.jpg";
import Pasta from "../assets/Pasta.jpg";
import Restoran from "../assets/Restoran.jpg";

// bg-white

function HomeScreen(){

    
    
    return (
        <div>
        
            <NavBar></NavBar>


            <div 
                className="w-full bg-cover bg-center min-h-[80vh] flex"
                style={{backgroundImage: `url(${image})`}}
            >
                <div className="w-[30%] h-[60%] text-white mr-[15%] mt-[10%] ml-auto">
                    
                    <h1 className="font-chalk text-white text-6xl
                                    [text-shadow:0_0_2px_rgba(255,255,255,0.6)">
                        Bella Italia
                    </h1>
                    <br />
                   
                    
                    <p className="font-chalk text-white 
                    [text-shadow:0_0_2px_rgba(255,255,255,0.6)">
                        Content Content Content Content Content Content Content Content Content Content Content ContentContent Content 
                        Content Content Content Content Content Content Content Content Content Content Content Content
                        <br />
                        <br />
                    
                    </p>

                    <div>
                        <button className="mt-6 bg-[#B22222] text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-[#8B0000] hover:scale-105 transition-all duration-300">
                            Reserve a Table
                        </button>

                        <button className="mt-6 border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300">
                            View Menu
                        </button>
                    </div>
                    
                </div>
                
            </div>
            
            
            <div    
                    className="py-20"
                    style={{backgroundImage : `url(${TableCloth})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}>
                <h2 className="text-4xl font-bold text-center mb-12">Nasi specijaliteti</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mr-10 ml-10">
                    <SpecialityCard image="" title="Margariata pizza" description="Fresh mozarella, basil and tomato sauce."/>  
                    <SpecialityCard image="" title="Margariata pizza" description="Fresh mozarella, basil and tomato sauce."/>  
                    <SpecialityCard image="" title="Margariata pizza" description="Fresh mozarella, basil and tomato sauce."/>  
                </div>
            </div>

            
            
            <div className="bg-black text-white">
                
                <div className="max-w-6xl mx-auto px-6 py-14 space-y-12">
                    <h2 className="font-bold text-center ">O nama</h2>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <img src={Chef} alt="Kuhar" className="" />
                        </div>
                        <p className="flex-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Sed in orci ultrices, bibendum dolor vehicula, efficitur metus. 
                            Duis scelerisque ex in lectus dictum, rutrum consequat urna faucibus.
                            Nullam eget risus ac turpis tincidunt pulvinar in ut nunc. Phasellus rutrum ultrices erat, vitae viverra massa lacinia in.
                            Suspendisse finibus, eros eu placerat scelerisque, nunc tellus euismod metus, eget faucibus magna tellus id orci. Maecenas odio ipsum,
                            sodales ut augue nec, iaculis fermentum massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                        
                        <p className="flex-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Sed in orci ultrices, bibendum dolor vehicula, efficitur metus. 
                            Duis scelerisque ex in lectus dictum, rutrum consequat urna faucibus.
                            Nullam eget risus ac turpis tincidunt pulvinar in ut nunc. Phasellus rutrum ultrices erat, vitae viverra massa lacinia in.
                            Suspendisse finibus, eros eu placerat scelerisque, nunc tellus euismod metus, eget faucibus magna tellus id orci. Maecenas odio ipsum,
                            sodales ut augue nec, iaculis fermentum massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                        </p>
                        <div>
                            <img src={Pasta} alt="Hrana pasta" className="flex-1" />
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <img src={Restoran} alt="Restoran" className=""/>
                        </div>
                        <p className="flex-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Sed in orci ultrices, bibendum dolor vehicula, efficitur metus. 
                            Duis scelerisque ex in lectus dictum, rutrum consequat urna faucibus.
                            Nullam eget risus ac turpis tincidunt pulvinar in ut nunc. Phasellus rutrum ultrices erat, vitae viverra massa lacinia in.
                            Suspendisse finibus, eros eu placerat scelerisque, nunc tellus euismod metus, eget faucibus magna tellus id orci. Maecenas odio ipsum,
                            sodales ut augue nec, iaculis fermentum massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                        </p>
                    </div>
                </div>
            </div>

            


            <Footer></Footer>
        </div>

    )



}




export default HomeScreen;