import LoginForm from "@/components/Homepage/LoginForm";

function HomePage() {
  return (
    <main
      className="bg-green-radial from-light-green to-mint-green relative z-[1] pt-32 flex flex-col items-center"
      style={{
        minHeight: "calc(100dvh - 55px)",
      }}
    >
      <h1 className="text-[30px] tracking-[-2%] font-semibold text-primary mb-6">
        Welcome
      </h1>
      <LoginForm />
      <img
        src="/logo-icon.png"
        alt="AI Detective"
        className="w-1/2 max-w-[526px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-[1]"
      />
    </main>
  );
}

export default HomePage;
