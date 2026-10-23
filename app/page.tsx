import { Hero } from "./home/hero";
import { NavBar } from "./home/navbar";
import { Philosophy } from "./home/philosophy";

export default function Home() {
  return (
    <>
      <main className="">
        <section className="bg-black py-6 md:px-16">
          <NavBar />
          <Hero />
        </section>
        <Philosophy />
      </main>
    </>
  );
}
