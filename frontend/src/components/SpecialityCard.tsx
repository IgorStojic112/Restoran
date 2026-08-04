


function SpecialityCard({image,title,description}){
    return (
        <div className="rounded-lg shadow-lg overflow-hidden bg-white">
            <img src={image} alt={title} className="w-full h-56 object-cover" />
            <div className="p-4">
                <h3 className="text-2xl font-semibold">{title}</h3>
                <p className="text-gray-600 mt-2">{description}</p>
            </div>
        </div>
    );
}

export default SpecialityCard;