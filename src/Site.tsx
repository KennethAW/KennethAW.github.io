import Chrome from "./sections/Chrome";
import Nav from "./sections/Nav";
import MobileMenu from "./sections/MobileMenu";
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Work from "./sections/Work";
import Education from "./sections/Education";
import Skills from "./sections/Skills";
import Leadership from "./sections/Leadership";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import ToTop from "./sections/ToTop";

/* The page, in the order a reader meets it. The spine lives here rather than in
   a section because it runs the length of all of them - it is the thing that
   makes the page read as one piece. */
export default function Site() {
  return (
    <>
      <Chrome />
      <Nav />
      <MobileMenu />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Stats />
        <div className="thread">
          <div className="spine" aria-hidden="true"><div className="spine-fill"></div></div>
          <About />
          <Experience />
          <Work />
          <Education />
          <Skills />
          <Leadership />
          <Contact />
        </div>
      </main>
      <Footer />
      <ToTop />
    </>
  );
}
