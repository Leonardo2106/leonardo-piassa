import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";
import cv_english from './assets/cv/LeonardoPiassaCV-english.pdf'
import cv_portuguese from './assets/cv/LeonardoPiassaCV-portuguese.pdf'
import email_icon from './assets/icons/email-icon.png';
import github_icon from './assets/icons/github-icon.png';
import linkedin_icon from './assets/icons/linkedin-icon.png';
import Starfield from "./components/Starfield.jsx";
import { useReveals } from "./hooks/useReveals.js";
import { useParallax } from "./hooks/useParallax.js";

const apiClient = axios.create({
  baseURL: "https://projectsapi-w6d9.onrender.com/api/",
});

export default function App() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.add("js");
    window.scrollTo(0, 0);
  }, []);

  useReveals();
  useParallax(heroRef);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await apiClient.get("projects/");
        setProjects(data);
      } catch (error) {
        console.error("Houve um erro ao buscar os projetos:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <>
      <Starfield defaultSpeed={0} defaultDensity={2.2} />

      <div className="content">
        <header className="site">
          <div className="logo" aria-label="Logo e nome">
            <strong>Leonardo Piassa</strong> · Dev FullStack · AI Researcher
          </div>

          <button
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Open Menu</span>
            ☰
          </button>

          <nav className={`nav ${open ? "is-open" : ""}`}>
            <a href="#about" onClick={() => setOpen(false)}>About</a>
            <a href="#projects" onClick={() => setOpen(false)}>Projects</a>
            <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
            <a href="#cv" onClick={() => setOpen(false)}>CV</a>
          </nav>
        </header>

        <section ref={heroRef} className="section hero">
          <div>
            <h1 className="reveal parallax" style={{ transitionDelay: ".05s" }}>
              Hello, I'm <span style={{ color: "#9ec1ff" }}>Leonardo Piassa</span>.
            </h1>
            <p className="reveal" style={{ transitionDelay: ".15s" }}>
              Developer focus in <b>Web Services</b>, <b>Python</b> and <b>ML/DL</b>. I create
              high-performance and beautiful products, from the backend to the UI.
            </p>
            <div className="cta reveal" style={{ transitionDelay: ".25s" }}>
              <a className="btn primary" href="#projects">View projects</a>
              <a className="btn" href="#contact">Talk to me</a>
            </div>
          </div>
          <div className="reveal" style={{ transitionDelay: ".2s" }}>
            <div className="card">
              <h3>Mainly stack</h3>
              <p className="muted">Django · React.js · PostgreSQL · Pandas/Numpy · CI/CD</p>
            </div>
            <div className="card" style={{ marginTop: 12 }}>
              <h3>Available for</h3>
              <p className="muted">Freelances, short and long-term projects, consultancy.</p>
            </div>
          </div>
        </section>

        <section id="projects" className="section narrow">
          <h2 className="reveal" style={{ marginTop: 0 }}>Featured projects</h2>
          {projects.length > 0 ? (
            <div className="grid">
              {projects.map((prj) => (
                <article key={prj.id} className="card" style={{ transitionDelay: ".05s" }}>
                  <h3>{prj.title}</h3>
                  <p className="muted">{prj.caption}</p>
                  <a className="btn" href={prj.url} target="_blank" rel="noopener noreferrer">
                    {prj.url_title}
                  </a>
              </article> 
            ))}
            </div> 
            ) : (
              <p>No projects found.</p>
            )}
        </section>

        <section id="about" className="section narrow">
          <h2 className="reveal" style={{ marginTop: 0 }}>About me</h2>
          <div className="grid">
            <div className="card reveal" style={{ transitionDelay: ".05s" }}>
              <p>
                I'm a software engineer focused on products that lack <b>UX</b> and <b>performance</b>.
                I love clean architecture, testing, and automation.
              </p>
            </div>
            <div className="card reveal" style={{ transitionDelay: ".1s" }}>
              <p>
                I work with React/Next on the front end, Django/FastAPI on the back end, and
                Postgres/Redis databases. I enjoy DevOps with Docker and CI/CD.
              </p>
            </div>
          </div>
        </section>

        <section id="cv" className="section narrow">
          <h2 className="reveal" style={{ marginTop: 0 }}>Download CV</h2>
          <div className="grid">
            <div className="card reveal" style={{ transitionDelay: ".05s" }}>
              <h3>
                English (en)
              </h3>
              <a className="btn" href={cv_english} download target="_blank" rel="noopener noreferrer">
              Click here to download.
              </a>
            </div>
            <div className="card reveal" style={{ transitionDelay: ".1s" }}>
              <h3>
                Portuguese (pt-br)
              </h3>
              <a className="btn" href={cv_portuguese} download target="_blank" rel="noopener noreferrer">
              Click here to download.
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="section narrow">
          <h2 className="reveal" style={{ marginTop: 0 }}>Contact</h2>
          <div className="card reveal" style={{ transitionDelay: ".05s" }}>
            <p>
              <a href="mailto:leonardo.piassa07@gmail.com"><img width={40} style={{ marginRight: 15 }} src={email_icon} alt="Email" /></a>
              <a href="https://www.linkedin.com/in/leonardo-piassa/" target="_blank" rel="noopener noreferrer"><img width={40} style={{ marginRight: 15 }} src={linkedin_icon} alt="LinkedIn" /></a>
              <a href="https://github.com/Leonardo2106" target="_blank" rel="noopener noreferrer"><img width={40} style={{ marginRight: 15 }} src={github_icon} alt="GitHub"/></a>
            </p>
          </div>
        </section>

        <footer>© {new Date().getFullYear()} Leonardo de Magalhães Piassa — All rights reserved.</footer>
      </div>
    </>
  );
}