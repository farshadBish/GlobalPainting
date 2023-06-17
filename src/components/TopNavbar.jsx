const TopNavbar = () => {
  return (
    <div className=" bg-white w-full flex flex-row items-center justify-between pr-3 rounded-md shadow-2xl">
        <div className="flex items-center">
    <img src="https://cdn.discordapp.com/attachments/1028757599266541648/1118556421101998261/farshad_Logo_with_text__Global_Paint__3263ba62-04c6-4486-adab-c4f8bbaaf653.png" width={70} alt="logo" />
    <h1 className= " text-lg font-bold font-inter">Global Paint</h1>
        </div>
    <h2 className="text-lg font-satoshi font-bold"><span className=" text-blue-400 font-extrabold">Paint</span> whatever you want!</h2>
    </div>
  )
}

export default TopNavbar