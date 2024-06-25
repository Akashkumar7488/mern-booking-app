const Footer = () =>{
    return (
        <>
          <div className="py-12 mt-44" style={{backgroundColor:"#3D7EAA"}}>
            <div className="container mx-auto flex justify-between items-center">
                <span className="text-3xl text-white font-bold tracking-tight">
                    TravelLookup.com
                </span>
                <span className="text-white font-bold tracking-tight flex gap-4">
                    <p className="cursor-pointer">Home</p>
                    <p className="cursor-pointer">About</p>
                    <p className="cursor-pointer">Privacy Policy</p>
                    <p className="cursor-pointer">Terms  of services</p>
                </span>
            </div>
          </div>
        </>
    )
}

export default Footer