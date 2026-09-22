import NavBar from "../components/NavBar";
import image from "../assets/FoodBackgroundHome.jpg";
import TableCloth from "../assets/RedWhiteTableClothWood.png";
import Footer from "../components/Footer";
import SpecialityCard from "../components/SpecialityCard";
import Chef from "../assets/Chef.jpg";
import Pasta from "../assets/Pasta.jpg";
import Restoran from "../assets/Restoran.jpg";
import { useAuth } from "../context/AuthContex";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const { user } = useAuth();
  const navigator = useNavigate();

  return (
    <div>
      <NavBar onSearch={null} user={user} />

      {/* Hero sekcija */}
      <div
        className="w-full bg-cover bg-center min-h-[80vh] flex"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="w-[30%] h-[60%] text-white mr-[15%] mt-[10%] ml-auto">
          <h1 className="font-chalk text-white text-6xl [text-shadow:0_0_2px_rgba(255,255,255,0.6)]">
            Bella Italia
          </h1>
          <br />

          <p className="font-chalk text-white text-lg leading-relaxed [text-shadow:0_0_2px_rgba(255,255,255,0.6)]">
            Hrana je najljepša kada se dijeli. U svakom tanjuru spajamo autentične
            talijanske okuse, tradiciju i ljubav kako bismo stvorili trenutke koji
            okupljaju obitelj i prijatelje za istim stolom.
          </p>

          <div>
            <button
              className="relative cursor-pointer mt-6 border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              onClick={() => {
                navigator("/menuOrder");
              }}
            >
              Pogledajte ponudu jela
            </button>
          </div>
        </div>
      </div>

      {/* Specijaliteti */}
      <div
        className="py-20"
        style={{
          backgroundImage: `url(${TableCloth})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h2 className="text-4xl font-bold text-center mb-12">Naši specijaliteti</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mr-10 ml-10">
          <SpecialityCard
            image={Pasta}
            title="Margarita pizza"
            description="Svježa mocarela, bosiljak i umak od rajčice."
            price={null}
          />
          <SpecialityCard
            image={Pasta}
            title="Margarita pizza"
            description="Svježa mocarela, bosiljak i umak od rajčice."
            price={null}
          />
          <SpecialityCard
            image={Pasta}
            title="Margarita pizza"
            description="Svježa mocarela, bosiljak i umak od rajčice."
            price={null}
          />
        </div>
      </div>

      {/* Sekcija O Nama */}
      <div className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-14 space-y-12">
          <h2 className="text-3xl font-bold text-center">O nama</h2>

          {/* Prvi dio priče - Kuhar i tradicija */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <img src={Chef} alt="Kuhar" className="rounded-lg w-full object-cover" />
            </div>
            <p className="flex-1 text-gray-300 leading-relaxed">
              Priča o restoranu Bella Italia započela je prije više od tri desetljeća
              kao mali obiteljski san prenesen iz srca Italije. Naš glavni chef
              odrastao je uz mirise svježe umiješane tjestenine i pečenih rajčica u
              bakinoj kuhinji. Ta ista strast i posvećenost detaljima danas čine
              temelj svakog recepta koji pripremamo za vas.
            </p>
          </div>

          {/* Drugi dio priče - Sastojci i hrana */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <p className="flex-1 text-gray-300 leading-relaxed">
              Vjerujemo da vrhunsko jelo počinje s besprijekornim sastojcima. Svaki
              dan nabavljamo svježa lokalna povrća, dok originalne sireve, pršut i
              maslinovo ulje uvozimo izravno od malih talijanskih proizvođača.
              Naše tijesto zri polako, a umaci se kuhaju satima kako bi zadržali
              puni, punokrvni mediteranski okus.
            </p>
            <div className="flex-1">
              <img src={Pasta} alt="Hrana pasta" className="rounded-lg w-full object-cover" />
            </div>
          </div>

          {/* Treći dio priče - Ambijent i doživljaj */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <img src={Restoran} alt="Restoran" className="rounded-lg w-full object-cover" />
            </div>
            <p className="flex-1 text-gray-300 leading-relaxed">
              Bella Italia nije samo mjesto gdje se dolazi na obrok — to je dom u
              kojem stvaramo uspomene. Bilo da se radi o obiteljskom ručku,
              romantičnoj večeri ili ugodnom druženju s prijateljima, naša je misija
              pružiti vam toplinu obiteljskog stola i okuse koji vas vraćaju najljepšim
              trenucima.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomeScreen;