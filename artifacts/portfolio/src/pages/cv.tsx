import React from "react";
import { Download } from "lucide-react";

export default function CV() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="font-display text-5xl md:text-6xl text-[#c9a96e] font-bold uppercase tracking-widest mb-2">Curriculum Vitae</h1>
          <p className="text-[#9a9db0]">waqarmoid23@iitk.ac.in • +91-9433175993</p>
        </div>
        <a
          href="/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#181c24] border border-[#c9a96e]/30 text-[#c9a96e] rounded hover:bg-[#c9a96e]/10 transition-colors uppercase font-display tracking-widest text-sm"
        >
          <Download size={16} />
          Download PDF
        </a>
      </div>

      <div className="space-y-16">

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest text-[#7c9cbf] border-b border-[#2a2f3d] pb-2 mb-6">Academic Qualifications</h2>
          <div className="space-y-6">
            {[
              { year: "2023–Present", degree: "B.Tech, Biological Sciences & Bioengineering", inst: "Indian Institute of Technology Kanpur", grade: "7.3/10 CPI" },
              { year: "2023", degree: "ISC (Class XII)", inst: "St. Thomas' Boys' School, Kolkata", grade: "95.0%" },
              { year: "2021", degree: "ICSE (Class X)", inst: "St. Thomas' Boys' School, Kolkata", grade: "98.2%" },
            ].map((q) => (
              <div key={q.year} className="flex flex-col sm:flex-row sm:gap-8">
                <div className="sm:w-36 flex-shrink-0 text-[#c9a96e] font-mono text-sm sm:text-right pt-1">{q.year}</div>
                <div>
                  <h3 className="text-lg font-bold text-[#e8e6e1]">{q.degree}</h3>
                  <p className="text-[#9a9db0]">{q.inst} • {q.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest text-[#7c9cbf] border-b border-[#2a2f3d] pb-2 mb-6">Scholastic Achievements</h2>
          <ul className="list-disc list-outside ml-5 space-y-2 text-[#e8e6e1]/90">
            <li>Secured All India Rank 14647 in JEE Advanced 2023, conducted by IIT Guwahati, among 1,80,000+ shortlisted candidates</li>
            <li>Secured All India Rank 16562 in JEE Mains 2023, conducted by the NTA, among 1.1 million candidates</li>
            <li>Secured All India Rank 941 in West Bengal Joint Entrance Examination 2023 among 1,20,000+ candidates</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest text-[#7c9cbf] border-b border-[#2a2f3d] pb-2 mb-6">Work Experience</h2>
          <div className="bg-[#181c24] border border-[#2a2f3d] p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
              <h3 className="text-xl font-bold text-[#e8e6e1]">Content Marketing Intern</h3>
              <span className="text-[#c9a96e] font-mono text-sm mt-1 sm:mt-0">June '25 – July '25</span>
            </div>
            <p className="text-[#9a9db0] mb-4 italic">Unstop</p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-[#e8e6e1]/80">
              <li>Aimed to contribute to the database of engaging and challenging questions for quizzes on the Unstop platform</li>
              <li>Researched various online newsletters, articles and magazines to scout for trivia and relevant images</li>
              <li>Authored 1,000+ multiple-choice questions across business sectors and diverse genres, enhancing content depth and variety on the platform and contributing to improved user engagement</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest text-[#7c9cbf] border-b border-[#2a2f3d] pb-2 mb-6">Key Projects</h2>
          <div className="space-y-4">

            <div className="bg-[#181c24] border border-[#2a2f3d] p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                <h3 className="font-bold text-[#e8e6e1] text-lg leading-tight">Interactive Stock Performance Visualization</h3>
                <span className="text-[#9a9db0] font-mono text-sm mt-1 sm:mt-0 sm:ml-4 flex-shrink-0">May–Jul '25</span>
              </div>
              <p className="text-[#c9a96e] text-sm mb-3">CS661 Course Project | Prof. Soumya Dutta</p>
              <ul className="list-disc list-outside ml-5 space-y-1.5 text-[#e8e6e1]/80 text-sm">
                <li>Visualized stock performance alongside macroeconomic indicators (inflation, GDP) and market sentiment</li>
                <li>Preprocessed financial time-series data using Python, computed technical indicators such as RSI and MACD, and derived sentiment scores using NLTK/VADER; developed an interactive frontend using D3.js and Plotly</li>
                <li>Aggregated multi-source data in real time and identified correlations between major events and sector performance</li>
              </ul>
            </div>

            <div className="bg-[#181c24] border border-[#2a2f3d] p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                <h3 className="font-bold text-[#e8e6e1] text-lg leading-tight">Plant Stress Resistance Classification via Evolutionary Networks</h3>
                <span className="text-[#9a9db0] font-mono text-sm mt-1 sm:mt-0 sm:ml-4 flex-shrink-0">May–Jul '25</span>
              </div>
              <p className="text-[#c9a96e] text-sm mb-3">Prof. Rajesh M. Hegde</p>
              <ul className="list-disc list-outside ml-5 space-y-1.5 text-[#e8e6e1]/80 text-sm">
                <li>Classified plant proteins into six abiotic stress categories by leveraging sequence-derived amino-acid composition and dN/dS ratio–based evolutionary pressure network, benchmarking against the ASRPro model</li>
                <li>Extracted amino-acid frequencies, computed dN/dS ratios, built a similarity graph linked by 90% sequence similarity and proximal selection sites, and applied small-world network concepts to derive centrality and clustering measures</li>
                <li>Trained an SVM model on the combined feature set, achieving 61% test accuracy, on par with ASRPro's reported performance</li>
              </ul>
            </div>

            <div className="bg-[#181c24] border border-[#2a2f3d] p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                <h3 className="font-bold text-[#e8e6e1] text-lg leading-tight">Stochastic Modelling of Financial Derivatives</h3>
                <span className="text-[#9a9db0] font-mono text-sm mt-1 sm:mt-0 sm:ml-4 flex-shrink-0">May–Jul '25</span>
              </div>
              <p className="text-[#c9a96e] text-sm mb-3">Stamatics, IIT Kanpur</p>
              <ul className="list-disc list-outside ml-5 space-y-1.5 text-[#e8e6e1]/80 text-sm">
                <li>Implemented the Black-Scholes-Merton framework in Python to price European and Asian Options</li>
                <li>Updating the pricing engine with Monte Carlo simulation to price Asian and barrier options under Brownian Motion</li>
                <li>The Heston stochastic-volatility model will be calibrated to match implied volatilities derived from NSE option-chain data</li>
              </ul>
            </div>

            <div className="bg-[#181c24] border border-[#2a2f3d] p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                <h3 className="font-bold text-[#e8e6e1] text-lg leading-tight">Market Driven Brand Repositioning</h3>
                <span className="text-[#9a9db0] font-mono text-sm mt-1 sm:mt-0 sm:ml-4 flex-shrink-0">June '25</span>
              </div>
              <p className="text-[#c9a96e] text-sm mb-3">MBA631 Course Project | Prof. Amit Shukla</p>
              <ul className="list-disc list-outside ml-5 space-y-1.5 text-[#e8e6e1]/80 text-sm">
                <li>Conducted 4P analysis of Spotify (currently positioned as a leader in personalized music discovery) and devised a repositioning strategy along with a TV Commercial</li>
                <li>Performed market research and redefined Spotify's offerings to transform it into a platform for connecting people</li>
                <li>Delivered a 30-minute presentation and shot an ad video outlining the in-depth 4P reassessment and proposed strategic roadmap</li>
              </ul>
            </div>

            <div className="bg-[#181c24] border border-[#2a2f3d] p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                <h3 className="font-bold text-[#e8e6e1] text-lg leading-tight">BioBytes</h3>
                <span className="text-[#9a9db0] font-mono text-sm mt-1 sm:mt-0 sm:ml-4 flex-shrink-0">May–Jul '24</span>
              </div>
              <p className="text-[#c9a96e] text-sm mb-3">BioSoc, IIT Kanpur</p>
              <ul className="list-disc list-outside ml-5 space-y-1.5 text-[#e8e6e1]/80 text-sm">
                <li>Studied data preprocessing and supervised/unsupervised algorithms (K-Means, PCA, Logistic Regression, Random Forest, KNN, SVM) alongside evaluation metrics</li>
                <li>Built a model to predict diabetic patient readmission (within 30 days, after 30 days, or not readmitted), achieving 78% accuracy and F1 score of 75%</li>
                <li>Used the ChEMBL database and built a drug discovery model for SARS-CoV-2 by applying Lipinski's rules</li>
              </ul>
            </div>

          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest text-[#7c9cbf] border-b border-[#2a2f3d] pb-2 mb-6">Technical Skills</h2>
          <div className="space-y-4">
            <div>
              <span className="text-[#c9a96e] font-bold uppercase text-sm tracking-wider block mb-2">Programming Languages</span>
              <p className="text-[#e8e6e1]">C, Java, C++, SQL, Python</p>
            </div>
            <div>
              <span className="text-[#c9a96e] font-bold uppercase text-sm tracking-wider block mb-2">Python Libraries</span>
              <p className="text-[#e8e6e1]">NumPy, Pandas, Scikit-Learn, Matplotlib, Seaborn, Librosa, Plotly, VTK, TextBlob, NLTK, VADER, Talib, BioPython, NetworkX</p>
            </div>
            <div>
              <span className="text-[#c9a96e] font-bold uppercase text-sm tracking-wider block mb-2">Tools & Platforms</span>
              <p className="text-[#e8e6e1]">Excel, PowerPoint, Jupyter Notebook, Google Colab, Kaggle, LaTeX, Power BI, GitHub, Paraview</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest text-[#7c9cbf] border-b border-[#2a2f3d] pb-2 mb-6">Relevant Courses</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Big Data Visual Analytics",
              "Marketing Management",
              "Introduction to Management",
              "Applied Probability and Statistics",
              "Linear Algebra & Differential Equations",
              "Introduction to Computing",
              "Governance of Global Value Chains",
            ].map(c => (
              <span key={c} className="px-3 py-1 bg-[#232840] text-[#a8c5e0] rounded-full text-sm border border-[#2a2f3d]">
                {c}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest text-[#7c9cbf] border-b border-[#2a2f3d] pb-2 mb-6">Positions of Responsibility</h2>
          <div className="space-y-4">
            {[
              {
                role: "Events Secretary",
                org: "Media & Cultural Council, IIT Kanpur",
                period: "June '24 – April '25",
                bullets: [
                  "Secured sponsorships and onboarded multiple vendor stalls for events like Treasure Hunts and Cultural Nexus (Fresher's)",
                  "Part of organising and conducting teams for Alfaaz (Literary Fest) and Cultural Extravaganza",
                ]
              },
              {
                role: "Secretary",
                org: "Quiz Club, IIT Kanpur",
                period: "April '24 – March '25",
                bullets: [
                  "Represented the institute at inter-collegiate competitions, including Inter-IIT and Nihilanth, the Inter-IIT-IIM Quiz Fest",
                ]
              },
              {
                role: "Academic Mentor",
                org: "Institute Counselling Service, IIT Kanpur",
                period: "July '24 – March '25",
                bullets: [
                  "Conducted one-to-one English Communication Classes for first-year UG students who were schooled in vernacular languages",
                ]
              },
            ].map((p) => (
              <div key={p.role + p.org} className="bg-[#181c24] border border-[#2a2f3d] p-5 rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                  <h3 className="font-bold text-[#e8e6e1]">{p.role} <span className="font-normal text-[#9a9db0]">— {p.org}</span></h3>
                  <span className="text-[#c9a96e] font-mono text-sm mt-1 sm:mt-0 sm:ml-4 flex-shrink-0">{p.period}</span>
                </div>
                <ul className="list-disc list-outside ml-5 mt-2 space-y-1 text-[#e8e6e1]/80 text-sm">
                  {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl uppercase tracking-widest text-[#7c9cbf] border-b border-[#2a2f3d] pb-2 mb-6">Extra-Curricular Activities</h2>
          <ul className="list-disc list-outside ml-5 space-y-2 text-[#e8e6e1]/90">
            <li>Won 2 Bronze medals in the General Quiz and Sports Quiz at Inter-IIT Cultural Meet 6.0 and 8.0 respectively</li>
            <li>Secured 2nd position and won a smartphone in the India Quiz at Policy Conclave, organized by the UP Ministry of Tourism</li>
            <li>Secured 1st position in the Fresher's Case Study Competition, organised by IIT Kanpur Consulting Group</li>
            <li>Secured 3rd place in the Bithoor Mahotsav Quiz, organised by the UP Ministry of Culture, winning ₹15,000 cash prize</li>
            <li>Solved consulting problem statements as part of Hall 12's team at Takneek '23 and '24, IITK's Science & Tech Championship</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
