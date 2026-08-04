


function Footer(){

    return (
        <footer className="bg-black w-full min-h-[20vh] text-white py-8 ">
            <div className="flex justify-center items-center h-full gap-24" >
                <div className="mr-[10%]">
                    <h1>Lokacija</h1>
                    <p>Grad: Mostar</p>
                    <p>Adressa: Ante Starcevica b.b</p>
                </div>

                <div className="mr-[10%]">
                    <h1>Vrijeme rada:</h1>
                    <p>Pon-Pet: 07-23</p>
                    <p>Sub: 10-23</p>
                    <p>Ned: Ne radi</p>
                </div>

                <div>
                    <h1>Kontakt</h1>
                    <p>Tel: 036 111 111</p>
                    <p>Mob: 063 111 111</p>
                    <p>Email: Restoran@email.com</p>
                </div>
            </div>
        </footer>
    );

}


export default Footer;