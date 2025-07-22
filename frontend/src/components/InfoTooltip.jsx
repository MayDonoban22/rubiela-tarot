const InfoTooltip = ({ message }) => {
  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md bg-white border border-goldLight text-center rounded-lg shadow-lg p-4 animate-fade-in-out">
      <p className="text-[16px] font-inter text-[#7C7C70]">{message}</p>
    </div>
  );
};

export default InfoTooltip;
