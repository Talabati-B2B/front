import background from "../../assets/images/Background.png";

export default function RegisterLayout({ children }) {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
    style={{backgroundImage: `url(${background})`}}>
      <div className="bg-white rounded-2xl md:w-[35rem] w-[80%] shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}