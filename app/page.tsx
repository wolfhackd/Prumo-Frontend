import { Benefits } from "./home/benefits";
import { Hero } from "./home/hero";
import { Philosophy } from "./home/philosophy";
import { Solution } from "./home/solution";

export default function Home() {
  return (
    <>
      <main className="">
        <section className="bg-black py-6 md:px-16">
          <Hero />
        </section>
        <Philosophy />
        <Solution />
        <Benefits />
      </main>
    </>
  );
}
